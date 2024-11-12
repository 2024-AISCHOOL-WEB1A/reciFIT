const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const authenticateAccessToken = require("../../Middlewares/jwtAuthentication");
const { isValidMonth } = require("../../utils/validation");

router.get("/", authenticateAccessToken, async (req, res) => {
  const { month_year } = req.query;
  const { userIdx } = req.user;

  // 유효성 검사 1: 필수 쿼리
  if (!month_year) {
    return res
      .status(400)
      .json({ message: "month_year query parameter is required" });
  }

  // 유효성 검사 2: 월 형태 검사
  if (!isValidMonth(month_year)) {
    return res.status(400).json({ message: "Invalid month_year format" });
  }

  try {
    const [rows] = await db.query(
      `SELECT env_score 
       FROM TB_ENVIRONMENT_SCORE
       WHERE user_idx = ? AND month_year = ?
       ORDER BY month_year DESC LIMIT 1`,
      [userIdx, month_year]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Environment score not found",
      });
    }

    return res.status(200).json({
      env_score: rows[0].env_score,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
