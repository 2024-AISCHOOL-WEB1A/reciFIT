import React, { useEffect, useState, useRef } from "react";
import "../assets/css/mypage.css";

const Mypage = () => {
  //비동기 데이터 처리용
  const [userData, setUserData] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([
    {
      u_ingre_idx: 1,
      name: "양파",
      quantity: 3,
      purchase_date: "2024-10-22",
      expired_date: "2024-11-10",
    },
    {
      u_ingre_idx: 2,
      name: "감자",
      quantity: 3,
      purchase_date: "2024-10-22",
      expired_date: "2024-11-10",
    },
  ]);
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const userId = 1; // 요청할 사용자 ID (예시)

  const infoSectionRef = useRef(null);
  const statsSectionRef = useRef(null);
  const recipesRef = useRef(null);
  const ingredientsRef = useRef(null);
  const receiptsRef = useRef(null);

  // 사용자 데이터 로드
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const userResponse = await fetch(`/api/users/${userId}`);
        const user = await userResponse.json();

        const envScoreResponse = await fetch(`/api/environmentScore/${userId}`);
        const envScore = await envScoreResponse.json();

        setUserData({
          ...user,
          envScore: envScore.env_score,
        });
      } catch (error) {
        console.error("사용자 데이터를 가져오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // 특정 섹션으로 이동
  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 섹션 데이터 로드 핸들러
  const handleSectionClick = async (section) => {
    setIsLoading(true);
    try {
      let response;

      switch (section) {
        case "recipes":
          response = await fetch(`/api/users/${userId}/recipes`);
          setRecipes(await response.json());
          scrollToSection(recipesRef);
          break;
        case "ingredients":
          response = await fetch(`/api/users/${userId}/ingredients`);
          setIngredients(await response.json());
          scrollToSection(ingredientsRef);
          break;
        case "receipts":
          response = await fetch(`/api/users/${userId}/receipts`);
          setReceipts(await response.json());
          scrollToSection(receiptsRef);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("데이터 로드 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 정보 수정 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 사용자 정보 저장
  const handleSave = async () => {
    try {
      await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      alert("저장 완료");
    } catch (error) {
      console.error("저장 중 오류 발생:", error);
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="mypage">
      <header className="my-header">
        <h2 className="shared-title-h2">마이 페이지</h2>
      </header>
      <section class="info-env-container">
        {/* 회원 정보 수정 */}
        <section ref={infoSectionRef} className="info-section">
          <h3 className="shared-title1">회원정보 수정</h3>
          <p>
            닉네임:
            <input
              type="text"
              name="nickname"
              value={userData.nickname || ""}
              onChange={handleChange}
            />
          </p>
          <p>
            회원 상태: <span>{userData.status || "없음"}</span>
          </p>
          <p>
            회원 역할: <span>{userData.role || "없음"}</span>
          </p>
          <p>
            회원 생성일:{" "}
            {new Date(userData.created_at).toLocaleDateString() || "없음"}
          </p>
          <p>
            회원 수정일:{" "}
            {new Date(userData.updated_at).toLocaleDateString() || "없음"}
          </p>
          <p>
            최종 로그인 일자:{" "}
            {new Date(userData.last_login).toLocaleDateString() || "없음"}
          </p>
        </section>
        {/* 환경 점수 */}
        <section ref={statsSectionRef} className="env-section">
          <div className="stats-card env-score-card">
            <h3 className="shared-title1">나의 환경점수는?</h3>
            <p>{userData.envScore || "100"}</p>
          </div>
        </section>
      </section>

      <section className="additional-recipes-container">
        {/* 추가 정보 입력/수정 */}
        <section className="additional-info">
          <div className="info-card">
            <h3 className="shared-title1">추가 정보 입력/수정</h3>
            <p>
              선호 식재료:
              <input
                type="text"
                name="preferredIngredients"
                value={userData.preferredIngredients || ""}
                onChange={handleChange}
              />
            </p>
            <p>
              기피 식재료:
              <input
                type="text"
                name="dislikedIngredients"
                value={userData.dislikedIngredients || ""}
                onChange={handleChange}
              />
            </p>
            <p>
              섭취불가(알러지) 식재료:
              <input
                type="text"
                name="nonConsumableIngredients"
                value={userData.nonConsumableIngredients || ""}
                onChange={handleChange}
              />
            </p>
          </div>
        </section>

        {/* 레시피 조회 */}
        <section ref={recipesRef} className="my-recipes">
          <button
            className="shared-title1"
            onClick={() => handleSectionClick("recipes")}
          >
            나의 레시피 조회
          </button>
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div key={recipe.fav_idx}>
                <p>레시피 이름: {recipe.name}</p>
                <p>
                  레시피 생성일:{" "}
                  {new Date(recipe.created_at).toLocaleDateString()}
                </p>
                <p>
                  요리 여부:{" "}
                  {recipe.cooked_yn === "Y" ? "조리됨" : "조리하지 않음"}
                </p>
              </div>
            ))
          ) : (
            <p>레시피 정보가 없습니다.</p>
          )}
        </section>
      </section>
      <section className="ingredients-receipts-container">
        {/* 식재료 관리 */}
        <section ref={ingredientsRef} className="my-ingredients">
          <button
            className="shared-title1"
            onClick={() => handleSectionClick("ingredients")}
          >
            식재료 관리
          </button>
          {ingredients.length > 0 ? (
            ingredients.map((ingredient) => (
              <div key={ingredient.u_ingre_idx}>
                <p>식재료 이름: {ingredient.name}</p>
                <p>식재료 보유량: {ingredient.quantity || 0}</p>
                <p>
                  식재료 구매일:{" "}
                  {new Date(ingredient.purchase_date).toLocaleDateString() ||
                    "없음"}
                </p>
                <p>
                  식재료 유통기한:{" "}
                  {new Date(ingredient.expired_date).toLocaleDateString() ||
                    "없음"}
                </p>
              </div>
            ))
          ) : (
            <p>식재료 정보가 없습니다.</p>
          )}
        </section>

        {/* 영수증 관리 */}
        <section ref={receiptsRef} className="my-receipts">
          <button
            className="shared-title1"
            onClick={() => handleSectionClick("receipts")}
          >
            영수증 관리
          </button>
          {receipts.length > 0 ? (
            receipts.map((receipt) => (
              <div key={receipt.rpt_idx}>
                <p>
                  영수증 사진:{" "}
                  {receipt.rpt_photo_url ? (
                    <img
                      src={receipt.rpt_photo_url}
                      alt="영수증"
                      style={{ maxWidth: "200px" }}
                    />
                  ) : (
                    "없음"
                  )}
                </p>
                <p>인식된 글자: {receipt.recognized_text || "없음"}</p>
                <p>총 칼로리: {receipt.total_calories || "0"}</p>
                <p>
                  영수증 생성일:{" "}
                  {new Date(receipt.created_at).toLocaleDateString() || "없음"}
                </p>
              </div>
            ))
          ) : (
            <p>영수증 정보가 없습니다.</p>
          )}
        </section>
      </section>
      {/* 저장 버튼 */}
      <footer className="mypage-footer">
        <button onClick={handleSave}>저장하기</button>
      </footer>
    </div>
  );
};

export default Mypage;
