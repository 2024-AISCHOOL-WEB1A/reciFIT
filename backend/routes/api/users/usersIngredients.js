const express = require("express");
const router = express.Router();
const db = require("../../../config/db");
const authenticateAccessToken = require("../../../Middlewares/jwtAuthentication");
const {
  isValidIdx,
  isValidDate,
  isStartDateBeforeEndDate,
} = require("../../../utils/validation");
const { toCamelCase } = require("../../../utils/commonUtils");
const ingredientsUtils = require("../../../utils/ingredientsUtils");

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
  const query = `
    SELECT 
      u_ingre_idx, 
      ingre_idx, 
      rpt_idx,
      ingre_name,
      quantity, 
      total_quantity, 
      unit,
      purchase_date, 
      expired_date
    FROM TB_USER_INGREDIENT
    WHERE user_idx = ?`;
  const params = [userIdx];

  // 재료 이름 조건 추가 (본인이 등록한 재료 이름으로 검색하는 것)
  if (ingreName) {
    query += ` AND ingre_name LIKE ?`;
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
    const [rows] = await db.execute(query, params);
    return res.status(200).json({ ingredients: toCamelCase(rows) });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 유저의 특정 식재료 불러오기
router.get("/:uIngreIdx", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { uIngreIdx } = req.params;

  // 유효성 검사 1: Idx 존재 유무
  if (!uIngreIdx) {
    return res.status(400).json({ message: "Idx required" });
  }

  // 유효성 검사 2: idx가 숫자인 경우만
  if (!isValidIdx(uIngreIdx)) {
    return res.status(400).json({ message: "Invalid idx format" });
  }

  const query = `
    SELECT 
      u_ingre_idx, 
      ingre_idx, 
      rpt_idx,
      ingre_name,
      quantity, 
      total_quantity, 
      unit,
      purchase_date, 
      expired_date
    FROM TB_USER_INGREDIENT
    WHERE user_idx = ? AND u_ingre_idx = ?`;

  try {
    const [rows] = await db.execute(query, [userIdx, uIngreIdx]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User ingredient not found" });
    }
    return res.status(200).json({ ingredient: toCamelCase(rows[0]) });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// // 유저의 식재료 추가 (POST /api/users/ingredients) : 재료 1개
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
//       const [rows] = await db.execute(getIngreQuery, [ingreName]);

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
//       .json({ message: "Invalid date format. Use YYYY-MM-DD" });
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
//       .json({ message: "Either quantity or totalQuantity is required" });
//   }

//   // 유효성 검사 5: expiredDate와 purchaseDate 중 하나는 필수
//   if (!purchaseDate && !expiredDate) {
//     return res
//       .status(400)
//       .json({ message: "Either purchaseDate or expiredDate is required" });
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
//     const [result] = await db.execute(query, [
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

// 모든 식재료 수정/삭제/추가
// router.post("/modification", authenticateAccessToken, async (req, res) => {
//   const { userIdx } = req.user;
//   const { deletedIngredients, modifiedIngredients, createdIngredients } =
//     req.body;

//   return res.status(200).json({ message: "Invalid Ingredients" });
// });

// 유저 식재료 추가 : 여러개
router.post("/batch", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { ingredients } = req.body;

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ message: "Invalid Ingredients" });
  }

  const insertValues = [];

  for (const ingredient of ingredients) {
    let {
      ingreName,
      ingreIdx,
      rptIdx,
      quantity,
      totalQuantity,
      unit,
      purchaseDate,
      expiredDate,
    } = ingredient;

    // 유효성 검사 1: ingreName 또는 ingreIdx 확인
    try {
      if (ingreName) {
        // 검사할 ingreName을 재료 사전에서 가져온다
        const matchedIngreName =
          ingredientsUtils.findMatchingIngredient(ingreName);

        // 정상적인 재료 이름이 나오지 않은 경우
        if (!matchedIngreName) {
          return res
            .status(404)
            .json({ message: `ingredient not supported`, ingreName });
        }

        const getIngreQuery = `SELECT ingre_idx, shelf_life_days
          FROM TB_INGREDIENT
          WHERE ingre_name = ?`;
        const [rows] = await db.execute(getIngreQuery, [matchedIngreName]);

        // 등록하려고 하는 재료가 지원하지 않는 재료일 경우
        if (rows.length === 0) {
          return res
            .status(404)
            .json({ message: `ingredient not supported`, ingreName });
        }

        ingreIdx = rows[0].ingre_idx;
        const shelfLifeDays = rows[0].shelf_life_days;

        // 만료 날짜가 없는 경우 추가
        if (!expiredDate && purchaseDate && shelfLifeDays) {
          const purchaseDateObj = new Date(purchaseDate);
          purchaseDateObj.setDate(purchaseDateObj.getDate() + shelfLifeDays);
          expiredDate = purchaseDateObj.toISOString().split("T")[0];
        }
      } else {
        // 식재료 이름은 없고, 식재료 id도 없는 경우 : error
        if (!ingreIdx) {
          return res
            .status(400)
            .json({ message: "Ingredient name or Idx required." });
        }

        // 식재료 이름은 없지만, 식재료 id가 있는 경우 : 식재료 테이블에서 이름을 가져다가 넣어준다
        const getIngreNameQuery = `SELECT ingre_name
          FROM TB_INGREDIENT
          WHERE ingre_idx = ?`;
        const [ingreRows] = await db.execute(getIngreNameQuery, [ingreIdx]);

        // 재료의 id가 존재하지 않는 경우
        if (ingreRows.length === 0) {
          return res.status(404).json({ message: `${ingreIdx} not found` });
        }

        // 이름 넣어주기
        ingreName = ingreRows[0]?.ingre_name;
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }

    // 유효성 검사 2: 날짜 형식 검증
    if (
      (purchaseDate && !isValidDate(purchaseDate)) ||
      (expiredDate && !isValidDate(expiredDate))
    ) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD" });
    }

    // 유효성 검사 3: quantity 및 totalQuantity 값 검증
    if (
      (quantity !== undefined && (isNaN(quantity) || quantity < 0)) ||
      (totalQuantity !== undefined &&
        (isNaN(totalQuantity) || totalQuantity < 0))
    ) {
      return res.status(400).json({ message: "Invalid quantity values" });
    }

    // 유효성 검사 4: quantity와 totalQuantity가 모두 없는 경우 에러
    if (!quantity && !totalQuantity) {
      return res
        .status(400)
        .json({ message: "Either quantity or totalQuantity is required" });
    }

    // 유효성 검사: 유닛 유효성 검사
    unit = ingredientsUtils.getValidUnit(unit);

    // 유효성 검사 5: expiredDate와 purchaseDate 중 하나는 필수
    if (!purchaseDate && !expiredDate) {
      return res
        .status(400)
        .json({ message: "Either purchaseDate or expiredDate is required" });
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

  // 들어간 재료가 없는 경우
  if (insertValues.length === 0) {
    return res.status(400).json({ message: "No valid ingredients to insert" });
  }

  // INSERT 쿼리 실행
  const insertQuery = `
    INSERT INTO TB_USER_INGREDIENT
      (user_idx,
      ingre_idx,
      rpt_idx,
      ingre_name,
      quantity,
      total_quantity,
      unit,
      purchase_date,
      expired_date)
    VALUES ?
  `;

  try {
    const [result] = await db.query(insertQuery, [insertValues]);
    return res.status(201).json({
      message: "Ingredients added successfully",
      // insertedRows: result.affectedRows,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 1개 재료
router.post("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  let {
    ingreName,
    ingreIdx,
    rptIdx,
    quantity,
    totalQuantity,
    unit,
    purchaseDate,
    expiredDate,
  } = req.body; // 하나하나 필드를 받아옴

  // 유효성 검사 1: ingreName 또는 ingreIdx 확인
  try {
    if (ingreName) {
      // 검사할 ingreName을 재료 사전에서 가져온다
      const matchedIngreName =
        ingredientsUtils.findMatchingIngredient(ingreName);

      // 정상적인 재료 이름이 나오지 않은 경우
      if (!matchedIngreName) {
        return res
          .status(404)
          .json({ message: `ingredient not supported`, ingreName });
      }

      const getIngreQuery = `SELECT ingre_idx, shelf_life_days 
        FROM TB_INGREDIENT 
        WHERE ingre_name = ?`;
      const [rows] = await db.execute(getIngreQuery, [matchedIngreName]);

      // 등록하려고 하는 재료가 지원하지 않는 재료일 경우
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ message: `ingredient not supported`, ingreName });
      }

      ingreIdx = rows[0].ingre_idx;
      const shelfLifeDays = rows[0].shelf_life_days;

      // 만료 날짜가 없는 경우 추가
      if (!expiredDate && purchaseDate && shelfLifeDays) {
        const purchaseDateObj = new Date(purchaseDate);
        purchaseDateObj.setDate(purchaseDateObj.getDate() + shelfLifeDays);
        expiredDate = purchaseDateObj.toISOString().split("T")[0];
      }
    } else {
      // 식재료 이름은 없고, 식재료 id도 없는 경우 : error
      if (!ingreIdx) {
        return res
          .status(400)
          .json({ message: "Ingredient name or Idx required." });
      }

      // 식재료 이름은 없지만, 식재료 id가 있는 경우 : 식재료 테이블에서 이름을 가져다가 넣어준다
      const getIngreNameQuery = `SELECT ingre_name 
        FROM TB_INGREDIENT 
        WHERE ingre_idx = ?`;
      const [ingreRows] = await db.execute(getIngreNameQuery, [ingreIdx]);

      // 재료의 id가 존재하지 않는 경우
      if (ingreRows.length === 0) {
        return res.status(404).json({ message: `${ingreIdx} not found` });
      }

      // 이름 넣어주기
      ingreName = ingreRows[0]?.ingre_name;
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }

  // 유효성 검사 2: 날짜 형식 검증
  if (
    (purchaseDate && !isValidDate(purchaseDate)) ||
    (expiredDate && !isValidDate(expiredDate))
  ) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD" });
  }

  // 유효성 검사 3: quantity 및 totalQuantity 값 검증
  if (
    (quantity !== undefined && (isNaN(quantity) || quantity < 0)) ||
    (totalQuantity !== undefined && (isNaN(totalQuantity) || totalQuantity < 0))
  ) {
    return res.status(400).json({ message: "Invalid quantity values" });
  }

  // 유효성 검사 4: quantity와 totalQuantity가 모두 없는 경우 에러
  if (!quantity && !totalQuantity) {
    return res
      .status(400)
      .json({ message: "Either quantity or totalQuantity is required" });
  }

  // 유효성 검사: 유닛 유효성 검사
  unit = ingredientsUtils.getValidUnit(unit);

  // 유효성 검사 5: expiredDate와 purchaseDate 중 하나는 필수
  if (!purchaseDate && !expiredDate) {
    return res
      .status(400)
      .json({ message: "Either purchaseDate or expiredDate is required" });
  }

  // quantity와 totalQuantity 중 1개가 없는 경우 서로 동일하게
  if (!quantity) {
    quantity = totalQuantity;
  }
  if (!totalQuantity) {
    totalQuantity = quantity;
  }

  // INSERT 데이터 준비
  const insertValues = [
    userIdx,
    ingreIdx,
    rptIdx,
    ingreName,
    quantity,
    totalQuantity,
    unit,
    purchaseDate,
    expiredDate,
  ];

  // INSERT 쿼리 실행
  const insertQuery = `
    INSERT INTO TB_USER_INGREDIENT 
      (user_idx, 
      ingre_idx, 
      rpt_idx, 
      ingre_name, 
      quantity, 
      total_quantity, 
      unit, 
      purchase_date, 
      expired_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(insertQuery, insertValues);
    return res.status(201).json({
      message: "Ingredient added successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 유저의 식재료 수정 (PATCH /api/users/ingredients/)
router.patch("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const {
    uIngreIdx,
    ingreName,
    quantity,
    totalQuantity,
    unit,
    purchaseDate,
    expiredDate,
  } = req.body;
  let ingreIdx = -1;

  // 유효성 검사 1: uIngreIdx 검사
  if (!uIngreIdx) {
    return res.status(400).json({ message: "idx is required." });
  }

  // 유효성 검사 2 : uIngreIdx 검사
  if (!isValidIdx(uIngreIdx)) {
    return res.status(400).json({ message: "Invalid idx format" });
  }

  // 유효성 검사 3: 모든 body 값이 모두 비어있는 경우
  if (
    [ingreName, quantity, totalQuantity, unit, purchaseDate, expiredDate].every(
      (field) => field === undefined || field === null || field === ""
    )
  ) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update." });
  }

  // 유효성 검사 4: 날짜 형식 검증
  if (
    (purchaseDate && !isValidDate(purchaseDate)) ||
    (expiredDate && !isValidDate(expiredDate))
  ) {
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }

  // 유효성 검사 5: quantity 및 totalQuantity 값 검증 (total은 0이 될 수 없다)
  if (
    (quantity !== undefined && (isNaN(quantity) || quantity < 0)) ||
    (totalQuantity !== undefined &&
      (isNaN(totalQuantity) || totalQuantity <= 0))
  ) {
    return res.status(400).json({
      message: "Invalid quantity values",
    });
  }

  // 유효성 검사 6: 이름을 변경한 경우에 ingre_idx를 바꿔줘야 한다
  if (ingreName) {
    // 검사할 ingreName을 재료 사전에서 가져온다
    const matchedIngreName = ingredientsUtils.findMatchingIngredient(ingreName);

    // 정상적인 재료 이름이 나오지 않은 경우
    if (!matchedIngreName) {
      return res
        .status(404)
        .json({ message: `ingredient not supported`, ingreName });
    }

    const getIngreQuery = `SELECT ingre_idx
      FROM TB_INGREDIENT 
      WHERE ingre_name = ?`;
    const [rows] = await db.execute(getIngreQuery, [matchedIngreName]);

    // 등록하려고 하는 재료가 지원하지 않는 재료일 경우
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: `ingredient not supported`, ingreName });
    }
    ingreIdx = rows[0].ingre_idx;
  }

  // 업데이트 쿼리 만들기
  let setClauses = [];
  let updateValues = [];

  if (ingreName) {
    setClauses.push("ingre_name = ?");
    updateValues.push(ingreName);
  }

  if (ingreIdx != -1) {
    setClauses.push("ingre_idx = ?");
    updateValues.push(ingreIdx);
  }

  if (quantity !== undefined && quantity !== null && quantity !== "") {
    setClauses.push("quantity = ?");
    updateValues.push(quantity);
  }

  if (totalQuantity) {
    setClauses.push("total_quantity = ?");
    updateValues.push(totalQuantity);
  }

  if (unit) {
    setClauses.push("unit = ?");
    updateValues.push(unit);
  }

  if (purchaseDate) {
    setClauses.push("purchase_date = ?");
    updateValues.push(purchaseDate);
  }

  if (expiredDate) {
    setClauses.push("expired_date = ?");
    updateValues.push(expiredDate);
  }

  // db values값에 추가
  updateValues.push(uIngreIdx, userIdx);

  // 업데이트할 필드가 하나도 없다면 에러를 반환합니다.
  if (setClauses.length === 0) {
    return res
      .status(400)
      .json({ message: "At least one field must be provided for update." });
  }

  // 업데이트 쿼리를 생성합니다.
  const updateQuery = `
    UPDATE TB_USER_INGREDIENT
    SET ${setClauses.join(", ")}
    WHERE u_ingre_idx = ? AND user_idx = ?`;

  try {
    const [result] = await db.execute(updateQuery, updateValues);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User Ingredient Not found" });
    }
    return res.status(200).json({ message: "Updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 유저의 식재료 삭제 (DELETE /api/users/ingredients/:uIngreIdx)
router.delete("/:uIngreIdx", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { uIngreIdx } = req.params;

  // 유효성 검사 1: uIngreIdx 검사
  if (!uIngreIdx) {
    return res.status(400).json({ message: "idx is required." });
  }

  // 유효성 검사 2 : uIngreIdx 검사
  if (!isValidIdx(uIngreIdx)) {
    return res.status(400).json({ message: "Invalid idx format" });
  }

  const query = `
    DELETE 
    FROM TB_USER_INGREDIENT 
    WHERE u_ingre_idx = ? AND user_idx = ?`;

  try {
    const [result] = await db.execute(query, [uIngreIdx, userIdx]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User ingredient not found" });
    }
    return res.status(204).json({ message: "Deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 유저의 식재료 차감 (patch)
router.patch("/consumption", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;
  const { rcpIdx } = req.body;

  // 유효성 검사 1 : rcpIdx가 제공되지 않은 경우 에러 반환
  if (!rcpIdx) {
    return res.status(400).json({ message: "Recipe ID is required" });
  }
  // 유효성 검사 2 : rcpIdx가 숫자가 아닌 경우
  if (!isValidIdx(rcpIdx)) {
    return res.status(400).json({ message: "Invalid idx format" });
  }

  try {
    // 레시피 정보 조회
    const [recipeRows] = await db.execute(
      `SELECT ck_ingredients
        FROM TB_RECIPE
        WHERE rcp_idx = ?`,
      [rcpIdx]
    );

    if (recipeRows.length === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    const recipeIngredients = ingredientsUtils.parseIngredients(
      recipeRows[0].ck_ingredients
    );

    // Promise 배열 생성
    const updatePromises = recipeIngredients.map(async (ingredient) => {
      // 파싱한 재료 이름을 사전 매칭 이름으로 변환
      const matchedIngredientName =
        ingredientsUtils.findMatchingIngredient(ingredient.name) ||
        ingredient.name;

      // 유저의 재료 정보 조회 (TB_USER_INGREDIENT와 TB_INGREDIENT를 조인)
      const [userIngredientRows] = await db.execute(
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
        const quantityToDeduct = ingredientsUtils.convertQuantity(
          ingredient.amount,
          ingredient.unit,
          userIngredient.unit
        );
        const updatedQuantity = Math.max(
          userIngredient.quantity - quantityToDeduct,
          0
        );
        console.log(updatedQuantity);

        // 차감된 수량 업데이트 쿼리 반환
        return db.execute(
          `UPDATE TB_USER_INGREDIENT SET quantity = ? WHERE u_ingre_idx = ?`,
          [updatedQuantity, userIngredient.u_ingre_idx]
        );
      }
    });

    // 모든 업데이트가 완료될 때까지 대기
    await Promise.all(updatePromises);

    return res
      .status(200)
      .json({ message: "Ingredients consumed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// (() => {
//   const ingredientsString =
//     "[재료] 건표고버섯 9개| 오이 1/2개| 당근 1/2| 양파 적당량| 사과 1~2L| 그외의 야채| 과일 [녹말물] 녹말가루 2C| 물 1C| 계란 노른자 1개 [탕수 소스] 물 2C| 설탕 1/2C| 식초 3T| 간장 1T| 녹말물 2T";
//   console.log(ingredientsUtils.parseIngredients(ingredientsString));
// })();

module.exports = router;
