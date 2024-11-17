const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const authenticateAccessToken = require("../../../Middlewares/jwtAuthentication");
const {
  isValidDate,
  isStartDateBeforeEndDate,
} = require("../../../utils/validation");
const ingredintUtils = require("../../../utils/ingredientsUtils");

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

// 유저의 식재료 추가 (POST /api/users/ingredients) : 재료 1개
// router.post("/", authenticateAccessToken, async (req, res) => {
//   const { userIdx } = req.user;
//   let {
//     ingreName,
//     ingreIdx,
//     quantity,
//     totalQuantity,
//     purchaseDate,
//     expiredDate,
//   } = req.body;

//   // 유효성 검사 1: ingreName 또는 ingreIdx 확인
//   try {
//     if (ingreName) {
//       const getIngreQuery = `SELECT ingre_idx, shelf_life_days FROM TB_INGREDIENT WHERE ingre_name = ?`;
//       const [rows] = await db.query(getIngreQuery, [ingreName]);

//       if (rows.length === 0) {
//         return res
//           .status(400)
//           .json({ message: "Ingredient name not supported." });
//       }

//       ingreIdx = rows[0].ingre_idx;
//       const shelfLifeDays = rows[0].shelf_life_days;

//       // 만료 날짜 계산
//       if (!expiredDate && purchaseDate && shelfLifeDays) {
//         const purchaseDateObj = new Date(purchaseDate);
//         purchaseDateObj.setDate(purchaseDateObj.getDate() + shelfLifeDays);
//         expiredDate = purchaseDateObj.toISOString().split("T")[0];
//       }
//     } else if (!ingreIdx) {
//       return res
//         .status(400)
//         .json({ message: "Ingredient name or Idx required." });
//     }
//   } catch (err) {
//     return res.status(500).json({ message: "Internal server error" });
//   }

//   // 유효성 검사 2: 날짜 형식 검증
//   if (
//     (purchaseDate && !isValidDate(purchaseDate)) ||
//     (expiredDate && !isValidDate(expiredDate))
//   ) {
//     return res
//       .status(400)
//       .json({ message: "Invalid date format. Use YYYY-MM-DD." });
//   }

//   // 유효성 검사 3: quantity 및 totalQuantity 값 검증
//   if (
//     (quantity !== undefined && (isNaN(quantity) || quantity < 0)) ||
//     (totalQuantity !== undefined && (isNaN(totalQuantity) || totalQuantity < 0))
//   ) {
//     return res.status(400).json({
//       message: "Invalid quantity values",
//     });
//   }

//   // 유효성 검사 4: quantity와 totalQuantity가 모두 없는 경우 에러
//   if (!quantity && !totalQuantity) {
//     return res
//       .status(400)
//       .json({ message: "Either quantity or totalQuantity is required." });
//   }

//   // 유효성 검사 5: expiredDate와 purchaseDate 중 하나는 필수
//   if (!purchaseDate && !expiredDate) {
//     return res
//       .status(400)
//       .json({ message: "Either purchaseDate or expiredDate is required." });
//   }

//   // quantity와 totalQuantity 중 1개가 없는 경우 서로 동일하게
//   if (!quantity) {
//     quantity = totalQuantity;
//   }
//   if (!totalQuantity) {
//     totalQuantity = quantity;
//   }

//   const query = `
//     INSERT INTO TB_USER_INGREDIENT (user_idx, ingre_idx, quantity, total_quantity, purchase_date, expired_date)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `;
//   try {
//     const [result] = await db.query(query, [
//       userIdx,
//       ingreIdx,
//       quantity,
//       totalQuantity,
//       purchaseDate,
//       expiredDate,
//     ]);
//     return res.status(201).json({
//       uIngreIdx: result.insertId,
//     });
//   } catch (err) {
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

// 유저 식재료 추가 : 여러개
router.post("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { ingredients } = req.body;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ message: "Invalid Ingredients" });
  }

  const insertValues = [];
  const errors = [];

  for (const ingredient of ingredients) {
    let {
      ingreName,
      ingreIdx,
      rptIdx,
      quantity,
      unit,
      totalQuantity,
      purchaseDate,
      expiredDate,
    } = ingredient;

    // 유효성 검사 1: ingreName 또는 ingreIdx 확인
    try {
      if (ingreName) {
        // 검사할 ingreName을 재료 사전에서 가져온다
        const matchedIngreName = findMatchingIngredient(ingreName);

        const getIngreQuery = `SELECT ingre_idx, shelf_life_days FROM TB_INGREDIENT WHERE ingre_name = ?`;
        const [rows] = await db.query(getIngreQuery, [matchedIngreName]);

        // 등록하려고 하는 재료가 지원하지 않는 재료일 경우
        if (rows.length === 0) {
          return res
            .status(404)
            .json({ messsage: `${ingreName} not supported` });
        }

        ingreIdx = rows[0].ingre_idx;
        const shelfLifeDays = rows[0].shelf_life_days;

        // 만료 날짜가 없는 경우 추가
        if (!expiredDate && purchaseDate && shelfLifeDays) {
          const purchaseDateObj = new Date(purchaseDate);
          purchaseDateObj.setDate(purchaseDateObj.getDate() + shelfLifeDays);
          expiredDate = purchaseDateObj.toISOString().split("T")[0];
        }

        // TODO : ingreName을 receipt에서처럼 딕셔너리를 통해서 매칭시키고, 매칭시킨 값을 통해서
        // 식재료가 있는지를 검사
        // 만약 없다고 한다면, return에 정확하게 어떤 재료를 등록할 수 없는지를 알려줄 것
        // ingreIdx는 덮어 씌워버림 (다른 식재료를 오인했을 수 있으므로)

        // TODO : ingreName이 없는 경우, ingreIdx를 통해서 ingreName을 넣어줄 것
      } else if (!ingreIdx) {
        errors.push({ ingreName, message: "Ingredient name or Idx required." });
        continue;
      }
    } catch (err) {
      errors.push({
        ingreName,
        message: "Internal server error during validation",
      });
      continue;
    }

    // 유효성 검사 2: 날짜 형식 검증
    if (
      (purchaseDate && !isValidDate(purchaseDate)) ||
      (expiredDate && !isValidDate(expiredDate))
    ) {
      errors.push({
        ingreName,
        message: "Invalid date format. Use YYYY-MM-DD.",
      });
      continue;
    }

    // 유효성 검사 3: quantity 및 totalQuantity 값 검증
    if (
      (quantity !== undefined && (isNaN(quantity) || quantity < 0)) ||
      (totalQuantity !== undefined &&
        (isNaN(totalQuantity) || totalQuantity < 0))
    ) {
      errors.push({ ingreName, message: "Invalid quantity values" });
      continue;
    }

    // 유효성 검사 4: quantity와 totalQuantity가 모두 없는 경우 에러
    if (!quantity && !totalQuantity) {
      errors.push({
        ingreName,
        message: "Either quantity or totalQuantity is required.",
      });
      continue;
    }

    // TODO : 유효성 검사: 유닛 유효성 검사
    // 1. quantityUnits에 있는 것들은 그대로 적을 것
    // 2. ml, l, g, kg, cc(ml로 변환)은 소문자로 변환해서 적을 것
    // 3. 그 이외는 전부 '개'로 들어가게끔

    // 유효성 검사 5: expiredDate와 purchaseDate 중 하나는 필수
    if (!purchaseDate && !expiredDate) {
      errors.push({
        ingreName,
        message: "Either purchaseDate or expiredDate is required.",
      });
      continue;
    }

    // quantity와 totalQuantity 중 1개가 없는 경우 서로 동일하게
    if (!quantity) {
      quantity = totalQuantity;
    }
    if (!totalQuantity) {
      totalQuantity = quantity;
    }

    // INSERT 데이터 준비
    insertValues.push([
      userIdx,
      ingreIdx,
      rptIdx,
      ingreName,
      quantity,
      totalQuantity,
      unit,
      purchaseDate,
      expiredDate,
    ]);
  }

  if (insertValues.length === 0) {
    return res
      .status(400)
      .json({ message: "No valid ingredients to insert", errors });
  }

  // INSERT 쿼리 실행
  const insertQuery = `
    INSERT INTO TB_USER_INGREDIENT 
    (user_idx, ingre_idx, rpt_idx, ingre_name, quantity, total_quantity, unit, purchase_date, expired_date)
    VALUES ?
  `;

  try {
    const [result] = await db.query(insertQuery, [insertValues]);
    return res.status(201).json({
      message: "Ingredients added successfully",
      insertedRows: result.affectedRows,
      errors,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error during insertion" });
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

// 유저의 식재료 차감 (patch)
router.patch("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { rcpIdx } = req.body;

  // rcpIdx가 제공되지 않은 경우 에러 반환
  if (!rcpIdx) {
    return res.status(400).json({ message: "Recipe ID is required" });
  }

  try {
    // 레시피 정보 조회
    const [recipeRows] = await db.query(
      `SELECT ck_ingredients
        FROM TB_RECIPE
        WHERE rcp_idx = ?`,
      [rcpIdx]
    );

    if (recipeRows.length === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const recipeIngredients = ingredintUtils.parseIngredients(
      recipeRows[0].ck_ingredients
    );

    // Promise 배열 생성
    const updatePromises = recipeIngredients.map(async (ingredient) => {
      // 파싱한 재료 이름을 사전 매칭 이름으로 변환
      const matchedIngredientName =
        ingredintUtils.findMatchingIngredient(ingredient.name) ||
        ingredient.name;

      // 유저의 재료 정보 조회 (TB_USER_INGREDIENT와 TB_INGREDIENT를 조인)
      const [userIngredientRows] = await db.query(
        `SELECT ui.u_ingre_idx, ui.quantity, ui.unit 
         FROM TB_USER_INGREDIENT ui
         JOIN TB_INGREDIENT i ON ui.ingre_idx = i.ingre_idx
         WHERE ui.user_idx = ?
           AND i.ingre_name = ?
           AND ui.quantity > 0
           AND (ui.expired_date IS NULL OR ui.expired_date > CURDATE())`,
        [userIdx, matchedIngredientName]
      );

      if (userIngredientRows.length > 0) {
        const userIngredient = userIngredientRows[0];

        // 수량 변환 및 차감 계산
        const quantityToDeduct = ingredintUtils.convertQuantity(
          ingredient.amount,
          ingredient.unit,
          userIngredient.unit
        );
        const updatedQuantity = Math.max(
          userIngredient.quantity - quantityToDeduct,
          0
        );

        // 차감된 수량 업데이트 쿼리 반환
        return db.query(
          `UPDATE TB_USER_INGREDIENT SET quantity = ? WHERE u_ingre_idx = ?`,
          [updatedQuantity, userIngredient.u_ingre_idx]
        );
      }
    });

    // 모든 업데이트가 완료될 때까지 대기
    await Promise.all(updatePromises);

    return res
      .status(200)
      .json({ message: "Ingredients deducted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// (() => {
//   const ingredientsString =
//     "[재료] 건표고버섯 9개| 오이 1/2개| 당근 1/2| 양파 적당량| 사과 1~2L| 그외의 야채| 과일 [녹말물] 녹말가루 2C| 물 1C| 계란 노른자 1개 [탕수 소스] 물 2C| 설탕 1/2C| 식초 3T| 간장 1T| 녹말물 2T";
//   console.log(ingredintUtils.parseIngredients(ingredientsString));
// })();

module.exports = router;
