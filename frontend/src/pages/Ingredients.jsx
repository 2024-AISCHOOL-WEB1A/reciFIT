import React from 'react'
import '../assets/css/ingredients.css';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import { Link } from 'react-router-dom';


const Ingredients = () => {

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },

    desktop: {
      breakpoint: { max: 2000, min: 1024 },
      items: 5,
      slidesToSlide: 3
    },

    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },

    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };



  return (
    <div className='ingre-container'>
      <div className='ingre-recipe'>
        <h3>이런 레시피는 어떠세요?</h3>
        <div className='ingre-recipe-list'>
          {/* 보유 식재료로 만들 수 있는 레시피 슬라이드 */}
          <div>
            {/* <Carousel responsive={responsive}>

              {movies.map(item => (
                <MovieCard key={item.id} movie={item} />
              ))}

            </Carousel> */}
          </div>
        </div>
      </div>

      <div className='ingre-my'>
        <h3>나의 재료</h3>
        <div className='ingre-my-list'>
          재료 리스트를 띄우고, 재료 옆에 삭제버튼 있어야하고. 또... 뭐가 잇어야하지 용량 표기도 해야하고
        </div>
      </div>
    </div>
  )
}

export default Ingredients