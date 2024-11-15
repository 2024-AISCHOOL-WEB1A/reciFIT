import React, { useState } from 'react'
import '../assets/css/ingredients.css';
import data from '../data/recipesData';


import { Link } from 'react-router-dom';


const Ingredients = () => {

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

  return (
    // 전체 컨테이너
    <div className='ingre-container'>

      {/* 최상단 슬라이드 */}
      <h3>이런 레시피는 어떠세요?👀</h3>
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

      {/* 재료 관리 */}
      <div className='ingre-my'>
        <h3>[닉네임]님의 재료</h3>

        {/* 재료 리스트 */}
        <div className='ingre-my-list'>
          재료 리스트를 띄우고, 재료 옆에 삭제버튼 있어야하고. 또... 뭐가 잇어야하지 용량 표기도 해야하고
        </div>
      </div>
    </div>
  )
}

export default Ingredients