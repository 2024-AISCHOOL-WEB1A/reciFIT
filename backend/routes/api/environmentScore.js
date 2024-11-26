const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const authenticateAccessToken = require("../../middlewares/jwtAuthentication");
const { isValidDate } = require("../../utils/validation");

router.get("/", authenticateAccessToken, async (req, res) => {
  const { month_year } = req.query;
  const { userIdx } = req.user;

  // month_year 정규화 및 기본값 설정 (YYYY-MM-01)
  const normalizedMonthYear =
    (month_year ? month_year.trim() + "-01" : null) ||
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}-01`;

  // 유효성 검사 1: 필수 쿼리
  if (!normalizedMonthYear) {
    return res
      .status(400)
      .json({ message: "month_year query parameter is required" });
  }

  // 유효성 검사 2: 월 형태 검사
  if (!isValidDate(normalizedMonthYear)) {
    return res.status(400).json({ message: "Invalid month_year format" });
  }

  try {
    // 환경 점수 및 차감된 이유와 재료 정보를 가져오는 쿼리
    // const [rows] = await db.execute(
    //   `SELECT
    //     es.env_score,
    //     dl.reason,
    //     dl.decrement_date,
    //     ui.ingre_idx,
    //     ui.ingre_name,
    //     ui.quantity,
    //     ui.total_quantity,
    //     ui.unit,
    //     ui.expired_date
    //   FROM TB_ENVIRONMENT_SCORE es
    //   LEFT JOIN TB_SCORE_DECREMENT_LOG dl ON es.env_idx = dl.env_idx
    //   LEFT JOIN TB_USER_INGREDIENT ui ON dl.u_ingre_idx = ui.u_ingre_idx
    //   WHERE es.user_idx = ? AND es.month_year = ?`,
    //   [userIdx, normalizedMonthYear]
    // );
    const [rows] = await db.execute(
      `SELECT 
        es.env_score,
        dl.reason,
        dl.decrement_date,
        ui.ingre_idx,
        ui.ingre_name,
        ui.quantity,
        ui.total_quantity,
        ui.unit,
        ui.expired_date
      FROM TB_ENVIRONMENT_SCORE es
      LEFT JOIN TB_SCORE_DECREMENT_LOG dl ON es.env_idx = dl.env_idx
      LEFT JOIN TB_USER_INGREDIENT ui ON dl.u_ingre_idx = ui.u_ingre_idx
      WHERE es.user_idx = ? 
        AND es.month_year = ? 
        AND ui.u_ingre_idx IS NOT NULL`,
      [userIdx, normalizedMonthYear]
    );

    // 데이터가 없을 경우: 점수 기본값 100, 로그는 빈 배열
    if (rows.length === 0) {
      return res.status(200).json({
        envScore: 100,
        monthYear: normalizedMonthYear,
        decrementLogs: [],
      });
    }

    // 환경 점수 및 차감 로그를 그룹화하여 응답 생성
    const response = {
      envScore: rows[0].env_score,
      monthYear: normalizedMonthYear,
      decrementLogs: rows.map((log) => ({
        reason: log.reason,
        decrementDate: log.decrement_date,
        ingredient: {
          ingreIdx: log.ingre_idx,
          ingreName: log.ingre_name,
          quantity: log.quantity,
          unit: log.unit,
          totalQuantity: log.total_quantity,
          expiredDate: log.expired_date,
        },
      })),
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching environment score or logs:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.patch("/", authenticateAccessToken, async (req, res) => {
  const { u_ingre_idx, reason } = req.body; // 식재료 ID와 선택적인 차감 이유
  const { userIdx } = req.user;
  const { month_year } = req.query; // 월 정보

  // month_year 정규화 및 기본값 설정 (YYYY-MM-01)
  const normalizedMonthYear =
    (month_year ? month_year.trim() + "-01" : null) ||
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}-01`;

  // 유효성 검사 1: 필수 필드 확인
  if (!u_ingre_idx) {
    return res.status(400).json({
      message: "Ingredient id is required",
    });
  }

  // 유효성 검사 2: 월 형식 확인
  if (!isValidDate(normalizedMonthYear)) {
    return res.status(400).json({
      message: "Invalid month_year format",
    });
  }

  try {
    // 환경 점수 가져오기
    const [envRows] = await db.execute(
      `SELECT env_idx, env_score
        FROM TB_ENVIRONMENT_SCORE
        WHERE user_idx = ? AND month_year = ?`,
      [userIdx, normalizedMonthYear]
    );

    // 환경 점수가 없으면 새로 생성
    let envIdx;
    let envScore;
    if (envRows.length === 0) {
      // 새 환경 점수 생성 (기본값 99점, 1점 감점 포함)
      const [insertResult] = await db.execute(
        `INSERT INTO TB_ENVIRONMENT_SCORE 
          (user_idx, env_score, month_year)
          VALUES (?, ?, ?)`,
        [userIdx, 99, normalizedMonthYear]
      );
      envIdx = insertResult.insertId;
      envScore = 99;
    } else {
      envIdx = envRows[0].env_idx;
      envScore = Math.max(envRows[0].env_score - 1, 0);

      // 환경 점수 업데이트
      await db.execute(
        `UPDATE TB_ENVIRONMENT_SCORE
          SET env_score = ?
          WHERE env_idx = ?`,
        [envScore, envIdx]
      );
    }

    // 차감 로그 기록
    await db.execute(
      `INSERT INTO TB_SCORE_DECREMENT_LOG 
        (user_idx, u_ingre_idx, env_idx, reason)
        VALUES (?, ?, ?, ?)`,
      [userIdx, u_ingre_idx, envIdx, reason || "Expired ingredient"]
    );

    return res.status(200).json({
      message: "Environment score updated successfully",
      env_score: envScore,
    });
  } catch (err) {
    console.error("Error updating environment score:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
