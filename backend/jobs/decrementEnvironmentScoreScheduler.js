const cron = require("node-cron");
const db = require("../config/db");

// 환경 점수 차감 작업 스케줄러
const startDecrementEnvironmentScoreJob = () => {
  // 매일 01:00에 실행하도록 설정
  cron.schedule("0 1 * * *", async () => {
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
        `SELECT user_idx, u_ingre_idx
          FROM TB_USER_INGREDIENT
          WHERE expired_date = ? AND quantity > 0`,
        [yesterdayString]
      );

      const affectedUserIds = [
        ...new Set(expiredIngredients.map((item) => item.user_idx)),
      ];

      // 먼저, 유저별 환경 점수가 존재하는지 확인하고, 없으면 기본 점수를 추가
      const checkUserScoresPromises = affectedUserIds.map(async (user_idx) => {
        // 해당 유저의 environment score가 존재하는지 확인
        const [existingScore] = await db.execute(
          `SELECT env_score, env_idx
            FROM TB_ENVIRONMENT_SCORE 
            WHERE user_idx = ? AND month_year = ?`,
          [user_idx, yearMonth]
        );

        if (existingScore.length === 0) {
          // 환경 점수가 없다면 99점으로 새로 추가 (이 과정에서 이미 1점 감점)
          await db.execute(
            `INSERT INTO TB_ENVIRONMENT_SCORE 
              (user_idx, env_score, month_year)
              VALUES (?, ?, ?)`,
            [user_idx, 99, yearMonth]
          );
          console.log(
            `Environment score created for user ${user_idx} with 100 points`
          );
        } else {
          // 환경 점수가 있다면 차감
          await db.execute(
            `UPDATE TB_ENVIRONMENT_SCORE 
              SET env_score = GREATEST(env_score - 1, 0)
              WHERE user_idx = ? AND month_year = ?`,
            [user_idx, yearMonth]
          );
        }

        // 점수 차감 로그 기록
        const ingredient = expiredIngredients.find(
          (item) => item.user_idx === user_idx
        );

        await db.execute(
          `INSERT INTO TB_SCORE_DECREMENT_LOG 
            (user_idx, u_ingre_idx, env_idx, reason)
            SELECT ?, ?, env_idx, ?
              FROM TB_ENVIRONMENT_SCORE
              WHERE user_idx = ? AND month_year = ?`,
          [
            user_idx,
            ingredient.u_ingre_idx,
            "Expired ingredient",
            user_idx,
            yearMonth,
          ]
        );
      });

      // 모든 유저에 대해 처리
      await Promise.all(checkUserScoresPromises);
      console.log(
        "Environment scores decremented for users with expired ingredients."
      );
    } catch (err) {
      console.error("Error while decrementing environment scores:", err);
    }
  });
};

module.exports = { startDecrementEnvironmentScoreJob };
