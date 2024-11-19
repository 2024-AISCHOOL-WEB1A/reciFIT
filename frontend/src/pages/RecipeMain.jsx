import React, { useEffect, useState } from "react";
import "../assets/css/recipe.css";
import data from "../data/recipesData";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faXmark,
    faChevronRight,
    faChevronLeft,
    faCamera,
    faFileExport,
    faPen,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation, useParams } from "react-router-dom";
import { apiAxios } from "../utils/axiosUtils";
import RecipeMore from "../components/RecipeMore";

const RecipeMain = () => {
    const [recipeData, setRecipeData] = useState(null);
    const [recipeBest, setRecipeBest] = useState(null);

    // '흑백 요리사'가 포함된 레시피만 등록
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await apiAxios.get("/recipes", {
                    params: {
                        searchString: "흑백 요리사",
                    },
                });
                console.log("Response received:", response.data.recipes);
                setRecipeData(response.data.recipes);
            } catch (err) {
                console.error("Error fetching recipe:", err.message);
            }
        };
        fetchRecipe();
    }, []);

    // 슬라이드 구현을 위한 부분
    // 첫 번째 슬라이드
    const [firstSlideIndex, setFirstSlideIndex] = useState(0);
    const visibleItems = 4;

    const handlePrevFirst = () => {
        console.log("prev")

        // 처음 항목에서 이전 버튼을 누르면 마지막 항목으로 이동
        if (firstSlideIndex === 0) {
            setFirstSlideIndex(recipeData.length - visibleItems); // 마지막 항목으로 이동
        } else {
            setFirstSlideIndex(firstSlideIndex - 1); 
        }
    };
    
    const handleNextFirst = () => {
        console.log("next")

        // 마지막 항목에서 다음 버튼을 누르면 첫 번째 항목으로 이동
        if (firstSlideIndex >= recipeData.length - visibleItems) {
            setFirstSlideIndex(0); // 첫 번째 항목으로 이동
        } else {
            setFirstSlideIndex(firstSlideIndex + 1); // 일반적인 다음 슬라이드
        }
    };

    // 카메라 버튼 클릭 후 모달창
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 모달 열기 함수
    const openModal = () => {
        setIsModalOpen(true);
    };
    // 모달 닫기 함수
    const closeModal = () => {
        setIsModalOpen(false);
        window.scrollTo(0, 0);
    };
    useEffect(() => {
        if (isModalOpen) {
            // 모달 열릴 때 배경 스크롤 차단
            document.body.style.overflow = "hidden";
        } else {
            // 모달 닫힐 때 배경 스크롤 복원
            document.body.style.overflow = "";
        }
        // 컴포넌트 언마운트 시에도 정리
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);

    // 모달 창 내부의 이미지 업로드 기능
    const [image, setImage] = useState(null); // 업로드한 이미지 상태
    const [fileName, setFileName] = useState("선택된 이미지 미리보기");

    const handleImageChange = (event) => {
        const file = event.target.files[0]; // 파일 선택
        if (file) {
            setFileName(file.name); // 파일 이름 저장
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // 이미지 파일을 base64로 저장
            };
            reader.readAsDataURL(file); // 파일을 base64로 변환
        }
    };

    const triggerFileInput = () => {
        document.getElementById("recipe-camera-input").click(); // 파일 선택 창 열기
    };

    // textarea 수정 기능 추가
    const [detectionText, setDetectionText] = useState(""); // 기본값 설정
    const [isEditable, setIsEditable] = useState(false); // 수정 가능 여부

    const handleEditClick = () => {
        setIsEditable(true); // 수정 가능 상태로 전환
    };

    const handleTextChange = (event) => {
        setDetectionText(event.target.value); // 텍스트 업데이트
    };

    return (
        <div className="recipeMain-container">
            {/* 검색 폼 */}
            <div className="search__container">
                <div>
                    <div className="search__input__container">
                        <input
                            className="search__input"
                            type="text"
                            placeholder="당신만의 재료로 완벽한 요리법을 찾아보세요 🍜"
                        />
                        <button className="searchBtn"></button>
                    </div>
                    <p className="search__title">
                        #집밥 #손님접대 #엄마손맛 #동파육 #백종원레시피
                    </p>
                </div>
                <div className="site-camera-img">
                    <Link to="#" onClick={openModal}>
                        <img src="/img/site-camera-img.png" alt="" />
                    </Link>
                </div>

                {/* 카메라 이미지 모달 창 */}
                {/* 모달 창 */}
                {isModalOpen && (
                    <div className="modal-overlay-main" onClick={closeModal}>
                        <div
                            className="modal-container"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-close-icon" onClick={closeModal}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
                            <div className="upload-container">
                                <h2>식재료 이미지 촬영</h2>
                                <p className="reference-text">깨끗한 배경에서 촬영해주세요!</p>
                                <button onClick={triggerFileInput} className="modal-imgUpload">
                                    <FontAwesomeIcon icon={faCamera} />
                                </button>
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="camera"
                                    onChange={handleImageChange}
                                    id="recipe-camera-input"
                                />
                                <div className="selectImg-container">
                                    <span className="selectImg">
                                        <FontAwesomeIcon icon={faFileExport} />
                                        <p className="selectImg-Text">{fileName}</p>
                                    </span>
                                    {image && (
                                        <img
                                            src={image}
                                            alt="Uploaded preview"
                                            width="300"
                                            height="auto"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="detectionList">
                                <p>현재 인식된 재료 :</p>
                                <textarea
                                    id="detectionFood"
                                    value={detectionText}
                                    onChange={handleTextChange}
                                    readOnly={!isEditable}
                                />
                                <FontAwesomeIcon
                                    icon={faPen}
                                    onClick={handleEditClick}
                                    id="detectionIcon"
                                />
                            </div>

                            <div>
                                <button className="upload-button" onClick={closeModal}>
                                    등록하기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="first-listItem">
                <div className="list_content">
                    <h3 className="list_content_title">
                        입이 즐거운 순간!
                        <span>
                            <span>흑</span>
                            <span>백</span>
                            <span>요</span>
                            <span>리</span>
                            <span>사</span>
                        </span>
                        BEST 레시피👨‍🍳
                    </h3>
                    <div className="list_content_btn_div">
                        <Link to="/recipeList" className="list_content_btn">
                            more
                        </Link>
                    </div>
                </div>
                <div className="recipeList-container">
                    <div className="slide_list_left">
                        <button
                            type="button"
                            className="slide_btn_prev"
                            onClick={handlePrevFirst}
                            // disabled={firstSlideIndex === 0}
                        >
                            <span>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </span>
                        </button>
                    </div>
                    <ul className="slickList">
                        {console.log("firstSlideIndex",firstSlideIndex)}
                        {console.log("visibleItems", visibleItems)}
                        {recipeData && recipeData.length > 0 ? (
                            recipeData
                                .slice(firstSlideIndex, firstSlideIndex + visibleItems)
                                .map((recipe) => (

                                    <li key={recipe.rcp_idx} className="slide_list_li">
                                        <Link
                                            to={`/recipe/${recipe.rcp_idx}`}
                                            className="slide_list_link"
                                            tabIndex="-1"
                                        >
                                            <div className="slide_list_thumb">
                                                <img src={recipe.ck_photo_url} alt={recipe.ck_name} />
                                            </div>
                                            <div className="slide_list_caption">
                                                <div className="slide_list_caption_tit">
                                                    {recipe.ck_name}
                                                </div>
                                            </div>
                                        </Link>
                                    </li>
                                ))
                        ) : (
                            <p>No recipes available</p>
                        )}
                    </ul>
                    <div className="slide_list_right">
                        <button
                            type="button"
                            className="slide_btn_next"
                            onClick={handleNextFirst}
                            // disabled={
                            //     firstSlideIndex >= recipeData?.length - visibleItems
                            // }
                        >
                            <span>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="recipe-category">
                <div className="list_content">
                    <h3 className="list_content_title">
                        레시피 <span>분류</span>
                    </h3>
                </div>
                <div className="recipeCategory-container">
                    {/* <div className="slide_list_left">
                        <button type="button" className="slide_btn_prev" onClick={handlePrevFirst} disabled={firstSlideIndex === 0}>
                            <span><FontAwesomeIcon icon={faChevronLeft} /></span>
                        </button>
                    </div> */}
                    <div className="cate_cont">
                        <ul className="category-items">
                            <li>
                                <Link to="/recipeList?category=전체">
                                    <img src="/img/recipe_category/all.png" alt="전체" />
                                    <span>전체</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipeList?category=밑반찬">
                                    <img
                                        src="/img/recipe_category/fried-egg-real.png"
                                        alt="밑반찬"
                                    />
                                    <span>밑반찬</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipeList?category=메인반찬">
                                    <img src="/img/recipe_category/pork.png" alt="메인반찬" />
                                    <span>메인반찬</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipeList?category=국/탕">
                                    <img src="/img/recipe_category/nambi.png" alt="국/탕" />
                                    <span>국/탕</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipeList?category=찌개">
                                    <img src="/img/recipe_category/zzigae.png" alt="찌개" />
                                    <span>찌개</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipeList?category=초스피드">
                                    <img src="/img/recipe_category/clock.png" alt="초스피드" />
                                    <span>초스피드</span>{" "}
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipeList?category=손님접대">
                                    <img src="/img/recipe_category/cooking.png" alt="손님접대" />
                                    <span>손님접대</span>{" "}
                                </Link>{" "}
                            </li>
                            <li>
                                <Link to="/recipeList?category=밥/죽/떡">
                                    <img
                                        src="/img/recipe_category/rice-bowl.png"
                                        alt="밥/죽/떡"
                                    />
                                    <span>밥/죽/떡</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipeList?category=술안주">
                                    <img src="/img/recipe_category/beer.png" alt="술안주" />
                                    <span>술안주</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/recipeList?category=아시안">
                                    <img
                                        src="/img/recipe_category/chinese-food.png"
                                        alt="아시안"
                                    />
                                    <span>아시안</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {/* <div className="slide_list_right">
                        <button type="button" className="slide_btn_next" onClick={handleNextFirst} disabled={firstSlideIndex >= data.blackRecipes.length - visibleItems}>
                            <span><FontAwesomeIcon icon={faChevronRight} /></span>
                        </button>
                    </div> */}
                </div>
            </div>
            
            <div>
                <RecipeMore/>
            </div>
        </div>
    );
};

export default RecipeMain;
