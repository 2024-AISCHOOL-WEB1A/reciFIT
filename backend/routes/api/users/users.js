const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const authenticateAccessToken = require("../../../Middlewares/jwtAuthentication");
const {
  isValidNickname,
  isValidIngredientsFormat,
} = require("../../../utils/validation");
const { toCamelCase } = require("../../../utils/commonUtils");

// 회원 정보 조회
router.get("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;

  try {
    const [rows] = await db.execute(
      `SELECT 
        user_idx, 
        oauth_provider, 
        oauth_email, 
        nickname, 
        status, 
        role, 
        preferred_ingredients, 
        disliked_ingredients, 
        non_consumable_ingredients,
        created_at,
        last_login
      FROM TB_USER
      WHERE user_idx = ?`,
      [userIdx]
    );
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(toCamelCase(user));
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 회원 정보 수정
router.patch("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const {
    nickname,
    preferredIngredients,
    dislikedIngredients,
    nonConsumableIngredients,
  } = req.body;

  // 유효성 검사 1: 닉네임
  if (nickname && !isValidNickname(nickname)) {
    return res.status(400).json({ message: "Invalid nickname" });
  }

  // 유효성 검사 2: 재료
  if (
    (preferredIngredients && !isValidIngredientsFormat(preferredIngredients)) ||
    (dislikedIngredients && !isValidIngredientsFormat(dislikedIngredients)) ||
    (nonConsumableIngredients &&
      !isValidIngredientsFormat(nonConsumableIngredients))
  ) {
    return res.status(400).json({ message: "Invalid ingredients format" });
  }

  // 업데이트할 필드를 동적으로 구성
  const fields = [];
  const values = [];

  if (nickname) {
    fields.push("nickname = ?");
    values.push(nickname);
  }
  if (preferredIngredients) {
    fields.push("preferred_ingredients = ?");
    values.push(preferredIngredients);
  }
  if (dislikedIngredients) {
    fields.push("disliked_ingredients = ?");
    values.push(dislikedIngredients);
  }
  if (nonConsumableIngredients) {
    fields.push("non_consumable_ingredients = ?");
    values.push(nonConsumableIngredients);
  }

  // 업데이트할 필드가 없으면 에러
  if (fields.length === 0) {
    return res.status(400).json({ message: "No fields to update" });
  }

  // 동적 쿼리 생성
  const query = `
    UPDATE TB_USER
    SET ${fields.join(", ")}
    WHERE user_idx = ?
  `;
  values.push(userIdx); // WHERE 절의 user_idx 값 추가

  try {
    const [result] = await db.execute(query, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json({ message: "Update successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 회원 탈퇴
router.delete("/", authenticateAccessToken, async (req, res) => {
  // const { userIdx } = req.user;
  // try {
  //   const [result] = await db.execute("DELETE FROM TB_USER WHERE user_idx = ?", [
  //     userIdx,
  //   ]);
  //   if (result.affectedRows === 0) {
  //     return res.status(404).json({ message: "Not found" });
  //   }
  //   return res.status(200).json({ message: "Delete successful" });
  // } catch (error) {
  //   return res.status(500).json({ message: "Internal server error" });
  // }
});

module.exports = router;
