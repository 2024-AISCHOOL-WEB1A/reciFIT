import React, { useState } from 'react'
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
  const [editData, setEditData] = useState(initialReceiptData);


  // 날짜 함수
  const calculateDateDifference = (startDate, endDate) => {
    // Date 객체로 변환
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 밀리초 차이를 계산
    const differenceInMilliseconds = end - start;

    // 밀리초를 일로 변환
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

    return Math.round(differenceInDays); // 반올림하여 정수로 반환
};

// 예제 날짜
const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD)
const pastDate = '2024-03-11'

// 날짜 차이 계산
const daysDifference = calculateDateDifference(pastDate, today);


// -------------------------------------------------------------------------------------

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

      <div>
            <p>과거 날짜: {pastDate}</p>
            <p>오늘 날짜: {today}</p>
            <p>날짜 차이: {daysDifference}일</p>
        </div>

        <h3> [닉네임]님의 재료 🥩 </h3>

        <div className='ingre-button-container'>
          <button onClick={handleButtonClick} className='ingre-button'>
            {isEditing ? '완료' : '수정'}
          </button>
        </div>

        {/* 재료 리스트 */}
        <div className='ingre-my-list'>
          <table className='ingre-table'>

            {/* Head */}
            <thead className='ingre-table-head'>
              <tr>
                <th style={{ width: "20%" }}>상품명</th>
                <th style={{ width: "10%" }}>수량</th>
                <th style={{ width: "15%" }}>유통기한</th>
                <th>상태</th>
                <th style={{ width: "10%" }}>삭제</th>
              </tr>
            </thead>

            {/* Body */}
            {editData.map((item, index) => (
              <tbody key={index} className='ingre-table-body'>
                <tr>
                  <td>{item.name}</td>
                  <td>{item.quantity}{item.unit}</td>
                  <td>{item.lifedays}</td>
                  <td>
                    <div className='ingre-per-background'>
                      <div className='ingre-per-bar'></div>
                    </div>
                  </td>
                  <td>삭제1</td>
                </tr>
              </tbody>
            ))}

          </table>
        </div>
      </div>
    </div>
  )
}



export default Ingredients