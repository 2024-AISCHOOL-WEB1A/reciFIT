import React, { useEffect, useRef, useState } from "react";
import "../assets/css/recipe.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faChevronRight,
  faChevronLeft,
  faCamera,
  faFileExport,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { apiAxios, generalAxios } from "../utils/axiosUtils";
import RecipeMoreItem from "../components/RecipeMoreItem";
import swalModal from "../utils/swalModal";
import { throttle } from "lodash";
import { useSelector } from "react-redux";

const RecipeMain = () => {
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

  const queryParams = new URLSearchParams(location.search);
  const recommend = queryParams.get("recommend");

  const CATEGORY_ITEM_LOAD_STEP = 8;
  const MAX_CATEGORY_LENGTH = 80;

  // 상단 레시피 정보
  const [recipeData, setRecipeData] = useState(null);
  // 카테고리 레시피 정보
  const [categoryRecipeData, setCategoryRecipeData] = useState(null);
  const [categoryLength, setCategoryLength] = useState(CATEGORY_ITEM_LOAD_STEP);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const fileInputRef = useRef(null);
  const recipeResultRef = useRef(null);
  const categoryButtonRef = useRef(null);

  // 카테고리 검색 정보
  // 기본 랜덤 검색 값
  const categoryItem = [
    {
      type: "none",
      value: "none",
      category: "전체",
      img: "all.png",
    },
    {
      type: "type",
      value: "밑반찬",
      category: "밑반찬",
      img: "fried-egg-real.png",
    },
    {
      type: "type",
      value: "메인반찬",
      category: "메인반찬",
      img: "pork.png",
    },
    {
      type: "type",
      value: "국/탕",
      category: "국/탕",
      img: "nambi.png",
    },
    {
      type: "type",
      value: "찌개",
      category: "찌개",
      img: "zzigae.png",
    },
    {
      type: "time",
      value: "5분이내",
      category: "초스피드",
      img: "clock.png",
    },
    {
      type: "category",
      value: "손님접대",
      category: "손님접대",
      img: "cooking.png",
    },
    {
      type: "type",
      value: "밥/죽/떡",
      category: "밥/죽/떡",
      img: "rice-bowl.png",
    },
    {
      type: "category",
      value: "술안주",
      category: "술안주",
      img: "beer.png",
    },
    {
      type: "type",
      value: "면/만두",
      category: "면/만두",
      img: "chinese-food.png",
    },
  ];

  // '흑백 요리사'가 포함된 레시피만 등록
  useEffect(() => {
    const fetchRecipe = async (recommend) => {
      try {
        const response = await apiAxios.get("/recipes", {
          params: {
            searchString: "흑백요리사",
            random: true,
          },
        });
        console.log("Response received:", response.data.recipes);
        setRecipeData(response.data.recipes);
      } catch (err) {
        // console.log(err);
      }
    };

    const fetchCategoryRecipe = async () => {
      try {
        let params = {
          random: true,
          count: MAX_CATEGORY_LENGTH,
        };

        if (recommend === "true") {
          params = {};
        }

        const response = await apiAxios.get("/recipes", {
          params,
        });
        console.log(response.data);
        setCategoryRecipeData(response.data?.recipes);

        // 로딩 되면 스크롤
        if (recommend === "true") {
          if (recipeResultRef.current) {
            recipeResultRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      } catch (err) {
        // console.log(err);
      }
    };

    const fetchAllRecipeData = async () => {
      try {
        await Promise.all([fetchRecipe(recommend), fetchCategoryRecipe()]);
        // console.log("All recipes fetched successfully");
      } catch (err) {
        // console.log(err);
        await swalModal.fire({
          title: "레시피 정보 받아오기",
          text: `레시피 정보를 받아오는데 실패했습니다. 관리자에게 문의바랍니다.`,
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    };

    fetchAllRecipeData();
  }, [recommend]);

  // 스크롤 인식
  const handleScroll = throttle(() => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 페이지 최하단 100까지 접근하면
    if (scrollPosition >= documentHeight - 100) {
      setIsAtBottom(true);
    } else {
      setIsAtBottom(false);
    }
  }, 200);

  useEffect(() => {
    // 페이지 최하단에 도달했을 때 categoryLength 값 8씩 증가
    if (isAtBottom) {
      setCategoryLength((prevLength) => {
        // categoryLength 최대값은 40
        // if (prevLength < MAX_CATEGORY_LENGTH) {
        if (prevLength < categoryRecipeData?.length) {
          return prevLength + CATEGORY_ITEM_LOAD_STEP;
        }
        return prevLength;
      });
    }
  }, [isAtBottom]);

  useEffect(() => {
    // 스크롤 이벤트 리스너 추가
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 언마운트 될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  // 레시피 변경 함수
  const handleChangeRecipes = async (searchOption) => {
    // 레시피 변경

    // 모달 띄우기
    swalModal.fire({
      title: `${searchOption?.category} 레시피를 가져옵니다...`,
      text: "레시피 가져오는 중...",
      imageUrl: "/logo192.png",
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: "reciFIT",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      didOpen: () => {
        swalModal.showLoading();
      },
      didClose: () => {
        // 끝나고 스크롤
        if (categoryButtonRef.current) {
          categoryButtonRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      },
    });

    // 하단 초기화
    setCategoryRecipeData(undefined);

    // 밑에 나오는 개수 8개만
    setCategoryLength(CATEGORY_ITEM_LOAD_STEP);

    let params = {
      [searchOption.type]: searchOption.value,
      have: "없음",
      count: MAX_CATEGORY_LENGTH,
    };

    if (searchOption.type === "none") {
      params = {
        random: true,
        count: MAX_CATEGORY_LENGTH,
      };
    }

    try {
      const response = await apiAxios.get("/recipes", {
        params,
      });
      console.log(response.data);
      setCategoryRecipeData(response.data?.recipes);
    } catch (err) {
      // console.log(err);
      await swalModal.fire({
        title: "레시피 정보 받아오기",
        text: `레시피 정보를 받아오는데 실패했습니다. 관리자에게 문의바랍니다.`,
        icon: "error",
        confirmButtonText: "확인",
      });
    }

    // 모달 닫기
    swalModal.close();
  };

  // 슬라이드 구현을 위한 부분
  // 첫 번째 슬라이드
  const [firstSlideIndex, setFirstSlideIndex] = useState(0);
  const visibleItems = 4;

  const handlePrevFirst = () => {
    // 처음 항목에서 이전 버튼을 누르면 마지막 항목으로 이동
    if (firstSlideIndex === 0) {
      setFirstSlideIndex(recipeData.length - visibleItems); // 마지막 항목으로 이동
    } else {
      setFirstSlideIndex(firstSlideIndex - 1);
    }
  };

  const handleNextFirst = () => {
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
    setImage(null);
    setFileName("선택된 이미지 미리보기");
    setDetectionText("");
    // setIsEditable(false);
    // setUrl(null);

    // window.scrollTo(0, 0);
  };

  // const [url, setUrl] = useState("");

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

  const handleImageChange = async (event) => {
    const file = event.target.files[0]; // 파일 선택
    if (file) {
      const fileName = file.name;
      const fileType = file.type;

      setFileName(fileName);

      try {
        swalModal.fire({
          title: "음식 사진 업로드",
          text: "음식 사진을 업로드 중입니다...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          didOpen: () => {
            swalModal.showLoading();
          },
        });

        // presigned URL 요청
        const res = await apiAxios.post("/auth/upload/ingredients", {
          fileName,
          fileType,
        });

        // presigned URL 받기
        const { key, url } = res.data;

        // S3에 파일 업로드
        await generalAxios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
        });

        // 모달 닫기
        swalModal.close();

        swalModal.fire({
          title: "음식 사진 분석중",
          text: "음식 사진을 분석 중입니다...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          didOpen: () => {
            swalModal.showLoading();
          },
        });

        const response = await apiAxios.get("/recipes/ingredient-detection", {
          params: {
            photoUrl: key,
          },
        });
        console.log(response.data);
        console.log(response.data?.ingredientNames);
        setDetectionText(response.data?.ingredientNames);

        // 모달 닫기
        swalModal.close();

        // 이미지 사진 나오기
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result); // 이미지 파일을 base64로 저장
        };
        reader.readAsDataURL(file); // 파일을 base64로 변환
      } catch (err) {
        // setFileName(err.message);

        console.log(err);
        swalModal.fire({
          title: "사진 분석 실패",
          text: "사진 분석에 실패했습니다. 관리자에게 문의바랍니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }

      // 초기화
      event.target.value = "";
      fileInputRef.current.value = "";
    }
  };

  const handleFetchRecommendedRecipeData = async () => {
    // // 파일 스트림 가져오기
    // console.log(detectionText);

    // url 값이 없으면
    if (!detectionText) {
      // 사진을 먼저 업로드 해서 have 뽑아내야함
      return await swalModal.fire({
        title: "식재료 사진 에러",
        text: "인식된 재료가 없습니다. 사진을 업로드해 재료 인식을 시켜주세요.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }

    try {
      swalModal.fire({
        title: "당신에게 맞는 레시피를 가져옵니다...",
        text: "레시피 가져오는 중...",
        imageUrl: "/logo192.png",
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: "reciFIT",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        didOpen: () => {
          swalModal.showLoading();
        },
        didClose: () => {
          // 끝나고 스크롤
          if (recipeResultRef.current) {
            recipeResultRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        },
      });

      // 하단 초기화
      setCategoryRecipeData(undefined);

      // have 기반 추천으로 변경
      const response = await apiAxios.get("/recipes", {
        params: {
          have: detectionText,
        },
      });
      setCategoryRecipeData(response.data?.recipes);

      // 모달 닫기
      swalModal.close();

      // 모달 닫기
      closeModal();

      console.log(response.data);
    } catch (err) {
      console.log(err);
      swalModal.fire({
        title: "레시피 추천 실패",
        text: "레시피 추천에 실패했습니다. 관리자에게 문의바랍니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  // 검색창 검색
  const [searchText, setSearchText] = useState("");
  const handleSearch = async () => {
    // console.log(searchText);

    try {
      swalModal.fire({
        title: "검색한 레시피를 가져옵니다...",
        text: "레시피 가져오는 중...",
        imageUrl: "/logo192.png", // 여기에서 아이콘 이미지 URL을 설정
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: "reciFIT",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        didOpen: () => {
          swalModal.showLoading();
        },
        didClose: () => {
          // 끝나고 스크롤
          if (recipeResultRef.current) {
            recipeResultRef.current.scrollIntoView({
              behavior: "smooth", // 부드럽게 스크롤
              block: "start", // 상단으로 스크롤
            });
          }
        },
      });

      // 하단 초기화
      setCategoryRecipeData(undefined);

      const response = await apiAxios.get("/recipes", {
        params: {
          searchString: searchText,
        },
      });
      console.log(response.data);
      setCategoryRecipeData(response.data?.recipes);

      // 모달 닫기
      swalModal.close();
    } catch (err) {
      console.log(err);
      swalModal.fire({
        title: "레시피 검색 실패",
        text: "레시피 검색에 실패했습니다. 관리자에게 문의바랍니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  const triggerFileInput = () => {
    // document.getElementById("recipe-camera-input").click(); // 파일 선택 창 열기
    fileInputRef.current.click();
  };

  // textarea 수정 기능 추가
  const [detectionText, setDetectionText] = useState(""); // 기본값 설정
  // const [isEditable, setIsEditable] = useState(false); // 수정 가능 여부

  // const handleEditClick = () => {
  //   setIsEditable(true); // 수정 가능 상태로 전환
  // };

  const handleTextChange = (event) => {
    setDetectionText(event.target.value); // 텍스트 업데이트
  };

  // 검색창 내부의 placeholder를 모바일 버전일 때 다른 문구로 적용
  const [placeholderText, setPlaceholderText] = useState(
    "당신만의 재료로 완벽한 요리법을 찾아보세요 🍜"
  );

  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth < 768) {
        setPlaceholderText("이 재료로 뭐 해먹지? 🤔");
      } else {
        setPlaceholderText("당신만의 재료로 완벽한 요리법을 찾아보세요 🍜");
      }
    };
    updatePlaceholder();
    window.addEventListener("resize", updatePlaceholder);

    return () => {
      window.removeEventListener("resize", updatePlaceholder);
    };
  }, []);

  if (!user) {
    return <Navigate to="/join" replace />;
  }
  return (
    <div className="recipeMain-container">
      {/* 검색 폼 */}
      <div className="search__container">
        <div>
          <div className="search__input__container">
            <input
              className="search__input"
              type="text"
              placeholder={placeholderText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button className="searchBtn" onClick={handleSearch}></button>
          </div>
          <p className="search__title">
            #집밥 #초스피드 #1인분 #도시락 #영양식 #명절 #야식
          </p>
          <p className="search__title_mobile">
            #집밥 #초스피드 #1인분 #도시락 #영양식
          </p>
        </div>
        <div className="site-camera-img">
          <Link onClick={openModal}>
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
                  ref={fileInputRef}
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
                  // readOnly={!isEditable}
                />
                {/* <FontAwesomeIcon
                  icon={faPen}
                  onClick={handleEditClick}
                  id="detectionIcon"
                /> */}
              </div>

              <div>
                <button
                  className="upload-button"
                  onClick={handleFetchRecommendedRecipeData}
                >
                  레시피 추천받기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {recipeData ? (
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
              {/* <Link to="/recipe" className="list_content_btn">
                more
              </Link> */}
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
      ) : (
        <></>
        // <div id="loading-screen">
        //   <svg
        //     class="spinner"
        //     width="65px"
        //     height="65px"
        //     viewBox="0 0 66 66"
        //     xmlns="http://www.w3.org/2000/svg"
        //   >
        //     <circle
        //       class="path"
        //       fill="none"
        //       stroke-width="6"
        //       stroke-linecap="round"
        //       cx="33"
        //       cy="33"
        //       r="30"
        //     ></circle>
        //   </svg>
        // </div>
      )}

      <div className="recipe-main-category-continer" ref={categoryButtonRef}>
        <div className="recipe-main-category-title-wrapper">
          <h3 className="list_content_title">
            레시피 <span>분류</span>
          </h3>
        </div>
        <div className="recipe-main-category-button-container">
          {categoryItem.map((item, index) => (
            <div
              className="recipe-main-category-button-wrapper"
              key={index}
              onClick={() => {
                handleChangeRecipes(item);
              }}
            >
              <img src={`/img/recipe_category/${item?.img}`} alt="" />
              <span>{item?.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 여기서부터 레시피 검색결과 및 카테고리 선택결과 목록 */}
      <div className="recipeMoreContainer" ref={recipeResultRef}>
        {categoryRecipeData?.slice(0, categoryLength).map((item, index) => (
          <RecipeMoreItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default RecipeMain;
