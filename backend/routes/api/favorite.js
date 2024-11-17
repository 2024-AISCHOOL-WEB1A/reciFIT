const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const authenticateAccessToken = require("../../Middlewares/jwtAuthentication");
const { isValidIdx } = require("../../utils/validation");

// 유저의 모든 즐겨찾기 조회
router.get("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;

  try {
    const [favorites] = await db.execute(
      `SELECT *
        FROM TB_FAVORITE
        WHERE user_idx = ?`,
      [userIdx]
    );

    return res.status(200).json(favorites);
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 레시피 기준 즐겨찾기 조회
router.get("/:rcpIdx", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { rcpIdx } = req.params;

  // 유효성 검사
  if (!isValidIdx(rcpIdx)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  try {
    const [favorites] = await db.execute(
      `SELECT *
        FROM TB_FAVORITE
        WHERE user_idx = ? AND rcpIdx = ?`,
      [userIdx, rcpIdx]
    );
    return res.status(200).json(favorites[0]);
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 즐겨찾기 추가
router.post("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { rcpIdx } = req.body;

  // 유효성 검사
  if (!isValidIdx(rcpIdx)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  try {
    await db.execute(
      `INSERT INTO TB_FAVORITE (user_idx, rcp_idx) VALUES (?, ?)`,
      [userIdx, rcpIdx]
    );
    return res.status(201).json({ message: "Favorite added successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Favorite already exists" });
    }
    // console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 즐겨찾기 수정
router.patch("/:rcpIdx", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { rcpIdx } = req.params;
  const { cookedYn } = req.body;

  // 유효성 검사 1: idx
  if (!isValidIdx(rcpIdx)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  // 유효성 검사 2: cookedYn
  if (
    !cookedYn ||
    !(cookedYn.upperCase() === "Y" || cookedYn.upperCase() === "N")
  ) {
    return res.status(400).json({ message: "Invalid cookedYn" });
  }

  try {
    await db.execute(
      `UPDATE TB_FAVORITE
        SET cooked_yn = ?
        WHERE user_idx = ? AND rcp_idx = ?`,
      [cookedYn.upperCase(), userIdx, rcpIdx]
    );
    return res.status(200).json({ message: "Favorite updated successfully" });
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 즐겨찾기 삭제
router.delete("/:rcpIdx", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { rcpIdx } = req.params;

  try {
    await db.execute(
      `DELETE FROM TB_FAVORITE
        WHERE user_idx = ? AND rcp_idx = ?`,
      [userIdx, rcpIdx]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    return res.status(200).json({ message: "Favorite deleted successfully" });
  } catch (err) {
    // console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
