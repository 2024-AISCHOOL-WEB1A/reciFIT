import { createSlice } from '@reduxjs/toolkit';

// 초기 상태 설정
const initialState = {
    photoSrc: "	https://recipe1.ezmember.co.kr/cache/recipe/2024/10/14/63916f1f4cf161d11f5c79221b690aba1.jpg",
    recipeName: "흑백요리사 나폴리 맛피아의 밤 티라미수 🍮",
    instructions: "요즘 안보는 사람 없쥬? 흑백요리사 ‘나폴리맛피아’ 쉐프의 밤티라미수 편의점 재료로 만들어낸 고급 디저트 이어진 시식으로 피곤해진 심사위원들을 깜짝 놀라게 만든 달달 밤티라미수 레시피 편의점 재료로 이렇게 고급진 맛을? 티라미수는 커피를 활용해 만드는 디저트로 이탈리아에서도 피곤한 사람들이 챙겨먹는다고 해요.",
    servings: 4,
    time: "60분 이내",
    difficulty: "아무나",
    ingredients: "[재료] 건표고버섯 9개| 오이 1/2개| 당근 1/2개| 양파 1/2개| 사과 1/2쪽| 그외의 야채| 과일 [녹말물] 녹말가루 2C| 물 1C| 계란 노른자 1개 [탕수 소스] 물 2C| 설탕 1/2C| 식초 3T| 간장 1T| 녹말물 2T",
    description: "1. 재료를 손질합니다. 2. 드레싱을 준비합니다. 3. 모든 재료를 섞습니다."
};

// 슬라이스 생성
const recipeSlice = createSlice({
    name: 'recipe',
    initialState,
    reducers: {
        // 상태를 업데이트하는 리듀서를 여기에 추가
        updateTitle: (state, action) => {
            state.title = action.payload;
        }
    }
});

// 액션과 리듀서를 내보냄
export const { updateTitle } = recipeSlice.actions;
export default recipeSlice.reducer;
