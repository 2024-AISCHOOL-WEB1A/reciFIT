import React, { useState } from 'react';
import '../assets/css/recipe.css';
import data from '../data/recipesData';

import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const RecipeMain = () => {

    // 가장 상단의 배너
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const handleMouseEnter = (index) => {
        setHoveredIndex(index); // 현재 hover된 index만 설정
    };
    const handleMouseLeave = () => {
        setHoveredIndex(null); // hover가 풀리면 null로 초기화
    };


    // 슬라이드 구현을 위한 부분
    // 첫 번째 슬라이드
    const [firstSlideIndex, setFirstSlideIndex] = useState(0);
    const visibleItems = 4;

    const handlePrevFirst = () => {
        if (firstSlideIndex > 0) {
            setFirstSlideIndex(firstSlideIndex - 1);
        }
    };
    const handleNextFirst = () => {
        if (firstSlideIndex < data.blackRecipes.length - visibleItems) {
            setFirstSlideIndex(firstSlideIndex + 1);
        }
    };

    // 두 번째 슬라이드
    const [secondSlideIndex, setSecondSlideIndex] = useState(0);

    const handlePrevSecond = () => {
        if (secondSlideIndex > 0) {
            setSecondSlideIndex(secondSlideIndex - 1);
        }
    };
    const handleNextSecond = () => {
        if (secondSlideIndex < data.bestRecipes.length - visibleItems) {
            setSecondSlideIndex(secondSlideIndex + 1);
        }
    };

    return (
        <div className='recipeMain-container'>
            <div className='TopBanner'>
                <Link to="#">
                    <div className="TopBannerImgBg"></div>
                    <div className="TopBannerText">
                        <span>레시피 검색</span>
                        <img src="/img/camera_img.png" alt="" />
                    </div>
                </Link>
            </div>

            <div className='SearchForm'>
                <div className='searchBox'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} id='searchIcon' />
                    <input type="search" placeholder='재료명을 입력하여 검색' />
                </div>
            </div>

            <div>
                <div className='first-listItem'>
                    <div className='list_content'>
                        <h3 className='list_content_title'>
                            입이 즐거운 순간!
                            <span><span>흑</span><span>백</span><span>요</span><span>리</span><span>사</span></span>
                            BEST 레시피👨‍🍳
                        </h3>
                        <div className='list_content_btn_div'>
                            <Link to="#" className="list_content_btn">more</Link>
                        </div>
                    </div>
                    <div className='recipeList-container'>
                        <div className="slide_list_left">
                            <button type="button" className="slide_btn_prev" onClick={handlePrevFirst} disabled={firstSlideIndex === 0}>
                                <span><FontAwesomeIcon icon={faChevronLeft} /></span>
                            </button>
                        </div>
                        <ul className="slickList">
                            {data.blackRecipes.slice(firstSlideIndex, firstSlideIndex + visibleItems).map(blackRecipes => (
                                <li key={blackRecipes.rcp_idx} className="slide_list_li">
                                    <Link to={`/recipe/${blackRecipes.rcp_idx}`} className="slide_list_link" tabIndex="-1">
                                        <div className="slide_list_thumb">
                                            <img src={blackRecipes.ck_photo_url} alt={blackRecipes.ck_name} />
                                        </div>
                                        <div className="slide_list_caption">
                                            <div className="slide_list_caption_tit">{blackRecipes.ck_name}</div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="slide_list_right">
                            <button type="button" className="slide_btn_next" onClick={handleNextFirst} disabled={firstSlideIndex >= data.blackRecipes.length - visibleItems}>
                                <span><FontAwesomeIcon icon={faChevronRight} /></span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='second-listItem'>
                    <div className='list_content'>
                        <h3 className='list_content_title'>
                            오늘 뭐 먹지? BEST
                            <span><span>요</span><span>리</span><span>필</span><span>살</span><span>기</span></span>✨
                        </h3>
                        <div className='list_content_btn_div'>
                            <Link to="#" className="list_content_btn">more</Link>
                        </div>
                    </div>
                    <div className='recipeList-container'>
                        <div className="slide_list_left">
                            <button type="button" className="slide_btn_prev" onClick={handlePrevSecond} disabled={secondSlideIndex === 0}>
                                <span><FontAwesomeIcon icon={faChevronLeft} /></span>
                            </button>
                        </div>
                        <ul className="slickList">
                            {data.bestRecipes.slice(secondSlideIndex, secondSlideIndex + visibleItems).map(bestRecipes => (
                                <li key={bestRecipes.rcp_idx} className="slide_list_li">
                                    <Link to={`/recipe/${bestRecipes.rcp_idx}`} className="slide_list_link" tabIndex="-1">
                                        <div className="slide_list_thumb">
                                            <img src={bestRecipes.ck_photo_url} alt={bestRecipes.ck_name} />
                                        </div>
                                        <div className="slide_list_caption">
                                            <div className="slide_list_caption_tit">{bestRecipes.ck_name}</div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="slide_list_right">
                            <button type="button" className="slide_btn_next" onClick={handleNextSecond} disabled={secondSlideIndex >= data.bestRecipes.length - visibleItems}>
                                <span><FontAwesomeIcon icon={faChevronRight} /></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeMain;
