import React from 'react';
import '../assets/css/recipe.css';

import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const RecipeMain = () => {
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
                <div>
                    <div className='list_content'>
                        <h3 className='list_content_title'>
                            입이 즐거운 순간! 
                            <span><span>흑</span><span>백</span><span>요</span><span>리</span><span>사</span></span> 
                            BEST 레시피👨‍🍳
                        </h3>
                        <div>
                            <Link to="#" className="list_content_btn">more</Link>
                        </div>
                    </div>
                    <div className='recipeList-container'>
                        <div className="slide_list_left">
                            <button type="button" className="slide_btn_prev" aria-disabled="true">
                                <span><FontAwesomeIcon icon={faChevronLeft}/></span>
                            </button>
                        </div>
                        <ul className="slickList">
                            {[
                                {
                                    rcp_idx: 6988334,
                                    ck_photo_url: "https://recipe1.ezmember.co.kr/cache/recipe/2022/09/29/87411c51ac208e2d37e7f28c29b43e501.jpg",
                                    ck_name: "도시락에 빠질 수 없는 ✿유부초밥✿ 레시피 모음"
                                },
                                {
                                    rcp_idx: 6987988,
                                    ck_photo_url: "https://recipe1.ezmember.co.kr/cache/recipe/2022/09/23/ac74dbf3eb77097a1442492efa0d275c1.jpg",
                                    ck_name: "하루의 마무리는 역시 야식이지ｏ❤ｏ야식추천메뉴 8가지"
                                },
                                {
                                    rcp_idx: 6987503,
                                    ck_photo_url: "https://recipe1.ezmember.co.kr/cache/recipe/2022/09/23/484ba19948fd9d8bec99c5f8ddc9ecc61.jpg",
                                    ck_name: "감자 1박스 뽀개기 가능한 7가지 ☆감자 요리☆"
                                },
                                {
                                    rcp_idx: 6987032,
                                    ck_photo_url: "https://recipe1.ezmember.co.kr/cache/recipe/2022/07/20/72cd1c41546337f9abf1181e1dc66b2f1.jpg",
                                    ck_name: "전은 다 맛있지! 추석을 더 특별하게 즐기는 10가지 레시피oO*"
                                },
                                {
                                    rcp_idx: 6986287,
                                    ck_photo_url: "https://recipe1.ezmember.co.kr/cache/recipe/2022/08/08/f5808c7251790499d665d2d9be44a4211.jpg",
                                    ck_name: "'우유'가 들어가 더 부드럽고 고소한 우유 활용 레시피❤"
                                }
                            ].map(recipe => (
                                <li key={recipe.rcp_idx} className="slide_list_li">
                                    <Link to={`/recipe/${recipe.rcp_idx}`} className="slide_list_link" tabIndex="-1">
                                        <div className="slide_list_thumb">
                                            <img src={recipe.ck_photo_url} alt={recipe.ck_name} />
                                        </div>
                                        <div className="slide_list_caption">
                                            <div className="slide_list_caption_tit">{recipe.ck_name}</div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="slide_list_right">
                            <button type="button" className="slide_btn_next" aria-disabled="true">
                                <span><FontAwesomeIcon icon={faChevronRight}/></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeMain;
