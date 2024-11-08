const validMethods = [
  "볶음",
  "끓이기",
  "부침",
  "조림",
  "무침",
  "비빔",
  "찜",
  "절임",
  "튀김",
  "삶기",
  "굽기",
  "데치기",
  "회",
  "기타",
];

const validCategories = [
  "일상",
  "초스피드",
  "손님접대",
  "술안주",
  "다이어트",
  "도시락",
  "영양식",
  "간식",
  "야식",
  "푸드스타일링",
  "해장",
  "명절",
  "이유식",
  "기타",
];

const validIngredientCategories = [
  "소고기",
  "닭고기",
  "육류",
  "채소류",
  "해물류",
  "달걀/유제품",
  "가공식품류",
  "쌀",
  "밀가루",
  "건어물류",
  "버섯류",
  "과일류",
  "콩/견과류",
  "곡류",
  "기타",
];

const validType = [
  "밑반찬",
  "메인반찬",
  "국/탕",
  "찌개",
  "디저트",
  "면/만두",
  "밥/죽/떡",
  "퓨전",
  "김치/젓갈/장류",
  "양념/소스/잼",
  "양식",
  "샐러드",
  "스프",
  "빵",
  "과자",
  "차/음료/술",
  "기타",
];

const validAmount = ["1인분", "2인분", "3인분", "4인분", "5인분", "6인분이상"];

const validTime = [
  "5분이내",
  "10분이내",
  "15분이내",
  "20분이내",
  "30분이내",
  "60분이내",
  "90분이내",
  "2시간이내",
  "2시간이상",
];

const validDifficulty = ["아무나", "초급", "중급", "고급", "신의경지"];

const isValidCkMethod = (ckMethod) => {
  return validMethods.includes(ckMethod);
};

const isValidCkCategory = (ckCategory) => {
  return validCategories.includes(ckCategory);
};

const isValidCkIngredientCategory = (ckIngredientCategory) => {
  return validIngredientCategories.includes(ckIngredientCategory);
};

const isValidCkType = (ckType) => {
  return validType.includes(ckType);
};

const isValidAmount = (ckAmount) => {
  return validAmount.includes(ckAmount);
};

const isValidTime = (ckTime) => {
  return validTime.includes(ckTime);
};

const isValidDifficulty = (ckDifficulty) => {
  return validDifficulty.includes(ckDifficulty);
};

module.exports = {
  isValidCkMethod,
  isValidCkCategory,
  isValidCkIngredientCategory,
  isValidCkType,
  isValidAmount,
  isValidTime,
  isValidDifficulty,
};
