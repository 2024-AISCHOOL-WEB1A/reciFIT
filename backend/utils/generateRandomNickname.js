const db = require("../config/db");
const loadIngredients = require("./loadIngredients"); // 음식재료 로드 모듈

// 랜덤 수식어 리스트
const adjectives = [
  "귀여운",
  "멋진",
  "용감한",
  "재미있는",
  "활기찬",
  "행복한",
  "부지런한",
  "친절한",
  "아름다운",
  "영리한",
  "명랑한",
  "당돌한",
  "정직한",
  "창의적인",
  "즐거운",
  "상냥한",
  "기발한",
  "발랄한",
  "신나는",
  "깜찍한",
  "똑똑한",
  "당찬",
  "온화한",
  "우아한",
  "단정한",
  "열정적인",
  "성실한",
  "믿음직한",
  "순수한",
  "고귀한",
  "즐거운",
  "활발한",
  "소박한",
  "따뜻한",
  "소심한",
  "섬세한",
  "차분한",
  "정중한",
  "신비로운",
  "다정한",
  "평온한",
  "호기심 많은",
  "도전적인",
  "유쾌한",
  "쾌활한",
  "장난꾸러기",
  "긍정적인",
  "활달한",
  "낙천적인",
  "고요한",
  "튼튼한",
  "화려한",
  "활기찬",
  "개성있는",
  "겸손한",
  "침착한",
  "상상력 풍부한",
  "독창적인",
  "열린 마음의",
  "믿음직한",
  "섬세한",
  "강인한",
  "지혜로운",
  "배려심 깊은",
  "심심한",
  "소탈한",
  "낭만적인",
  "달콤한",
  "끈기있는",
  "진실한",
  "깔끔한",
  "독립적인",
  "매력적인",
  "사려 깊은",
  "낙관적인",
  "침착한",
  "활력있는",
  "애교있는",
  "유머러스한",
  "중후한",
  "예의 바른",
  "예쁜",
  "책임감 있는",
  "결단력 있는",
  "차가운",
  "핫한",
  "신중한",
  "용의주도한",
  "열정적인",
  "성숙한",
  "겸허한",
  "꿈꾸는",
  "따뜻한",
  "긍정적인",
  "열심히 하는",
  "배려심 깊은",
  "인내심 있는",
  "정겨운",
  "충직한",
  "진지한",
  "지루한",
  "근엄한",
  "우호적인",
  "조용한",
  "도도한",
  "깊이 있는",
  "예리한",
  "깔끔한",
  "로맨틱한",
  "영감을 주는",
  "순진한",
  "열렬한",
  "편안한",
  "성실한",
  "용맹스러운",
  "밝은",
  "예민한",
  "사려깊은",
  "사랑스러운",
  "적극적인",
  "지적인",
  "야무진",
  "자애로운",
  "의젓한",
  "잘생긴",
  "엄격한",
];

// 4자리 랜덤 숫자 생성 함수
function getRandomFourDigitNumber() {
  return Math.floor(1000 + Math.random() * 9000);
}

// 랜덤 닉네임 생성 함수
async function generateRandomNickname() {
  try {
    // 음식재료 배열 로드
    const ingredients = await loadIngredients();

    // 랜덤 수식어, 음식재료, 숫자 선택
    const randomAdjective =
      adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomIngredient =
      ingredients[Math.floor(Math.random() * ingredients.length)];
    const randomNumber = getRandomFourDigitNumber();

    // 닉네임 조합
    return `${randomAdjective} ${randomIngredient} ${randomNumber}`;
  } catch (error) {
    console.error("Error generating nickname:", error);
    throw error;
  }
}

module.exports = generateRandomNickname;
