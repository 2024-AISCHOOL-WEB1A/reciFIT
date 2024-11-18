import React, { useEffect, useState } from 'react';
import '../assets/css/recipe.css';

import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesLeft, faUsers, faHourglassStart, faStar, faAnglesRight, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { apiAxios } from '../utils/axiosUtils'
import swalModal from '../utils/swalModal';

const RecipeDetail = () => {
    const navigate = useNavigate();

    // 아이콘 클릭 시 이전 페이지로 되돌아가기
    const goBack = () => {
        navigate(-1); // -1은 이전 페이지로 돌아감
    };

    // 서버에서 rcpIdx 값 가져오기
    const { rcpIdx } = useParams()
    const [recipe, setRecipe] = useState(null)
    const [error, setError] = useState(null)
    const [sections, setSections] = useState(null)

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                // API 호출하는 부분
                const response = await apiAxios.get(`/recipes/${rcpIdx}`);
                setRecipe(response.data);
                console.log(response.data)

                setSections(response.data?.ck_ingredients.split("[")
                    .filter(Boolean)
                    .map((section) => section.trim()))
            } catch (err) {
                console.log(err)
            }
        }
        fetchRecipe();
    }, [rcpIdx]);

    // const sections = "[재료] 당근 10개| 소금 1T"
    //     .split("[")
    //     .filter(Boolean)
    //     .map((section) => section.trim());

    // 찜하기 기능
    const [isHeartClicked, setIsHeartClicked] = useState(false);

    const heartClick = () => {
        setIsHeartClicked(!isHeartClicked);
    };

    const handleCookingStart = ()=> {
        swalModal.fire({
            title: "요리를 시작하시겠습니까?",
            text: "요리를 시작하시면 보유 음식 재료가 자동으로 차감됭ㅂ니다.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: '예',
            cancelButtonText: '아니오'
            }).then((result) => {
            if (result.isConfirmed) {
                // 예를 클릭했을 때 실행되는 코드
                // TODO : 재료 차감 axios
                // TODO : 성공했을 경우
                swalModal.fire({
                    title: "음식 재료 차감 성공",
                    html: `보유하신 음식 재료가 정상적으로 차감되었습니다<br>즐거운 식사 시간 보내세요~`,
                    icon: "success",
                    confirmButtonText: '확인',
                    });
            } else {
                // 아니오를 클릭했을 때 실행되는 코드
                console.log("아니오")
            }});
    }

    return (
        <div id="recipe">
            <div id="recipe-details-title">
                <div id="recipe-details-goback" onClick={goBack}>
                    <FontAwesomeIcon icon={faAnglesLeft} />
                </div>
            </div>

            <div className='detail-container'>
                <div className="photo">
                    <img id="photo" src={recipe?.ck_photo_url} alt={recipe?.ck_name} />
                </div>

                <div className='instruct-container'>
                    <div id="recipe_name">{recipe?.ck_name}</div>
                    <div id="instruction">{recipe?.ck_instructions}</div>

                    {/* Additional Information */}
                    <div className="rowflex">
                        <div className="recipe-detail-rowflex-div">
                            <FontAwesomeIcon icon={faUsers} />
                            <div> {recipe?.ck_amount}</div>
                        </div>
                        <div className="recipe-detail-rowflex-div">
                            <FontAwesomeIcon icon={faHourglassStart} />
                            <div> {recipe?.ck_time} 소요시간</div>
                        </div>
                        <div className="recipe-detail-rowflex-div">
                            <FontAwesomeIcon icon={faStar} />
                            <div> {recipe?.ck_difficulty} 난이도</div>
                        </div>
                        <div>
                            <button className='heart-container' onClick={heartClick}>
                                <FontAwesomeIcon icon={isHeartClicked ? faHeart : faRegularHeart} id='heartBtn' />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ingredients */}
            <div id="ingredient-wrapper">
                {sections?.map((section, index) => {
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
                                                    { }
                                                </td>
                                            );
                                        } else {
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
                <div className="description">{recipe?.ck_description
                    ?.split(/(?=\d+\.)/) // 숫자 뒤의 점 기준으로 분리
                    .map((step, index) => (
                        <p key={index} id='indexItem'> {step.trim()}</p> 
                    ))}</div>
            </div>

            <div className='cookingStart'>
                <FontAwesomeIcon icon={faAnglesRight} id='rightarrowIcon' />
                <button className='cookingBtn' onClick={handleCookingStart}>Cooking Start</button>
            </div>
        </div>
    );
}

export default RecipeDetail;
