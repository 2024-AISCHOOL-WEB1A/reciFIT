import React from 'react';
import '../assets/css/recipe.css';

import YouTube from 'react-youtube';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

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
        <div className='container'>
            {/* <div className='SearchForm'>
                <div className='searchBox'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} id='searchIcon' />
                    <input type="search" placeholder='재료명을 입력하여 검색' />
                </div>
            </div> */}

            <div className='youtubeVideo'>
                <YouTube videoId='xsTFsunt6-8' opts={opts} onReady={onReady}/>
            </div>
        </div>
    );
}

export default RecipeMain;
