const cron = require("node-cron");
const db = require("../config/db");

// 환경 점수 차감 작업 스케줄러
const startDecrementEnvironmentScoreJob = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running decrement environment score job...");

    // 하루 전 날짜 계산
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = `${yesterday.getFullYear()}-${String(
      yesterday.getMonth() + 1
    ).padStart(2, "0")}-${String(yesterday.getDate()).padStart(2, "0")}`;

    // 현재 달의 첫 날짜 (yyyy-mm-01) 계산
    const currentDate = new Date();
    const yearMonth = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-01`;

    try {
      // 유효한 유저의 만료된 재료를 조회하여 환경 점수 차감
      const [expiredIngredients] = await db.execute(
        `SELECT user_idx
         FROM TB_USER_INGREDIENT
         WHERE expired_date = ? AND quantity > 0`,
        [yesterdayString]
      );

      const affectedUserIds = [
        ...new Set(expiredIngredients.map((item) => item.user_idx)),
      ];
      const updatePromises = affectedUserIds.map((user_idx) => {
        return db.execute(
          `UPDATE TB_ENVIRONMENT_SCORE 
           SET env_score = GREATEST(env_score - 1, 0)
           WHERE user_idx = ? AND month_year = ?`,
          [user_idx, yearMonth]
        );
      });

      await Promise.all(updatePromises);
      console.log(
        "Environment scores decremented for users with expired ingredients."
      );
    } catch (err) {
      console.error("Error while decrementing environment scores:", err);
    }
  });
};

module.exports = { startDecrementEnvironmentScoreJob };
