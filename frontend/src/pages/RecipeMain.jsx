import React, { useState } from 'react';
import '../assets/css/recipe.css';
import data from '../data/recipesData';

import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const RecipeMain = () => {

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

    // 검색창 이동
    // const searchClick = () => {
    //     window.location.href = '/';
    // }

    return (
        <div className='recipeMain-container'>
            {/* 검색 폼 */}
            <div className="search__container">
                <div>
                    <div className='search__input__container'>
                        <input className="search__input" type="text" placeholder="당신만의 재료로 완벽한 요리법을 찾아보세요 🍜" />
                        <button className='searchBtn'></button>
                    </div>
                    <p className="search__title">#집밥 #손님접대 #엄마손맛 #동파육 #백종원레시피</p>
                </div>
                <div className='site-camera-img'>
                    <Link to="/">
                        <img src="/img/site-camera-img.png" alt="" />
                    </Link>
                </div>
            </div>
            
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

            <div className='recipe-category'>
                <div className='list_content'>
                    <h3 className='list_content_title'>
                        레시피 <span>분류</span>
                    </h3>
                </div>
                <div className='recipeCategory-container'>
                    {/* <div className="slide_list_left">
                        <button type="button" className="slide_btn_prev" onClick={handlePrevFirst} disabled={firstSlideIndex === 0}>
                            <span><FontAwesomeIcon icon={faChevronLeft} /></span>
                        </button>
                    </div> */}
                    <div className="cate_cont">
                        <ul className='category-items'>
                            <li><Link to="/recipeList">
                                <img src="/img/recipe_category/all.png" alt="전체" />
                                <span>전체</span> </Link></li>
                            <li><Link to="/recipeList">
                                <img src="/img/recipe_category/fried-egg-real.png" alt="밑반찬" />
                                <span>밑반찬</span></Link></li>
                            <li><Link to="/recipeList">
                                <img src="/img/recipe_category/pork.png" alt="메인반찬" />
                                <span>메인반찬</span></Link></li>
                            <li><Link to="/recipeList">
                                <img src="/img/recipe_category/nambi.png" alt="국/탕" />
                                <span>국/탕</span></Link></li>
                            <li><Link to="/recipeList">
                                <img src="/img/recipe_category/zzigae.png" alt="찌개"/>
                                <span>찌개</span></Link></li>
                            <li><Link to="/recipeList">
                                <img src="/img/recipe_category/clock.png" alt="초스피드" />
                                <span>초스피드</span> </Link></li>
                            <li><Link to="/recipeList">
                                <img src="/img/recipe_category/cooking.png" alt="손님접대" />
                                <span>손님접대</span> </Link> </li>
                            <li><Link to="/recipeList">
                                <img src="/img/recipe_category/rice-bowl.png" alt="밥/죽/떡" />
                                <span>밥/죽/떡</span></Link></li>
                            <li><Link to="/recipeList">
                                <img src="/img/recipe_category/beer.png" alt="술안주" />
                                <span>술안주</span></Link></li>
                            <li><Link to="/recipeList">
                                <img src="/img/recipe_category/chinese-food.png" alt="아시안" />
                                <span>아시안</span></Link></li>
                        </ul>
                    </div>
                    {/* <div className="slide_list_right">
                        <button type="button" className="slide_btn_next" onClick={handleNextFirst} disabled={firstSlideIndex >= data.blackRecipes.length - visibleItems}>
                            <span><FontAwesomeIcon icon={faChevronRight} /></span>
                        </button>
                    </div> */}
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
    );
}

export default RecipeMain;
