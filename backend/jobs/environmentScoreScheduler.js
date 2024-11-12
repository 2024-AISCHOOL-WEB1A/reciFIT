const cron = require("node-cron");
const db = require("../config/db");

// 환경 점수 할당 작업 스케줄러
const startEnvironmentScoreJob = () => {
  cron.schedule("0 0 1 * *", async () => {
    console.log("Running environment score job...");

    // 현재 날짜를 yyyy-mm-01 형식으로 생성
    const currentDate = new Date();
    const yearMonth = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, "0")}-01`;

    try {
      // 모든 유저에게 환경 점수 100점 할당
      const [users] = await db.query("SELECT user_idx FROM TB_USER");
      const insertPromises = users.map((user) => {
        return db.query(
          `INSERT INTO TB_ENVIRONMENT_SCORE (user_idx, env_score, month_year) VALUES (?, 100, ?) 
           ON DUPLICATE KEY UPDATE env_score = 100`,
          [user.user_idx, yearMonth]
        );
      });

      await Promise.all(insertPromises);
      console.log("Environment scores updated for all users.");
    } catch (err) {
      console.error("Error while inserting environment scores:", err);
    }
  });
};

module.exports = { startEnvironmentScoreJob };
