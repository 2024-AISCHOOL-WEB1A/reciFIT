import React, { useEffect, useState } from 'react'
import '../assets/css/ingredients.css';
import data from '../data/recipesData';
import initialReceiptData from '../json/receiptData.json';


const Ingredients = () => {

  // 슬라이드용
  const [isEditing, setIsEditing] = useState(false);
  const handleButtonClick = () => {
    setIsEditing(!isEditing);
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const recipesPerPage = 4; // 1열로 보여줄 항목의 수

  const handleNext = () => {
    if (currentIndex < data.blackRecipes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };


  // 리스트용
  const [status, setStatus] = useState("🟢");

  // 퍼센트 계산함수
  const [percentages, setPercentages] = useState([]);

  useEffect(() => {
    calculatePercentages();
  }, []); // 컴포넌트가 렌더링될 때 자동 실행

  const calculatePercentages = () => {
    const today = new Date();
    const results = initialReceiptData.map((item) => {
      const purchasedDate = new Date(item.purchaseDate);
      const expiryDate = new Date(item.expiredDate);


      // 유통기한 계산
      let percentage;
      if (purchasedDate >= expiryDate || today > expiryDate) {
        percentage = 0; // 유통기한이 이미 지났거나 잘못된 입력일 경우
      } else if (purchasedDate >= today) {
        percentage = 100; // 구매일이 현재 시간 이후라면 아직 100%
      } else {
        const totalDuration = expiryDate - purchasedDate; // 전체 유통기한 기간
        const remainingDuration = expiryDate - today; // 남은 기간
        percentage = ((remainingDuration / totalDuration) * 100).toFixed(0); // 소수점 제거
        console.log(totalDuration);
      }

      return { ...item, percentage }; // 기존 데이터에 퍼센티지 추가      
    });
    
    setPercentages(results); // 결과 저장
  };






  return (

    // 전체 컨테이너
    <div className='ingre-container'>

      {/* 최상단 슬라이드 */}
      {!isEditing && (
        <div>
          <h3>이런 레시피는 어떠세요? 👀</h3>
          <div className='ingre-recipe'>
            <div className='ingre-recipe-list'>
              {/* 보유 식재료로 만들 수 있는 레시피 슬라이드 */}
              <button onClick={handlePrevious} disabled={currentIndex === 0} className='ingre-left-button'>
                {"<"}
              </button>

              <div className="ingre-recipe-list">
                {data.blackRecipes
                  .slice(currentIndex, currentIndex + recipesPerPage)
                  .map((recipe) => (
                    <div className="ingre-recipe-item" key={recipe.rcp_idx}>
                      <img src={recipe.ck_photo_url} alt={recipe.ck_name} className="ingre-recipe-image" />
                      <p className="ingre-recipe-name">{recipe.ck_name}</p>
                    </div>
                  ))}
              </div>

              <button onClick={handleNext} disabled={currentIndex >= data.blackRecipes.length - recipesPerPage} className='ingre-right-button'>
                {">"}
              </button>

            </div>
          </div>
        </div>
      )}


      {/* 재료 관리 */}
      <div className='ingre-my'>

        <h3> [닉네임]님의 재료 🥩 </h3>

        <div className='ingre-button-container'>
          <button onClick={handleButtonClick} className='ingre-button'>
            {isEditing ? '완료' : '수정'}
            {/* 수정눌렀을 때 걍 뒤로 갈 수 있는 취소 버튼 추가 */}
          </button>
        </div>

        {/* 재료 리스트 */}
        <div className='ingre-my-list'>
          <table className='ingre-table' cellSpacing={"0"}>

            {/* Head */}
            <thead className='ingre-table-head'>
              <tr>
                <th style={{ width: "20%" }}>상품명</th>
                <th style={{ width: "10%" }}>수량</th>
                <th style={{ width: "15%" }}>유통기한</th>
                <th>상태</th>
                <th style={{ width: "5%" }}></th>
                <th style={{ width: "10%" }}>삭제</th>
              </tr>
            </thead>

            {/* Body */}

            <tbody className='ingre-table-body'>
              {percentages.map((item) => (
                <tr>
                  <td>{item.name}</td>
                  <td>{item.quantity}{item.unit}</td>
                  <td>{item.expiredDate}</td>
                  <td style={{ display: "flex", position: "relative", alignItems: "center" }}>
                    <div className='ingre-per-bar' style={{ width: `${item.percentage}%` }}></div>
                    <div className='ingre-per-background'></div>
                  </td>
                  <td><div className='ingre-per-status'> {item.percentage}% {status} </div></td>
                  <td>{item.percentage}</td>
                </tr>
              ))}
            </tbody>

          </table>

          {/* <button onClick={HandleCheck}> 확인용 </button> */}
        </div>
      </div>
    </div>
  )
}


export default Ingredients