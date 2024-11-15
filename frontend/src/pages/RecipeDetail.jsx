import React, { useState } from 'react';
import '../assets/css/recipe.css';

import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faUsers, faHourglassStart, faStar, faAnglesRight, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';

const RecipeDetail = () => {
    const navigate = useNavigate();

    // 아이콘 클릭 시 이전 페이지로 되돌아가기
    const goBack = () => {
        navigate(-1); // -1은 이전 페이지로 돌아감
    };

    const {
        photoSrc,
        recipeName,
        instructions,
        servings,
        time,
        difficulty,
        ingredients,
        description
    } = useSelector((state) => state.recipe);

    const sections = ingredients
        .split("[")
        .filter(Boolean)
        .map((section) => section.trim());

    // 찜하기 기능
    const [isHeartClicked, setIsHeartClicked] = useState(false);

    const heartClick = () => {
        setIsHeartClicked(!isHeartClicked);
    };

    return (
        <div id="recipe">
            <div id="recipe-details-title">
                <div id="recipe-details-goback" onClick={goBack}>
                    <FontAwesomeIcon icon={faAnglesLeft} />
                </div>
                <button className='heart-container' onClick={heartClick}>
                    <FontAwesomeIcon icon={isHeartClicked ? faHeart : faRegularHeart} id='heartBtn'/>
                    <span className='heartText'>Favorite</span>
                </button>
            </div>

            <div className='detail-container'>
                <div className="photo">
                    <img id="photo" src={photoSrc} alt="Recipe Photo" />
                </div>

                <div className='instruct-container'>
                    <div id="recipe_name">{recipeName}</div>
                    <div id="instruction">{instructions}</div>

                    {/* Additional Information */}
                    <div className="rowflex">
                        <div className="recipe-detail-rowflex-div">
                            <FontAwesomeIcon icon={faUsers} />
                            <div>{servings} 인분</div>
                        </div>
                        <div className="recipe-detail-rowflex-div">
                            <FontAwesomeIcon icon={faHourglassStart} />
                            <div>{time} 소요시간</div>
                        </div>
                        <div className="recipe-detail-rowflex-div">
                            <FontAwesomeIcon icon={faStar} />
                            <div>{difficulty} 난이도</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ingredients */}
            <div id="ingredient-wrapper">
                {sections.map((section, index) => {
                    const [title, ...items] = section.split("]");
                    return (
                        <div key={index} id='ingredient-List'>
                            {/* 재료 제목 */}
                            <div className='ingredientList-Title'>
                                <h3>{title}</h3>
                                <span>Ingredient</span>
                            </div>

                            {/* 재료 항목 테이블 */}
                            <table>
                                {items
                                    .join(" ")
                                    .split("|")
                                    .map((item, idx) => {
                                        const trimmedItem = item.trim();
                                        const row = [];

                                        if (trimmedItem.indexOf(" ") === -1) {
                                            // 항목이 공백을 포함하지 않으면 한 열만 생성
                                            row.push(
                                                <th key={idx} style={{ textAlign: 'left' }}>
                                                    {trimmedItem}
                                                </th>
                                            );
                                            row.push(
                                                <td key={idx + "second"} style={{ textAlign: 'center' }}>
                                                    {}
                                                </td>
                                            );
                                        } else {
                                            // 항목이 공백을 포함하면 두 열로 나누기
                                            const lastSpaceIndex = trimmedItem.lastIndexOf(" ");
                                            const firstPart = trimmedItem.substring(0, lastSpaceIndex).trim();
                                            const secondPart = trimmedItem.substring(lastSpaceIndex + 1).trim();


                                            row.push(
                                                <th key={idx + "first"} style={{ textAlign: 'left' }}>
                                                    {firstPart}
                                                </th>
                                            );
                                            row.push(
                                                <td key={idx + "second"} style={{ textAlign: 'center' }}>
                                                    {secondPart}
                                                </td>
                                            );
                                        }
                                        return <tr key={idx}>{row}</tr>;
                                    })}
                            </table>
                        </div>
                    );
                })}
            </div>

            {/* Description */}
            <div id='description-wrapper'>
                <div id="description-title">
                    <h3>요리 방법</h3>
                    <span>Cooking</span>
                </div>
                <div className="description">{description}</div>
            </div>

            <div className='cookingStart'>
                <FontAwesomeIcon icon={faAnglesRight} id='rightarrowIcon'/>
                <button className='cookingBtn'>Cooking Start</button>
            </div>
        </div>
    );
}

export default RecipeDetail;
