const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const authenticateAccessToken = require("../../../Middlewares/jwtAuthentication");
const {
  isValidDate,
  isStartDateBeforeEndDate,
} = require("../../../utils/validation");

// 유저의 전체 식재료 불러오기
router.get("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  let { ingreName, purchaseStart, purchaseEnd, expiredStart, expiredEnd } =
    req.query;

  // 유효성 검사 1 : 날짜 형식이 올바른지 확인
  const dates = [purchaseStart, purchaseEnd, expiredStart, expiredEnd];
  const hasInvalidDate = dates.some((date) => date && !isValidDate(date));

  if (hasInvalidDate) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }

  // 유효성 검사 2: 날짜 순서가 올바르지 않으면 서로 교환
  if (
    purchaseStart &&
    purchaseEnd &&
    !isStartDateBeforeEndDate(purchaseStart, purchaseEnd)
  ) {
    [purchaseStart, purchaseEnd] = [purchaseEnd, purchaseStart];
  }
  if (
    expiredStart &&
    expiredEnd &&
    !isStartDateBeforeEndDate(expiredStart, expiredEnd)
  ) {
    [expiredStart, expiredEnd] = [expiredEnd, expiredStart];
  }

  // 기본 쿼리와 파라미터 배열
  let query = `
    SELECT ui.u_ingre_idx, i.ingre_name, ui.quantity, ui.total_quantity, ui.purchase_date, ui.expired_date
    FROM TB_USER_INGREDIENT ui
    JOIN TB_INGREDIENT i ON ui.ingre_idx = i.ingre_idx
    WHERE ui.user_idx = ?
  `;
  const params = [userIdx];

  // 재료 이름 조건 추가
  if (ingreName) {
    query += ` AND i.ingre_name LIKE ?`;
    params.push(`%${ingreName}%`);
  }

  // 구매 날짜 범위 조건
  if (purchaseStart && purchaseEnd) {
    query += ` AND ui.purchase_date BETWEEN ? AND ?`;
    params.push(purchaseStart, purchaseEnd);
  } else if (purchaseStart) {
    query += ` AND ui.purchase_date >= ?`;
    params.push(purchaseStart);
  } else if (purchaseEnd) {
    query += ` AND ui.purchase_date <= ?`;
    params.push(purchaseEnd);
  }

  // 만료 날짜 범위 조건
  if (expiredStart && expiredEnd) {
    query += ` AND ui.expired_date BETWEEN ? AND ?`;
    params.push(expiredStart, expiredEnd);
  } else if (expiredStart) {
    query += ` AND ui.expired_date >= ?`;
    params.push(expiredStart);
  } else if (expiredEnd) {
    query += ` AND ui.expired_date <= ?`;
    params.push(expiredEnd);
  }

  // DB 조회
  try {
    const [rows] = await db.query(query, params);
    return res.status(200).json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 유저의 특정 식재료 불러오기
router.get("/:uIngreId", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { uIngreId } = req.params;

  // uIngreId가 숫자인지 확인
  if (isNaN(uIngreId)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  const query = `
    SELECT ui.u_ingre_idx, i.ingre_name, ui.quantity, ui.total_quantity, ui.purchase_date, ui.expired_date
    FROM TB_USER_INGREDIENT ui
    JOIN TB_INGREDIENT i ON ui.ingre_idx = i.ingre_idx
    WHERE ui.user_idx = ? AND ui.u_ingre_idx = ?
  `;
  try {
    const [rows] = await db.query(query, [userIdx, uIngreId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 유저의 식재료 추가 (POST /api/users/ingredients)
router.post("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  let {
    ingreName,
    ingreIdx,
    quantity,
    totalQuantity,
    purchaseDate,
    expiredDate,
  } = req.body;

  // 유효성 검사 1: ingreName 또는 ingreIdx 확인
  try {
    if (ingreName) {
      const getIngreQuery = `SELECT ingre_idx, shelf_life_days FROM TB_INGREDIENT WHERE ingre_name = ?`;
      const [rows] = await db.query(getIngreQuery, [ingreName]);

      if (rows.length === 0) {
        return res
          .status(400)
          .json({ message: "Ingredient name not supported." });
      }

      ingreIdx = rows[0].ingre_idx;
      const shelfLifeDays = rows[0].shelf_life_days;

      // 만료 날짜 계산
      if (!expiredDate && purchaseDate && shelfLifeDays) {
        const purchaseDateObj = new Date(purchaseDate);
        purchaseDateObj.setDate(purchaseDateObj.getDate() + shelfLifeDays);
        expiredDate = purchaseDateObj.toISOString().split("T")[0];
      }
    } else if (!ingreIdx) {
      return res
        .status(400)
        .json({ message: "Ingredient name or Idx required." });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }

  // 유효성 검사 2: 날짜 형식 검증
  if (
    (purchaseDate && !isValidDate(purchaseDate)) ||
    (expiredDate && !isValidDate(expiredDate))
  ) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }

  // 유효성 검사 3: quantity 및 totalQuantity 값 검증
  if (
    (quantity !== undefined && (isNaN(quantity) || quantity < 0)) ||
    (totalQuantity !== undefined && (isNaN(totalQuantity) || totalQuantity < 0))
  ) {
    return res.status(400).json({
      message: "Invalid quantity values",
    });
  }

  // 유효성 검사 4: quantity와 totalQuantity가 모두 없는 경우 에러
  if (!quantity && !totalQuantity) {
    return res
      .status(400)
      .json({ message: "Either quantity or totalQuantity is required." });
  }

  // 유효성 검사 5: expiredDate와 purchaseDate 중 하나는 필수
  if (!purchaseDate && !expiredDate) {
    return res
      .status(400)
      .json({ message: "Either purchaseDate or expiredDate is required." });
  }

  // quantity와 totalQuantity 중 1개가 없는 경우 서로 동일하게
  if (!quantity) {
    quantity = totalQuantity;
  }
  if (!totalQuantity) {
    totalQuantity = quantity;
  }

  const query = `
    INSERT INTO TB_USER_INGREDIENT (user_idx, ingre_idx, quantity, total_quantity, purchase_date, expired_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  try {
    const [result] = await db.query(query, [
      userIdx,
      ingreIdx,
      quantity,
      totalQuantity,
      purchaseDate,
      expiredDate,
    ]);
    return res.status(201).json({
      uIngreIdx: result.insertId,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 유저의 식재료 수정 (PATCH /api/users/ingredients/:uIngreId)
router.patch("/:uIngreId", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { uIngreId } = req.params;
  const { quantity, totalQuantity, purchaseDate, expiredDate } = req.body;

  // 유효성 검사 1: 네 개의 값이 모두 비어있는 경우
  if (!quantity && !totalQuantity && !purchaseDate && !expiredDate) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update." });
  }

  // 유효성 검사 2: 날짜 형식 검증
  if (
    (purchaseDate && !isValidDate(purchaseDate)) ||
    (expiredDate && !isValidDate(expiredDate))
  ) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }

  // 유효성 검사 3: quantity 및 totalQuantity 값 검증
  if (
    (quantity !== undefined && (isNaN(quantity) || quantity < 0)) ||
    (totalQuantity !== undefined && (isNaN(totalQuantity) || totalQuantity < 0))
  ) {
    return res.status(400).json({
      message: "Invalid quantity values",
    });
  }

  // 업데이트 쿼리 (조인 없이 수행)
  const updateQuery = `
    UPDATE TB_USER_INGREDIENT
    SET quantity = ?, total_quantity = ?, purchase_date = ?, expired_date = ?
    WHERE u_ingre_idx = ? AND user_idx = ?
  `;

  try {
    const [result] = await db.query(updateQuery, [
      quantity,
      totalQuantity,
      purchaseDate,
      expiredDate,
      uIngreId,
      userIdx,
    ]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    // 업데이트 후 ingre_name을 조회하기 위한 쿼리
    const getIngreNameQuery = `
      SELECT i.ingre_name 
      FROM TB_USER_INGREDIENT ui
      JOIN TB_INGREDIENT i ON ui.ingre_idx = i.ingre_idx
      WHERE ui.u_ingre_idx = ? AND ui.user_idx = ?
    `;
    const [rows] = await db.query(getIngreNameQuery, [uIngreId, userIdx]);

    // 존재하지 않음
    if (rows.length === 0) {
      return res.status(404).json({ message: "Not found" });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 유저의 식재료 삭제 (DELETE /api/users/ingredients/:uIngreId)
router.delete("/:uIngreId", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { uIngreId } = req.params;

  const query = `
    DELETE FROM TB_USER_INGREDIENT WHERE u_ingre_idx = ? AND user_idx = ?
  `;

  try {
    const [result] = await db.query(query, [uIngreId, userIdx]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Not Found" });
    }
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
