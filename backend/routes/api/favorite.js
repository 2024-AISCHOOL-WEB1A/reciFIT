const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const authenticateAccessToken = require("../../Middlewares/jwtAuthentication");
const { isValidIdx } = require("../../utils/validation");
const { toCamelCase } = require("../../utils/commonUtils");

// 유저의 모든 즐겨찾기 조회
router.get("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;

  // userIdx가 없을 경우 처리
  if (!userIdx) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  try {
    // 즐겨찾기와 레시피 정보를 JOIN하여 가져오기
    const [favorites] = await db.execute(
      `SELECT 
        f.rcp_idx, 
        f.cooked_yn, 
        f.favorite_yn, 
        r.ck_name, 
        r.ck_method, 
        r.ck_category, 
        r.ck_ingredient_category, 
        r.ck_type, 
        r.ck_instructions, 
        r.ck_ingredients, 
        r.ck_description, 
        r.ck_photo_url, 
        r.ck_amount, 
        r.ck_time, 
        r.ck_difficulty 
      FROM TB_FAVORITE f
      JOIN TB_RECIPE r ON f.rcp_idx = r.rcp_idx
      WHERE f.user_idx = ? AND f.favorite_yn = 'Y'`,
      [userIdx]
    );

    // 결과를 카멜 케이스로 변환 (필요 시)
    return res.status(200).json({ recipes: toCamelCase(favorites) });
  } catch (err) {
    console.error(err);
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
  const { rcpIdx, cookedYn, favoriteYn } = req.body;

  // 유효성 검사 1: idx
  if (!isValidIdx(rcpIdx)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  // 유효성 검사 2: cookedYn
  if (
    !cookedYn ||
    !(cookedYn.toUpperCase() === "Y" || cookedYn.toUpperCase() === "N")
  ) {
    return res.status(400).json({ message: "Invalid cookedYn" });
  }

  // 유효성 검사 3: favoriteYn
  if (
    favoriteYn &&
    !(favoriteYn.toUpperCase() === "Y" || favoriteYn.toUpperCase() === "N")
  ) {
    return res.status(400).json({ message: "Invalid favoriteYn" });
  }

  try {
    await db.execute(
      `INSERT INTO TB_FAVORITE 
        (user_idx, rcp_idx, cooked_yn, favorite_yn) 
        VALUES (?, ?, ?, ?)`,
      [userIdx, rcpIdx, cookedYn.toUpperCase(), favoriteYn.toUpperCase() || "Y"]
    );
    return res.status(201).json({ message: "Favorite added successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Favorite already exists" });
    }
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 즐겨찾기 수정
router.patch("/:rcpIdx", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { rcpIdx } = req.params;
  const { cookedYn, favoriteYn } = req.body;

  // 유효성 검사 1: idx
  if (!isValidIdx(rcpIdx)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  // 유효성 검사 2: cookedYn
  if (
    cookedYn &&
    !(cookedYn.toUpperCase() === "Y" || cookedYn.toUpperCase() === "N")
  ) {
    return res.status(400).json({ message: "Invalid cookedYn" });
  }

  // 유효성 검사 3: favoriteYn
  if (
    favoriteYn &&
    !(favoriteYn.toUpperCase() === "Y" || favoriteYn.toUpperCase() === "N")
  ) {
    return res.status(400).json({ message: "Invalid favoriteYn" });
  }

  // 동적으로 업데이트할 필드 준비
  const updateFields = [];
  const values = [];

  if (cookedYn) {
    updateFields.push("cooked_yn = ?");
    values.push(cookedYn.toUpperCase());
  }

  if (favoriteYn) {
    updateFields.push("favorite_yn = ?");
    values.push(favoriteYn.toUpperCase());
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  // values 배열에 userIdx와 rcpIdx를 추가
  values.push(userIdx, rcpIdx);

  const query = `
    UPDATE TB_FAVORITE
    SET ${updateFields.join(", ")}
    WHERE user_idx = ? AND rcp_idx = ?
  `;
  try {
    await db.execute(query, values);
    return res.status(200).json({ message: "Favorite updated successfully" });
  } catch (err) {
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
