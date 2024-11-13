const express = require("express");
const router = express.Router();
const db = require("../../config/db");
const authenticateAccessToken = require("../../Middlewares/jwtAuthentication");
const { isValidIdx, isValidURL } = require("../../utils/validation");
const { receiptFormatDate } = require("../../utils/dbHelpers");
const {
  findMatchingIngredient,
  extractQuantityAndUnit,
  testData,
} = require("../../utils/ingredientsUtils");

// 레시피 영수증 분석
router.post("/", authenticateAccessToken, async (req, res) => {
  let { photoUrl } = req.body;
  const { userIdx } = req.user;

  // 유효성 검사 : photoUrl
  if (!photoUrl) {
    return res.status(400).json({ message: "Receipts Photo URL is required" });
  }

  // key인지 url인지 구분
  if (!isValidURL(photoUrl)) {
    photoUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${photoUrl}`;
  }

  // FastAPI 서버로 사진을 보내서 have 추출
  try {
    const ocrFastApiSrverUrl = `${process.env.OCR_FASTAPI_SERVER_HOST}:${process.env.OCR_FASTAPI_SERVER_PORT}/api/receipts-ocr`;
    const response = await axios.post(ocrFastApiSrverUrl, {
      image_url: photoUrl,
    });

    // 영수증 스캔 데이터
    const receiptData = response.data?.images[0]?.receipt?.result;
    // const receiptData = testData.images[0]?.receipt?.result;
    // 유효성 검사 1: 영수증 데이터
    if (!receiptData) {
      return res.status(400).json({ message: "No valid receipt data found." });
    }

    // 가게 데이터
    // const storeData = receiptData?.storeInfo;
    // 지불 데이터
    const paymentData = receiptData?.paymentInfo;
    // 품목 데이터
    const subData = receiptData?.subResults;

    // 구매일 및 품목 추출
    const purchaseDate = paymentData?.date
      ? receiptFormatDate(paymentData?.date)
      : receiptFormatDate(new Date());

    // findMatchingIngredient를 통해 식재료 이름 DB의 이름과 매칭, 수량과 unit도 가져오기
    const items = (subData?.items || [])
      .filter((item) => item.name?.text) // name이 있는 경우만 필터링
      .map((item) => {
        const normalizedText = item.name?.text || ""; // item.name?.text가 없을 때 대비
        const matchedName = findMatchingIngredient(normalizedText);

        if (matchedName) {
          // 수량과 단위를 추출
          const { quantity, unit } = extractQuantityAndUnit(normalizedText);

          // count 값을 설정: quantity가 0보다 크면 quantity를 사용, 그렇지 않으면 item.count.text 사용
          const count =
            quantity > 0
              ? quantity
              : item.count?.text
              ? parseInt(item.count.text, 10)
              : 1;

          return {
            name: matchedName,
            count,
            unit,
          };
        }
        return null; // 매칭되지 않으면 null 반환
      })
      .filter((item) => item !== null); // null 값을 제거하여 매칭되지 않은 항목 제외

    // 유효성 검사 2: 구매 재료 확인
    if (items.length === 0) {
      return res.status(400).json({ message: "No valid items found." });
    }

    // 영양소 계산
    let totalCalories = 0;
    let totalFat = 0;
    let totalProtein = 0;
    let totalCarbohydrates = 0;
    let totalFiber = 0;

    // items의 name을 이용해 TB_INGREDIENT에서 해당 재료 정보 가져오기
    const placeholders = items.map(() => "?").join(", ");
    const query = `
      SELECT ingre_idx, ingre_name, calories, protein, fat, carbohydrates, fiber, shelf_life_days
      FROM TB_INGREDIENT
      WHERE ingre_name IN (${placeholders})
    `;

    const [ingredientRows] = await db.execute(
      query,
      items.map((item) => item.name)
    );

    // items 순서에 맞춰 ingredientRows를 정렬하고, 데이터를 가공하여 영양소 합산
    const processedItems = items
      .map((item) => {
        const ingredient = ingredientRows.find(
          (ingredient) => ingredient.ingre_name === item.name
        );

        if (ingredient) {
          // 각 영양 성분을 합산
          totalCalories += (ingredient.calories || 0) * item.count;
          totalFat += (ingredient.fat || 0) * item.count;
          totalProtein += (ingredient.protein || 0) * item.count;
          totalCarbohydrates += (ingredient.carbohydrates || 0) * item.count;
          totalFiber += (ingredient.fiber || 0) * item.count;

          // expired_date 계산
          const expiredDate = new Date(purchaseDate);
          expiredDate.setDate(
            expiredDate.getDate() + (ingredient.shelf_life_days || 0)
          );

          // unit을 설정: item.unit이 존재하지 않으면 ingredient.distribution_unit 사용
          const unit = item.unit || ingredient.distribution_unit;

          // 가공된 데이터 생성
          return {
            userIdx,
            ingreIdx: ingredient.ingre_idx,
            ingreName: ingredient.ingre_name,
            quantity: item.count,
            totalQuantity: item.count,
            unit,
            purchaseDate,
            expiredDate: expiredDate.toISOString().split("T")[0], // YYYY-MM-DD 형식
            calories: ingredient.calories || 0,
            protein: ingredient.protein || 0,
            fat: ingredient.fat || 0,
            carbohydrates: ingredient.carbohydrates || 0,
            fiber: ingredient.fiber || 0,
          };
        } else {
          return null;
        }
      })
      .filter((item) => item !== null); // 유효하지 않은 항목 제거

    // TB_USER_RECEIPT 테이블에 데이터 삽입
    const receiptInsertQuery = `
      INSERT INTO TB_USER_RECEIPT (
        user_idx, rpt_photo_url, recognized_text, total_calories, total_fat, total_protein, total_carbohydrates, total_fiber, purchase_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
    const recognizedText = JSON.stringify(response.data);

    const [receiptResult] = await db.execute(receiptInsertQuery, [
      userIdx,
      photoUrl,
      recognizedText,
      totalCalories,
      totalFat,
      totalProtein,
      totalCarbohydrates,
      totalFiber,
      purchaseDate,
    ]);

    const rptIdx = receiptResult.insertId; // 삽입된 영수증의 rpt_idx 가져오기

    return res.status(200).json({
      rptIdx,
      items: processedItems,
      totals: {
        totalCalories,
        totalFat,
        totalProtein,
        totalCarbohydrates,
        totalFiber,
      },
    });
  } catch (err) {
    console.error("AI server request Error :", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 모든 영수증 스캔 데이터 불러오기
router.get("/", authenticateAccessToken, async (req, res) => {
  const { userIdx } = req.user;

  try {
    const [rows] = await db.execute(
      `SELECT 
        rpt_idx, 
        user_idx, 
        rpt_photo_url,
        recognized_text,
        total_calories, 
        total_fat, 
        total_protein, 
        total_carbohydrates, 
        total_fiber, 
        created_at
      FROM TB_USER_RECEIPT
      WHERE user_idx = ?`,
      [userIdx]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Not Found" });
    }

    // recognized_text를 json 객체 형태로 변환 후에
    const formattedRows = rows.map((row) => ({
      ...row,
      recognized_text: row.recognized_text
        ? JSON.parse(row.recognized_text)
        : null,
    }));

    return res.status(200).json(formattedRows);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;