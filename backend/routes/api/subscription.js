const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const authenticateAccessToken = require("../../middlewares/jwtAuthentication");
const { sendEmail } = require("../../config/mailer");

// 테스트용
const webPush = require("web-push");

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

webPush.setVapidDetails(
  "mailto:projectrecifit@gmail.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// 구독 등록
router.post("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { endpoint, keys } = req.body;

  try {
    await db.execute(
      `INSERT INTO TB_SUBSCRIPTION 
        (user_idx, endpoint, keys_auth, keys_p256dh) 
        VALUES (?, ?, ?, ?)`,
      [userIdx, endpoint, keys.auth, keys.p256dh]
    );
    return res.status(201).json({ message: "subscription added successfully" });
  } catch (err) {
    // 중복된 항목 처리
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Subscription already exists" });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 구독 취소
router.delete("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { endpoint } = req.body;

  try {
    await db.query(
      `DELETE 
        FROM TB_SUBSCRIPTION 
        WHERE user_idx = ? AND endpoint = ?`,
      [userIdx, endpoint]
    );
    return res
      .status(200)
      .json({ message: "subscription canceled successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 테스트 라우터: 요청을 보낸 사용자에게만 알림 전송
router.post("/test", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;

  if (!userIdx) {
    return res.status(400).json({ message: "userIdx is required." });
  }

  try {
    // 대상 사용자 구독 정보 조회
    const [subscriptions] = await db.execute(
      `SELECT endpoint, keys_auth, keys_p256dh
       FROM TB_SUBSCRIPTION
       WHERE user_idx = ?`,
      [userIdx]
    );

    if (subscriptions.length === 0) {
      return res
        .status(404)
        .json({ message: "No subscriptions found for this user." });
    }

    // 첫 번째 구독 정보 사용
    const subscription = subscriptions[0];
    const sub = {
      endpoint: subscription.endpoint,
      keys: {
        auth: subscription.keys_auth,
        p256dh: subscription.keys_p256dh,
      },
    };

    // 이메일 전송
    const [user] = await db.execute(
      `SELECT oauth_email 
        FROM TB_USER 
        WHERE user_idx = ?`,
      [userIdx]
    );
    const email = user[0]?.oauth_email;
    console.log(email);

    if (email) {
      await sendEmail(email, "감자").catch((err) => {
        console.error(`Failed to send email to ${email}:`, err);
      });
    } else {
      console.warn(`User ${userIdx} does not have a valid email.`);
    }

    // 알림 페이로드 생성
    const payload = JSON.stringify({
      title: "reciFIT 유통기한 임박 알림",
      body: `감자의 유통기한이 3일 이내입니다. 빨리 소진해주세요!`,
    });

    // 푸시 알림 전송
    await webPush.sendNotification(sub, payload).catch((err) => {
      if (err.statusCode === 410) {
        // 만료된 구독 제거
        db.execute(`DELETE FROM TB_SUBSCRIPTION WHERE endpoint = ?`, [
          subscription.endpoint,
        ]);
        console.log("Removed expired subscription:", subscription.endpoint);
      } else {
        console.error("Failed to send notification:", err);
        throw err;
      }
    });

    return res.json({
      message: "Notification sent successfully to the requesting user.",
    });
  } catch (err) {
    console.error("Error sending notification:", err);
    return res.status(500).json({ message: "Error sending notification." });
  }
});

module.exports = router;
