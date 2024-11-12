const ingredientsDict = require("../config/ingredientsDict");
const { normalizeString } = require("./commonUtils");

// 사전 데이터의 인덱스화 (초기화 단계에서 한 번만 실행)
const exactMatchMap = new Map(); // 원래 key와 normalization된 key를 매핑
const partialMatchMap = new Map();

for (const [key, values] of Object.entries(ingredientsDict)) {
  const normalizedKey = normalizeString(key);
  exactMatchMap.set(normalizedKey, key);

  if (Array.isArray(values)) {
    const normalizedValues = values.map((value) => {
      const normalizedValue = normalizeString(value);
      exactMatchMap.set(normalizedValue, key); // value도 원래 key와 매핑
      return normalizedValue;
    });
    partialMatchMap.set(normalizedKey, normalizedValues);
  } else {
    partialMatchMap.set(normalizedKey, []);
  }
}

// 사전에서 품목 이름과 매칭되는 키워드 찾기
function findMatchingIngredient(itemName) {
  if (!itemName) return null;

  const normalizedItemName = normalizeString(itemName);

  // 완전히 같은 경우 먼저 확인
  if (exactMatchMap.has(normalizedItemName)) {
    return exactMatchMap.get(normalizedItemName); // 원래 key 반환
  }

  // 포함 여부 확인 (긴 키부터 우선 매칭)
  const sortedKeys = Array.from(partialMatchMap.keys()).sort(
    (a, b) => b.length - a.length
  );
  for (const key of sortedKeys) {
    const values = partialMatchMap.get(key);
    if (normalizedItemName.includes(key)) {
      return exactMatchMap.get(key); // 원래 key 반환
    }
    if (values.some((value) => normalizedItemName.includes(value))) {
      return exactMatchMap.get(key); // 원래 key 반환
    }
  }

  return null; // 매칭되지 않으면 null 반환
}

function extractQuantityAndUnit(name) {
  // 수량과 단위가 여러 개 있는 경우도 포함하는 정규식
  const quantityRegex =
    /(\d+(\.\d+)?)(\s*kg|\s*g|\s*ml|\s*l|\s*L|\s*개|\s*병|\s*팩|\s*봉지|\s*컵)?/gi;
  const matches = [...name.matchAll(quantityRegex)];

  if (matches.length > 0) {
    let totalQuantity = 0;
    let primaryUnit = null;

    // 단위 변환 계수 (기준: g와 ml)
    const unitConversions = {
      kg: 1000, // kg to g
      g: 1,
      l: 1000, // l to ml
      ml: 1,
    };

    matches.forEach((match) => {
      const quantity = parseFloat(match[1]);
      const unit = match[3] ? match[3].trim().toLowerCase() : null;

      // 첫 번째 유효 단위를 기준으로 설정하되 g/ml 기준으로 강제
      if (!primaryUnit && unit) {
        primaryUnit = unit === "kg" ? "g" : unit === "l" ? "ml" : unit;
      }

      // 동일하거나 변환 가능한 단위일 경우 변환 후 합산
      if (unit in unitConversions && primaryUnit in unitConversions) {
        const convertedQuantity = quantity * unitConversions[unit];
        totalQuantity += convertedQuantity;
      } else if (!primaryUnit) {
        totalQuantity += quantity;
      }
    });
    return { quantity: totalQuantity || 1, unit: primaryUnit };
  }
  return { quantity: 0, unit: null };
}

// (() => {
//   const itemName = "해찬들 고추장 2kg+450g";
//   const matchedIngredient = findMatchingIngredient(itemName);
//   const extractedQuantityAndUnit = extractQuantityAndUnit(itemName);
//   if (matchedIngredient) {
//     console.log(
//       `매칭된 식재료: ${matchedIngredient} ${extractedQuantityAndUnit.quantity}${extractedQuantityAndUnit.unit}`
//     );
//   } else {
//     console.log("매칭되는 식재료가 없습니다.");
//   }
// })();

const testData = {
  version: "V2",
  requestId: "72689379-1d02-44da-ab7e-d8f32b0e699e",
  timestamp: 1730853112474,
  images: [
    {
      uid: "32054388142543308d974625535aad5b",
      name: "demo",
      inferResult: "SUCCESS",
      message: "SUCCESS",
      validationResult: { result: "NO_REQUESTED" },
      receipt: {
        meta: { estimatedLanguage: "ko" },
        result: {
          storeInfo: {
            name: {
              text: "매머드익스프레스",
              formatted: { value: "매머드익스프레스" },
              keyText: "",
              confidenceScore: 0.5712,
              boundingPolys: [
                {
                  vertices: [
                    { x: 1061.0, y: 721.0 },
                    { x: 1700.0, y: 721.0 },
                    { x: 1700.0, y: 816.0 },
                    { x: 1061.0, y: 816.0 },
                  ],
                },
              ],
              maskingPolys: [],
            },
            subName: {
              text: "광주서석점",
              keyText: "",
              confidenceScore: 0.66721,
              boundingPolys: [
                {
                  vertices: [
                    { x: 608.0, y: 693.0 },
                    { x: 1024.0, y: 703.0 },
                    { x: 1021.0, y: 838.0 },
                    { x: 605.0, y: 828.0 },
                  ],
                },
              ],
              maskingPolys: [],
            },
            bizNum: {
              text: "4192700818",
              formatted: { value: "419-27-00818" },
              keyText: "",
              confidenceScore: 0.8878,
              boundingPolys: [
                {
                  vertices: [
                    { x: 605.0, y: 861.0 },
                    { x: 1039.0, y: 884.0 },
                    { x: 1034.0, y: 972.0 },
                    { x: 600.0, y: 950.0 },
                  ],
                },
              ],
              maskingPolys: [],
            },
            addresses: [
              {
                text: "광주광역시 동구 제봉로82번길 13, 1층",
                formatted: { value: "광주광역시 동구 제봉로82번길 13, 1층" },
                keyText: "",
                confidenceScore: 0.96695,
                boundingPolys: [
                  {
                    vertices: [
                      { x: 612.0, y: 764.0 },
                      { x: 1027.0, y: 792.0 },
                      { x: 1020.0, y: 898.0 },
                      { x: 605.0, y: 870.0 },
                    ],
                  },
                  {
                    vertices: [
                      { x: 1061.0, y: 816.0 },
                      { x: 1224.0, y: 816.0 },
                      { x: 1224.0, y: 904.0 },
                      { x: 1061.0, y: 904.0 },
                    ],
                  },
                  {
                    vertices: [
                      { x: 1261.0, y: 811.0 },
                      { x: 1733.0, y: 818.0 },
                      { x: 1732.0, y: 913.0 },
                      { x: 1260.0, y: 906.0 },
                    ],
                  },
                  {
                    vertices: [
                      { x: 1772.0, y: 819.0 },
                      { x: 1892.0, y: 828.0 },
                      { x: 1885.0, y: 913.0 },
                      { x: 1766.0, y: 904.0 },
                    ],
                  },
                  {
                    vertices: [
                      { x: 1918.0, y: 821.0 },
                      { x: 2046.0, y: 821.0 },
                      { x: 2046.0, y: 914.0 },
                      { x: 1918.0, y: 914.0 },
                    ],
                  },
                ],
                maskingPolys: [],
              },
            ],
            tel: [
              {
                text: "010-1234-5678",
                formatted: { value: "01012345678" },
                keyText: "TEL",
                confidenceScore: 0.78157,
                boundingPolys: [
                  {
                    vertices: [
                      { x: 1721.0, y: 900.0 },
                      { x: 2246.0, y: 900.0 },
                      { x: 2246.0, y: 989.0 },
                      { x: 1721.0, y: 989.0 },
                    ],
                  },
                ],
              },
            ],
          },
          paymentInfo: {
            date: {
              text: "20241017105656",
              formatted: { year: "2024", month: "10", day: "00" },
              keyText: "",
              confidenceScore: 0.63591,
              boundingPolys: [
                {
                  vertices: [
                    { x: 1038.0, y: 2901.0 },
                    { x: 1653.0, y: 2892.0 },
                    { x: 1655.0, y: 2991.0 },
                    { x: 1040.0, y: 3001.0 },
                  ],
                },
              ],
              maskingPolys: [],
            },
            cardInfo: {
              company: {
                text: "NH체크카드",
                formatted: { value: "NH체크카드" },
                keyText: "",
                confidenceScore: 0.83985,
                boundingPolys: [
                  {
                    vertices: [
                      { x: 950.0, y: 3071.0 },
                      { x: 1389.0, y: 3071.0 },
                      { x: 1389.0, y: 3171.0 },
                      { x: 950.0, y: 3171.0 },
                    ],
                  },
                ],
                maskingPolys: [],
              },
              number: {
                text: "546111**********",
                formatted: { value: "546111**********" },
                keyText: "",
                confidenceScore: 0.69336,
                boundingPolys: [
                  {
                    vertices: [
                      { x: 1043.0, y: 2989.0 },
                      { x: 1725.0, y: 2989.0 },
                      { x: 1725.0, y: 3075.0 },
                      { x: 1043.0, y: 3075.0 },
                    ],
                  },
                ],
                maskingPolys: [],
              },
            },
            confirmNum: {
              text: "63773237",
              keyText: "",
              confidenceScore: 0.48389,
              boundingPolys: [
                {
                  vertices: [
                    { x: 1039.0, y: 2811.0 },
                    { x: 1396.0, y: 2811.0 },
                    { x: 1396.0, y: 2907.0 },
                    { x: 1039.0, y: 2907.0 },
                  ],
                },
              ],
            },
          },
          subResults: [
            {
              items: [
                {
                  name: {
                    text: "바닐라 라떼",
                    formatted: { value: "바닐라 라떼" },
                    keyText: "",
                    confidenceScore: 0.94067,
                    boundingPolys: [
                      {
                        vertices: [
                          { x: 618.0, y: 1354.0 },
                          { x: 871.0, y: 1354.0 },
                          { x: 871.0, y: 1450.0 },
                          { x: 618.0, y: 1450.0 },
                        ],
                      },
                      {
                        vertices: [
                          { x: 901.0, y: 1347.0 },
                          { x: 1071.0, y: 1354.0 },
                          { x: 1067.0, y: 1453.0 },
                          { x: 897.0, y: 1446.0 },
                        ],
                      },
                    ],
                    maskingPolys: [],
                  },
                  count: {
                    text: "1",
                    formatted: { value: "1" },
                    keyText: "",
                    confidenceScore: 0.87442,
                    boundingPolys: [
                      {
                        vertices: [
                          { x: 2246.0, y: 1361.0 },
                          { x: 2293.0, y: 1361.0 },
                          { x: 2293.0, y: 1439.0 },
                          { x: 2246.0, y: 1439.0 },
                        ],
                      },
                    ],
                  },
                },
                {
                  name: {
                    text: "복숭아 아이스티",
                    formatted: { value: "복숭아 아이스티" },
                    keyText: "",
                    confidenceScore: 0.88996,
                    boundingPolys: [
                      {
                        vertices: [
                          { x: 621.0, y: 1671.0 },
                          { x: 875.0, y: 1671.0 },
                          { x: 875.0, y: 1768.0 },
                          { x: 621.0, y: 1768.0 },
                        ],
                      },
                      {
                        vertices: [
                          { x: 904.0, y: 1671.0 },
                          { x: 1225.0, y: 1671.0 },
                          { x: 1225.0, y: 1761.0 },
                          { x: 904.0, y: 1761.0 },
                        ],
                      },
                    ],
                    maskingPolys: [],
                  },
                },
              ],
            },
          ],
          totalPrice: {
            price: {
              text: "7,100",
              formatted: { value: "7100" },
              keyText: "결제금액",
              confidenceScore: 0.91226,
              boundingPolys: [
                {
                  vertices: [
                    { x: 2100.0, y: 2300.0 },
                    { x: 2361.0, y: 2300.0 },
                    { x: 2361.0, y: 2475.0 },
                    { x: 2100.0, y: 2475.0 },
                  ],
                },
              ],
            },
          },
          subTotal: [
            {
              taxPrice: [
                {
                  text: "643",
                  formatted: { value: "643" },
                  keyText: "부가세",
                  confidenceScore: 0.95624,
                  boundingPolys: [
                    {
                      vertices: [
                        { x: 2186.0, y: 2057.0 },
                        { x: 2332.0, y: 2057.0 },
                        { x: 2332.0, y: 2146.0 },
                        { x: 2186.0, y: 2146.0 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    },
  ],
};

module.exports = { findMatchingIngredient, extractQuantityAndUnit, testData };
