const cron = require("node-cron");
const db = require("../config/db");
require("dotenv").config();
const webPush = require("web-push");
const { sendEmail } = require("../config/mailer");

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webPush.setVapidDetails(
  "mailto:projectrecifit@gmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

const startPushNotificationJob = () => {
  // 매일 07:00에 실행
  cron.schedule("0 7 * * *", async () => {
    console.log("Running push notification and email job...");

    const today = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 3);
    const todayString = today.toISOString().split("T")[0];
    const threeDaysLaterString = threeDaysLater.toISOString().split("T")[0];

    try {
      // 유통기한 임박 재료가 있는 모든 유저 조회
      const [usersWithExpiringIngredients] = await db.execute(
        `SELECT DISTINCT u.user_idx, u.oauth_email, u.nickname
         FROM TB_USER u
         JOIN TB_USER_INGREDIENT ui ON u.user_idx = ui.user_idx
         WHERE ui.expired_date BETWEEN ? AND ? AND ui.quantity > 0
           AND u.status = 'active'`,
        [todayString, threeDaysLaterString]
      );

      if (usersWithExpiringIngredients.length === 0) {
        console.log("No users with expiring ingredients found. Skipping.");
        return;
      }

      // 각 유저에게 푸시 및 이메일 알림 전송
      const notificationPromises = usersWithExpiringIngredients.map(
        async (user) => {
          const userIdx = user.user_idx;
          const email = user.oauth_email;

          // 해당 유저의 유통기한 임박 재료 조회
          const [ingredients] = await db.execute(
            `SELECT ingredient_name, expired_date
             FROM TB_USER_INGREDIENT
             WHERE user_idx = ? AND expired_date BETWEEN ? AND ? AND quantity > 0`,
            [userIdx, todayString, threeDaysLaterString]
          );

          if (ingredients.length === 0) {
            return; // 유통기한 임박 재료가 없는 경우
          }

          // 알림 메시지 생성
          const ingredientList = ingredients
            .map(
              (item) =>
                `${item.ingredient_name} (유통기한: ${item.expired_date})`
            )
            .join(", ");
          const payload = JSON.stringify({
            title: "reciFIT 유통기한 임박 알림",
            body: `${ingredientList}의 유통기한이 3일 이내입니다. 빨리 소진해주세요!`,
          });

          // 이메일 전송
          await sendEmail(email, ingredientList).catch((err) => {
            console.error(`Failed to send email to ${email}:`, err);
          });

          // 푸시 알림 전송
          const [subscriptions] = await db.execute(
            `SELECT endpoint, keys_auth, keys_p256dh
             FROM TB_SUBSCRIPTION
             WHERE user_idx = ?`,
            [userIdx]
          );

          const pushPromises = subscriptions.map((subscription) => {
            const sub = {
              endpoint: subscription.endpoint,
              keys: {
                auth: subscription.keys_auth,
                p256dh: subscription.keys_p256dh,
              },
            };

            return webPush.sendNotification(sub, payload).catch((err) => {
              if (err.statusCode === 410) {
                // 만료된 구독 제거
                db.execute(`DELETE FROM TB_SUBSCRIPTION WHERE endpoint = ?`, [
                  subscription.endpoint,
                ]);
                console.log(
                  "Removed expired subscription:",
                  subscription.endpoint
                );
              } else {
                console.error("Failed to send push notification:", err);
              }
            });
          });

          await Promise.all(pushPromises);
        }
      );

      await Promise.all(notificationPromises);
      console.log(
        "Push notifications and emails sent to users with expiring ingredients."
      );
    } catch (err) {
      console.error("Error in push notification and email job:", err);
    }
  });
};

module.exports = { startPushNotificationJob };
