import React, { useState } from 'react';
import '../assets/css/recipe.css';
import data from '../data/recipesData';

import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const RecipeMain = () => {

    // youtube 동영상 재생
    const opts = {
        playerVars: {
            autoplay: 1, // 페이지 로드 시 자동 재생
            controls: 1, // 재생 컨트롤 표시 여부
            mute: 1,     // 자동 재생 시 소리를 끔
            loop: 1,     // 반복 재생
            playlist: 'cUQzxhmYdGs' // 반복 재생할 비디오 ID
        },
    };

    const onReady = (e) => {
        e.target.mute(); // 자동 재생 시 음소거
    };

    // 슬라이드 구현을 위한 부분
    const [startIndex, setStartIndex] = useState(0);
    const visibleItems = 4;

    const handlePrev = () => {
        if (startIndex > 0) {
            setStartIndex(startIndex - 1);
        }
    };

    const handleNext = () => {
        if (startIndex < data.blackRecipes.length - visibleItems) {
            setStartIndex(startIndex + 1);
        }
    };

    return (
        <div className='recipeMain-container'>

            <div className='youtubeVideo'>
                <YouTube videoId='xsTFsunt6-8' opts={opts} onReady={onReady} />
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
                            <button type="button" className="slide_btn_prev" onClick={handlePrev} disabled={startIndex === 0}>
                                <span><FontAwesomeIcon icon={faChevronLeft} /></span>
                            </button>
                        </div>
                        <ul className="slickList">
                            {data.blackRecipes.slice(startIndex, startIndex + visibleItems).map(blackRecipes => (
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
                            <button type="button" className="slide_btn_next" onClick={handleNext} disabled={startIndex >= data.blackRecipes.length - visibleItems}>
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
                            <button type="button" className="slide_btn_prev" onClick={handlePrev} disabled={startIndex === 0}>
                                <span><FontAwesomeIcon icon={faChevronLeft} /></span>
                            </button>
                        </div>
                        <ul className="slickList">
                            {data.bestRecipes.slice(startIndex, startIndex + visibleItems).map(bestRecipes => (
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
                            <button type="button" className="slide_btn_next" onClick={handleNext} disabled={startIndex >= data.bestRecipes.length - visibleItems}>
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
