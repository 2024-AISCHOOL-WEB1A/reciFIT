const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const authenticateAccessToken = require("../../Middlewares/jwtAuthentication");
const recipeValidation = require("../../utils/recipeValidation");
const { isValidIdx, isValidURL } = require("../../utils/validation");
const { getUserRole, getRecipeOwner } = require("../../utils/dbHelpers");
require("dotenv").config();

// 조회수 최대값
const MAX_RECIPE_FETCH_LIMIT = 10;

// 레시피 생성
router.post("/", authenticateAccessToken, async (req, res) => {
  let {
    ckName,
    ckMethod = "기타",
    ckCategory = "기타",
    ckIngredientCategory = "기타",
    ckType = "기타",
    ckInstructions,
    ckIngredients,
    ckDescription,
    ckPhotoUrl,
    ckAmount = "1인분",
    ckTime = "5분이내",
    ckDifficulty = "아무나",
  } = req.body;
  const { userIdx } = req.user;

  // 유효성 검사 1: Method (방법별)
  if (!recipeValidation.isValidCkMethod(ckMethod)) {
    ckMethod = "기타";
  }
  // 유효성 검사 2: Category (상황별)
  if (!recipeValidation.isValidCkCategory(ckCategory)) {
    ckCategory = "기타";
  }
  // 유효성 검사 3: Ingredient Category (재료별)
  if (!recipeValidation.isValidCkIngredientCategory(ckIngredientCategory)) {
    ckIngredientCategory = "기타";
  }
  // 유효성 검사 4: Type (종류별)
  if (!recipeValidation.isValidCkType(ckType)) {
    ckType = "기타";
  }
  // 유효성 검사 5: Amount (인원)
  if (!recipeValidation.isValidAmount(ckAmount)) {
    ckAmount = "1인분";
  }
  // 유효성 검사 6: Time (시간)
  if (!recipeValidation.isValidTime(ckTime)) {
    ckTime = "5분이내";
  }
  // 유효성 검사 7: Difficulty (난이도)
  if (!recipeValidation.isValidDifficulty(ckDifficulty)) {
    ckDifficulty = "아무나";
  }
  // 유효성 검사 8: 필수 항목 (소개, 재료, 설명, 이미지 url)
  if (!ckInstructions || !ckIngredients || !ckDescription || !ckPhotoUrl) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    const result = await db.query(
      `INSERT INTO TB_RECIPE (
              ck_name, ck_method, ck_category, ck_ingredient_category, ck_type, ck_instructions, ck_ingredients, 
              ck_description, ck_photo_url, ck_amount, ck_time, ck_difficulty, user_idx
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        ckName,
        ckMethod,
        ckCategory,
        ckIngredientCategory,
        ckType,
        ckInstructions,
        ckIngredients,
        ckDescription,
        ckPhotoUrl,
        ckAmount,
        ckTime,
        ckDifficulty,
        userIdx,
      ]
    );

    return res.status(201).json({
      message: "Recipe created successfully",
      recipeId: result.insertId,
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 레시피 추천
router.get("/", authenticateAccessToken, async (req, res) => {
  let {
    have,
    prefer,
    dislike,
    nonConsumable,
    amount,
    time,
    difficulty,
    photoUrl,
    method,
    category,
    ingredientCategory,
    type,
    count = MAX_RECIPE_FETCH_LIMIT,
  } = req.query;
  const { userIdx } = req.user;

  // photoUrl이 존재하면 FastAPI 서버로 사진을 보내서 확인한다
  if (photoUrl) {
    // key인지 url인지 구분
    if (!isValidURL(photoUrl)) {
      photoUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${photoUrl}`;
    }

    // FastAPI 서버로 사진을 보내서 have 추출
    try {
      const response = await axios.post(
        `${process.env.FASTAPI_SERVER_HOST}:${process.env.FASTAPI_SERVER_PORT}/api/ingredients-detection`,
        {
          image_url: photoUrl,
        }
      );

      // have를 사진에서 추출 (have가 있는 경우와 없는 경우로 분리)
      const extractedNames = response.data.ingredients_names;
      if (extractedNames && extractedNames.trim() !== "") {
        if (!have || have.trim() === "") {
          have = extractedNames;
        } else {
          have += `, ${extractedNames}`;
        }
      }
    } catch (err) {
      console.error("AI server request Error :", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // 조회 최대값 MAX_RECIPE_FETCH_LIMIT
  count = Math.min(parseInt(count), MAX_RECIPE_FETCH_LIMIT);

  // 유저의 개인 정보에서 재료 추가 조회
  try {
    const [rows] = await db.query(
      `SELECT 
        preferred_ingredients, 
        disliked_ingredients, 
        non_consumable_ingredients 
      FROM TB_USER 
      WHERE user_idx = ?`,
      [userIdx]
    );
    const user = rows[0];
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 선호, 회피, 섭취 불가 재료 가져오기
    if (
      user.preferred_ingredients &&
      user.preferred_ingredients.trim() !== ""
    ) {
      if (!prefer || prefer.trim() === "") {
        prefer = user.preferred_ingredients;
      } else {
        prefer += `, ${user.preferred_ingredients}`;
      }
    }
    if (user.disliked_ingredients && user.disliked_ingredients.trim() !== "") {
      if (!dislike || dislike.trim() === "") {
        dislike = user.disliked_ingredients;
      } else {
        dislike += `, ${user.disliked_ingredients}`;
      }
    }
    if (
      user.non_consumable_ingredients &&
      user.non_consumable_ingredients.trim() !== ""
    ) {
      if (!nonConsumable || nonConsumable.trim() === "") {
        nonConsumable = user.non_consumable_ingredients;
      } else {
        nonConsumable += `, ${user.non_consumable_ingredients}`;
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }

  // 재료를 ,를 기준으로 분리 (공백 제거)
  const haveIngredients = have
    ? have.split(",").map((item) => item.trim())
    : [];
  const preferIngredients = prefer
    ? prefer.split(",").map((item) => item.trim())
    : [];
  const dislikeIngredients = dislike
    ? dislike.split(",").map((item) => item.trim())
    : [];
  const nonConsumableIngredients = nonConsumable
    ? nonConsumable.split(",").map((item) => item.trim())
    : [];

  // 재료 query string
  const haveWeight = 1;
  const preferWeight = 0.3;
  const dislikeWeight = -0.5;
  let ingredientsQueryString = "";
  let orderByQueryString = "ORDER BY score DESC, RAND()";

  // 각 재료별 쿼리문 제작
  if (haveIngredients.length > 0) {
    for (let i = 0; i < haveIngredients.length; i++) {
      if (i > 0) {
        ingredientsQueryString += " + ";
      }
      ingredientsQueryString += `(ck_ingredients LIKE '%${haveIngredients[i]}%') * ${haveWeight}`;
    }
  }
  if (preferIngredients.length > 0) {
    for (let i = 0; i < preferIngredients.length; i++) {
      ingredientsQueryString += ` + (ck_ingredients LIKE '%${preferIngredients[i]}%') * ${preferWeight}`;
    }
  }
  if (dislikeIngredients.length > 0) {
    for (let i = 0; i < dislikeIngredients.length; i++) {
      ingredientsQueryString += ` + (ck_ingredients LIKE '%${dislikeIngredients[i]}%') * ${dislikeWeight}`;
    }
  }

  // score 쿼리
  if (ingredientsQueryString != "") {
    ingredientsQueryString = `, (${ingredientsQueryString}) AS score`;
  } else {
    orderByQueryString = "ORDER BY RAND()";
  }

  // 추가 정보
  const updates = [];
  const params = [];

  // 요리양
  if (amount) {
    // 요리양을 ,를 기준으로 분리
    const amountList = amount
      ? amount.split(",").map((item) => item.trim())
      : [];

    // 유효성 검사 1 : 요리양
    amountList = amountList.filter((item) =>
      recipeValidation.isValidAmount(item)
    );

    // 요리양이 1개인 경우와 여러개인 경우 쿼리가 달라져야 한다.
    if (amountList.length === 1) {
      updates.push("ck_amount = ?");
      params.push(amountList[0]);
    } else if (amountList.length > 1) {
      updates.push(`ck_amount IN (${amountList.map(() => "?").join(", ")})`);
      params.push(...amountList);
    }
  }

  // 시간
  if (time) {
    // 시간을 ,를 기준으로 분리
    const timeList = time ? time.split(",").map((item) => item.trim()) : [];

    // 유효성 검사 2: 요리 시간
    timeList = timeList.filter((item) => isValidTime(item));

    // 시간이 1개인 경우와 여러개인 경우 쿼리가 달라져야 한다.
    if (timeList.length === 1) {
      updates.push("ck_time = ?");
      params.push(timeList[0]);
    } else if (timeList.length > 1) {
      updates.push(`ck_time IN (${timeList.map(() => "?").join(", ")})`);
      params.push(...timeList);
    }
  }

  // 난이도
  if (difficulty) {
    // 난이도를 ,를 기준으로 분리
    const difficultyList = difficulty
      ? difficulty.split(",").map((item) => item.trim())
      : [];

    // 유효성 검사 3: 요리 난이도
    difficultyList = difficultyList.filter((item) => isValidDifficulty(item));

    // 시간이 1개인 경우와 여러개인 경우 쿼리가 달라져야 한다.
    if (difficultyList.length === 1) {
      updates.push("ck_difficulty = ?");
      params.push(difficultyList[0]);
    } else if (difficultyList.length > 1) {
      updates.push(
        `ck_difficulty IN (${difficultyList.map(() => "?").join(", ")})`
      );
      params.push(...difficultyList);
    }
  }

  // 방법별
  if (method) {
    let methodList = method.split(",").map((item) => item.trim());

    // 유효성 검사 4: 방법별
    methodList = methodList.filter((item) =>
      recipeValidation.isValidCkMethod(item)
    );

    // 1개인 경우와 여러개인 경우 쿼리가 달라져야 한다.
    if (methodList.length === 1) {
      updates.push("ck_method = ?");
      params.push(methodList[0]);
    } else if (methodList.length > 1) {
      updates.push(`ck_method IN (${methodList.map(() => "?").join(", ")})`);
      params.push(...methodList);
    }
  }

  // 상황별
  if (category) {
    let categoryList = category.split(",").map((item) => item.trim());

    // 유효성 검사 5: 상황별
    categoryList = categoryList.filter((item) =>
      recipeValidation.isValidCkCategory(item)
    );

    // 1개인 경우와 여러개인 경우 쿼리가 달라져야 한다.
    if (categoryList.length === 1) {
      updates.push("ck_category = ?");
      params.push(categoryList[0]);
    } else if (categoryList.length > 1) {
      updates.push(
        `ck_category IN (${categoryList.map(() => "?").join(", ")})`
      );
      params.push(...categoryList);
    }
  }

  // 재료별
  if (ingredientCategory) {
    let ingredientCategoryList = ingredientCategory
      .split(",")
      .map((item) => item.trim());

    // 유효성 검사 6: 재료별
    ingredientCategoryList = ingredientCategoryList.filter((item) =>
      recipeValidation.isValidCkIngredientCategory(item)
    );

    // 1개인 경우와 여러개인 경우 쿼리가 달라져야 한다.
    if (ingredientCategoryList.length === 1) {
      updates.push("ck_ingredient_category = ?");
      params.push(ingredientCategoryList[0]);
    } else if (ingredientCategoryList.length > 1) {
      updates.push(
        `ck_ingredient_category IN (${ingredientCategoryList
          .map(() => "?")
          .join(", ")})`
      );
      params.push(...ingredientCategoryList);
    }
  }

  // 종류별
  if (type) {
    let typeList = type.split(",").map((item) => item.trim());

    // 유효성 검사 7: 재료별
    typeList = typeList.filter((item) => recipeValidation.isValidCkType(item));

    // 1개인 경우와 여러개인 경우 쿼리가 달라져야 한다.
    if (typeList.length === 1) {
      updates.push("ck_type = ?");
      params.push(typeList[0]);
    } else if (typeList.length > 1) {
      updates.push(`ck_type IN (${typeList.map(() => "?").join(", ")})`);
      params.push(...typeList);
    }
  }

  // nonConsumableIngredients 조건 추가
  if (nonConsumableIngredients.length > 0) {
    const exclusionConditions = nonConsumableIngredients
      .map((item) => `ck_ingredients NOT LIKE '%${item}%'`)
      .join(" AND ");
    updates.push(exclusionConditions);
  }

  // 기본 WHERE 절
  let whereClause = "approved_yn = 'Y'";
  // 조건이 있는 경우 추가
  if (updates.length > 0) {
    whereClause += " AND " + updates.join(" AND ");
  }

  // TODO : 테이블에 따라 쿼리문 변경할 것
  const query = `
  SELECT
    rcp_idx,
    ck_name,
    ck_method,
    ck_category,
    ck_ingredient_category,
    ck_type,
    ck_instructions,
    ck_ingredients,
    ck_description,
    ck_photo_url,
    ck_amount,
    ck_time,
    ck_difficulty,
    user_idx
    ${ingredientsQueryString}
  FROM TB_RECIPE
  WHERE ${whereClause}
  ${orderByQueryString}
  LIMIT ${count};`;

  try {
    const [rows] = await db.execute(query, params);
    return res.status(200).json({
      count: rows.length,
      recipes: rows,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 특정 레시피 조회
router.get("/:rcpIdx", authenticateAccessToken, async (req, res) => {
  const { rcpIdx } = req.params;

  // 유효성 검사 : rcpIdx
  if (!isValidIdx(rcpIdx)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  try {
    const [rows] = await db.query(
      `SELECT * 
      FROM TB_RECIPE 
      WHERE rcp_idx = ?`,
      [rcpIdx]
    );
    const recipe = rows[0];

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json(recipe);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 레시피 수정
router.patch("/:rcpIdx", authenticateAccessToken, async (req, res) => {
  const { rcpIdx } = req.params;
  const { userIdx } = req.user;
  const updates = req.body;

  // 유효성 검사 1: rcpIdx
  if (!isValidIdx(rcpIdx)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  try {
    // 유효성 검사 2: 레시피 등록자 혹은 Admin만 수정 가능
    // 레시피에서 user_idx 가져오기
    const recipe = await getRecipeOwner(rcpIdx);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // 현재 사용자가 Admin인지 확인
    const user = await getUserRole(userIdx);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 요청한 사용자가 레시피의 소유자거나 관리자인 경우만 허용
    if (recipe.user_idx !== userIdx && user.role !== "admin") {
      return res.status(403).json({ message: "Permission denied" });
    }

    // 데이터베이스의 필드명을 카멜 케이스로 변환
    const fieldMap = {
      ckName: "ck_name",
      ckMethod: "ck_method",
      ckCategory: "ck_category",
      ckIngredientCategory: "ck_ingredient_category",
      ckType: "ck_type",
      ckInstructions: "ck_instructions",
      ckIngredients: "ck_ingredients",
      ckDescription: "ck_description",
      ckPhotoUrl: "ck_photo_url",
      ckAmount: "ck_amount",
      ckTime: "ck_time",
      ckDifficulty: "ck_difficulty",
    };

    // 유효성 검사 3: 각 항목의 유효성 검사
    if (
      updates.ckMethod &&
      !recipeValidation.isValidCkMethod(updates.ckMethod)
    ) {
      return res.status(400).json({ message: "Invalid ckMethod" });
    }
    if (
      updates.ckCategory &&
      !recipeValidation.isValidCkCategory(updates.ckCategory)
    ) {
      return res.status(400).json({ message: "Invalid ckCategory" });
    }
    if (
      updates.ckIngredientCategory &&
      !recipeValidation.isValidCkIngredientCategory(
        updates.ckIngredientCategory
      )
    ) {
      return res.status(400).json({ message: "Invalid ckIngredientCategory" });
    }
    if (updates.ckType && !recipeValidation.isValidCkType(updates.ckType)) {
      return res.status(400).json({ message: "Invalid ckType" });
    }
    if (updates.ckAmount && !recipeValidation.isValidAmount(updates.ckAmount)) {
      return res.status(400).json({ message: "Invalid ckAmount" });
    }
    if (updates.ckTime && !recipeValidation.isValidTime(updates.ckTime)) {
      return res.status(400).json({ message: "Invalid ckTime" });
    }
    if (
      updates.ckDifficulty &&
      !recipeValidation.isValidDifficulty(updates.ckDifficulty)
    ) {
      return res.status(400).json({ message: "Invalid ckDifficulty" });
    }

    // 유효성 검사 4: 수정 사항은 1개 이상이어야 함
    const fields = Object.keys(updates).filter(
      (key) => updates[key] !== undefined && updates[key] !== null
    );
    if (fields.length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    // set문 만들기
    const setClause = fields
      .map((field) => `${fieldMap[field]} = ?`)
      .join(", ");
    const values = fields.map((field) => updates[field]);
    values.push(rcpIdx);

    const result = await db.query(
      `UPDATE TB_RECIPE SET ${setClause} WHERE rcp_idx = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Recipe not found or no changes made" });
    }
    return res.status(200).json({ message: "Recipe updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 레시피 삭제
router.delete("/:rcpIdx", authenticateAccessToken, async (req, res) => {
  const { rcpIdx } = req.params;
  const { userIdx } = req.user;

  // 유효성 검사 1: rcpIdx
  if (!isValidIdx(rcpIdx)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  try {
    // 유효성 검사 2: 레시피 등록자 혹은 Admin만 수정 가능
    // 레시피에서 user_idx 가져오기
    const recipe = await getRecipeOwner(rcpIdx);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // 현재 사용자가 Admin인지 확인
    const user = await getUserRole(userIdx);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 요청한 사용자가 레시피의 소유자거나 관리자인 경우만 허용
    if (recipe.user_idx !== userIdx && user.role !== "admin") {
      return res.status(403).json({ message: "Permission denied" });
    }

    const result = await db.query(`DELETE FROM TB_RECIPE WHERE rcp_idx = ?`, [
      rcpIdx,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 레시피 승인
router.patch("/:rcpIdx/approval", authenticateAccessToken, async (req, res) => {
  const { rcpIdx } = req.params;
  const { userIdx } = req.user;

  // 유효성 검사 1: rcpIdx
  if (!isValidIdx(rcpIdx)) {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  try {
    // 유효성 검사 2: Admin
    const user = await getUserRole(userIdx);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const result = await db.query(
      `UPDATE TB_RECIPE SET approved_yn = 'Y' WHERE rcp_idx = ?`,
      [rcpIdx]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Recipe not found or already approved" });
    }
    return res.status(200).json({ message: "Recipe approved successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
