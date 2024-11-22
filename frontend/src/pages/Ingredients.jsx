import React, { useCallback, useEffect, useState } from "react";
import "../assets/css/ingredients.css";
import data from "../data/recipesData";
import swalModal from "../utils/swalModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faPenToSquare,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { isValidDate } from "../utils/validation";
import { apiAxios } from "../utils/axiosUtils";
import _ from "lodash";
import { useSelector } from "react-redux";
import { formatDateToYyyyMmDd } from "../utils/commonUtils";
import RecipeMoreItem from "../components/RecipeMoreItem";
import { Navigate, useNavigate } from "react-router-dom";

const Ingredients = () => {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  // 레시피 정보
  const [categoryRecipeData, setCategoryRecipeData] = useState(null);

  // 보유 재료
  const [userIngredientData, setUserIngredientData] = useState(null);
  const [originalUserIngredientData, setOriginalUserIngredientData] =
    useState(null);

  const fetchUserIngredientData = useCallback(async () => {
    try {
      const response = await apiAxios.get("/users/ingredients");
      const userIngredients = response.data?.ingredients.map((item) => ({
        ...item,
        purchaseDate: formatDateToYyyyMmDd(item.purchaseDate),
        expiredDate: formatDateToYyyyMmDd(item.expiredDate),
      }));

      setUserIngredientData(userIngredients);
      setOriginalUserIngredientData(_.cloneDeep(userIngredients) || null);

      console.log(response.data?.ingredients);
    } catch (err) {
      swalModal.fire({
        title: "보유 재료 가져오기 실패",
        text: "보유 재료를 가져오지 못했습니다. 관리자에게 문의바랍니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  }, []);

  // 보유 재료 불러오기
  useEffect(() => {
    fetchUserIngredientData();
  }, []);

  useEffect(() => {
    const fetchCategoryRecipe = async () => {
      try {
        const response = await apiAxios.get("/recipes", {
          params: {
            count: 8,
          },
        });
        console.log(response.data);
        setCategoryRecipeData(response.data?.recipes);
      } catch (err) {
        // console.log(err);
      }
    };
    fetchCategoryRecipe();
  }, []);

  // percent 계산 함수
  const calculatePercentage = (purchasedDate, expiryDate) => {
    const purchase = new Date(purchasedDate);
    const expiry = new Date(expiryDate);
    const today = new Date();

    if (purchase >= expiry || today > expiry) {
      return 0;
    } else if (purchase >= today) {
      return 100;
    } else {
      const totalDuration = expiry - purchase;
      const remainingDuration = expiry - today;
      return Math.max(
        0,
        ((remainingDuration / totalDuration) * 100).toFixed(0)
      ); // 최소값 0 보장
    }
  };

  //
  // 하단 슬라이드 -------------------------------------------------
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recipesPerPage, setRecipesPerPage] = useState(4); // 1열로 보여줄 항목의 수

  // width 에 따라 리스트 개수 설정
  useEffect(() => {
    const updateRecipesPerPage = () => {
      if (window.innerWidth <= 767) {
        setRecipesPerPage(1);
      } else {
        setRecipesPerPage(4);
      }
    };

    updateRecipesPerPage(); // 초기 실행
    window.addEventListener("resize", updateRecipesPerPage);

    return () => {
      window.removeEventListener("resize", updateRecipesPerPage);
    };
  }, []);

  // 왼, 오 버튼
  const handleNext = () => {
    if (currentIndex < data.blackRecipes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // 상단 재료리스트 -------------------------------------------------
  // 수정 모달창
  const [isModalOpen, setIsModalOpen] = useState({
    mod: "none",
    isOpened: false,
  });
  const [modifiedItem, setModifiedItem] = useState(null);

  // 수정 모달창 띄우기
  const handleModify = (item, index) => {
    setIsModalOpen({ mod: "modify", isOpened: true });
    setModifiedItem(item);
  };

  // 모달창 닫기
  const handleModifyModalClose = () => {
    setIsModalOpen({ mod: "none", isOpened: false });
  };

  const handleIngreName = (e) => {
    setModifiedItem({ ...modifiedItem, ingreName: e.target.value });
  };
  const handleQuantity = (e) => {
    const numericValue = e.target.value
      .replace(/[^0-9.]/g, "")
      .replace(/\.(?=.*\.)/g, "");

    setModifiedItem({ ...modifiedItem, quantity: numericValue });
  };
  const handleUnit = (e) => {
    setModifiedItem({ ...modifiedItem, unit: e.target.value });
  };
  const handleDate = (e) => {
    // 숫자만 추출
    const numericValue = e.target.value.replace(/\D/g, "");

    // 최대 길이 제한 (yyyy-mm-dd: 10자리)
    if (numericValue.length > 8) return;

    // yyyy-mm-dd 형식으로 변환
    let formattedDate = numericValue;
    if (numericValue.length > 4) {
      formattedDate = `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`;
    }
    if (numericValue.length > 6) {
      formattedDate = `${numericValue.slice(0, 4)}-${numericValue.slice(
        4,
        6
      )}-${numericValue.slice(6)}`;
    }

    // 날짜 유효성 검사
    if (formattedDate.length === 10 && !isValidDate(formattedDate)) {
      return;
    }

    setModifiedItem({ ...modifiedItem, [e.target.name]: formattedDate });
  };

  // 수정 모달창 확인
  const handleModifiedItemModify = async () => {
    try {
      const response = await apiAxios.patch("/users/ingredients", {
        uIngreIdx: modifiedItem?.uIngreIdx,
        ingreName: modifiedItem?.ingreName,
        quantity: modifiedItem?.quantity,
        unit: modifiedItem?.unit,
        purchaseDate: modifiedItem?.purchaseDate,
        expiredDate: modifiedItem?.expiredDate,
      });
      // console.log(response.data);

      if (response.status === 200) {
        swalModal.fire({
          title: "재료 수정 성공",
          text: "재료 수정에 성공했습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });

        // 모달 닫기
        setIsModalOpen({ mode: "none", isOpened: false });

        // 다시 데이터를 받아오도록
        fetchUserIngredientData();
      } else {
        throw new Error();
      }
    } catch (err) {
      swalModal.fire({
        title: "재료 수정 실패",
        text: "재료 수정에 실패했습니다. 관리자에게 문의바랍니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  // 수정 모달창 삭제
  const handleModifiedItemDelete = () => {
    // 삭제 여부 묻기
    swalModal
      .fire({
        title: "항목 삭제",
        html: `${modifiedItem?.ingreName}를 삭제하시겠습니까?<br/>이 결정은 되돌릴 수 없습니다.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          // 삭제 요청
          try {
            const response = await apiAxios.delete(
              `/users/ingredients/${modifiedItem?.uIngreIdx}`
            );
            // console.log(response.data);

            if (response.status === 204) {
              swalModal.fire({
                title: "재료 삭제 성공",
                text: "재료 삭제에 성공했습니다.",
                icon: "success",
                confirmButtonText: "확인",
              });

              // 모달 닫기
              setIsModalOpen({ mode: "none", isOpened: false });

              // 다시 데이터를 받아오도록
              fetchUserIngredientData();
            } else {
              throw new Error();
            }
          } catch (err) {
            swalModal.fire({
              title: "재료 삭제 실패",
              text: "재료 삭제에 실패했습니다. 관리자에게 문의바랍니다.",
              icon: "error",
              confirmButtonText: "확인",
            });
          }
        }
      });
  };

  // 추가 모달창 띄우기
  const handleAddModifiedItem = () => {
    setIsModalOpen({ mod: "create", isOpened: true });
    setModifiedItem({
      uIngreIdx: -1,
      ingreIdx: 0,
      ingreName: "",
      purchaseDate: formatDateToYyyyMmDd(new Date()),
      expiredDate: "",
      quantity: 0,
      totalQuantity: 0,
      rptIdx: "",
      unit: "",
    });
  };

  // 추가 모달창 확인
  const handleModifiedItemAdd = async () => {
    try {
      const response = await apiAxios.post("/users/ingredients", {
        ingreName: modifiedItem?.ingreName,
        quantity: modifiedItem?.quantity,
        unit: modifiedItem?.unit,
        purchaseDate: modifiedItem?.purchaseDate,
        expiredDate: modifiedItem?.expiredDate,
      });
      console.log(response.data);
      if (response.status === 201) {
        swalModal.fire({
          title: "재료 추가 성공",
          text: "재료 추가에 성공했습니다.",
          icon: "success",
          confirmButtonText: "확인",
        });

        // 모달 닫기
        setIsModalOpen({ mode: "none", isOpened: false });

        // 다시 데이터를 받아오도록
        fetchUserIngredientData();
      } else {
        throw new Error();
      }
    } catch (err) {
      swalModal.fire({
        title: "재료 추기 실패",
        text: "재료 추가에 실패했습니다. 관리자에게 문의바랍니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  // 상태 아이콘
  const getStatusIcon = (percentage) => {
    if (percentage >= 50) {
      return <FontAwesomeIcon icon={faCircle} style={{ color: "#06FF00" }} />; // 50 이상이면 초록색
    } else if (percentage >= 20) {
      return <FontAwesomeIcon icon={faCircle} style={{ color: "#FFE400" }} />; // 20 이상 50 미만이면 노란색
    } else {
      return <FontAwesomeIcon icon={faCircle} style={{ color: "#FF1700" }} />; // 20 미만이면 빨간색
    }
  };

  // 레시피 추가 추천
  const handleRecommendRecipe = () => {
    navigate("/recipe?recommend=true");
  };

  if (!user) {
    return <Navigate to="/join" replace />;
  }
  return (
    // 전체 컨테이너
    <div className="ingre-container">
      {/* 수정 모달창 */}
      {isModalOpen?.isOpened && (
        <div className="modal-overlay-main">
          <div
            className="ingre-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-close-icon">
              <FontAwesomeIcon
                icon={faXmark}
                onClick={handleModifyModalClose}
              />
            </div>
            <div className="ingre-modal-content">
              <img src="logo192.png" alt="" />
              <h2>식재료 {isModalOpen?.mod === "modify" ? "수정" : "추가"}</h2>
              <table>
                <tbody>
                  <tr>
                    <td>재료 이름</td>
                    <td>
                      <input
                        type="text"
                        name="ingreName"
                        value={modifiedItem?.ingreName}
                        onChange={handleIngreName}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>남은 수량</td>
                    <td>
                      <div className="ingre-modal-quantity-wrapper">
                        <input
                          className="ingre-model-quantity-input"
                          type="text"
                          name="quantity"
                          value={modifiedItem?.quantity}
                          onChange={handleQuantity}
                        />
                        <input
                          className="ingre-model-unit-input"
                          type="text"
                          name="unit"
                          value={modifiedItem?.unit}
                          onChange={handleUnit}
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>구매일</td>
                    <td>
                      <input
                        type="text"
                        name="purchaseDate"
                        value={modifiedItem?.purchaseDate}
                        onChange={(e) => {
                          handleDate(e);
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>유통기한</td>
                    <td>
                      <input
                        type="text"
                        name="expiredDate"
                        value={modifiedItem?.expiredDate}
                        onChange={(e) => {
                          handleDate(e);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              {isModalOpen?.mod === "modify" ? (
                <div className="ingre-modal-button-wrapper">
                  <button
                    className="ingre-button ingre-cancel-button"
                    onClick={handleModifiedItemDelete}
                  >
                    삭제
                  </button>
                  <button
                    className="ingre-button ingre-add-button"
                    onClick={handleModifiedItemModify}
                  >
                    수정
                  </button>
                </div>
              ) : (
                <div className="ingre-modal-button-wrapper">
                  <button
                    className="ingre-button ingre-add-button"
                    onClick={handleModifiedItemAdd}
                  >
                    추가
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 재료 관리 */}
      <div className="ingre-my">
        <div className="ingre-button-container">
          <h3>
            {`${user?.userName}님`}의{" "}
            <span className="ingre-container-span">재료</span> 🥩
          </h3>
          <button
            className="ingre-button ingre-add-button ingre-desktop-button"
            onClick={handleAddModifiedItem}
          >
            추가
          </button>
        </div>

        {/* 재료 리스트 */}
        <div className="ingre-my-list">
          <table className="ingre-table" cellSpacing={"0"}>
            {/* Head */}
            <thead className="ingre-table-head">
              <tr>
                <th className="ingre-name-th">재료 이름</th>
                <th className="ingre-quantity-th">남은 수량</th>
                <th className="ingre-purchase-th">구매일</th>
                <th className="ingre-expired-th">유통기한</th>
                <th className="ingre-status-th">상태</th>
                <th className="ingre-delete-th">수정</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="ingre-table-body">
              {userIngredientData
                ?.filter((item) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dateObj = new Date(item.expiredDate);
                  dateObj.setHours(0, 0, 0, 0);
                  return dateObj > today;
                })
                .map((item, index) => {
                  if (item?.changed !== "delete")
                    return (
                      <tr key={index}>
                        <td className="ingre-name-td">{item?.ingreName}</td>
                        <td className="ingre-quantity-td">
                          {`${item?.quantity}${item?.unit}`}
                        </td>
                        <td className="ingre-purchase-td">
                          {item?.purchaseDate}
                        </td>
                        <td className="ingre-expired-td">
                          {item?.expiredDate}
                        </td>

                        <td className="ingre-status-td">
                          <div className="inger-status-bar-wrapper">
                            <div className="ingre-per-background">
                              <div
                                className="ingre-per-bar"
                                style={{
                                  width: `${calculatePercentage(
                                    item.purchaseDate,
                                    item.expiredDate
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="ingre-status-bar-circle-wrapper">
                              <div>
                                {getStatusIcon(
                                  calculatePercentage(
                                    item.purchaseDate,
                                    item.expiredDate
                                  )
                                )}
                              </div>
                              <div>
                                {calculatePercentage(
                                  item.purchaseDate,
                                  item.expiredDate
                                ) === 0
                                  ? "0"
                                  : String(
                                      calculatePercentage(
                                        item.purchaseDate,
                                        item.expiredDate
                                      )
                                    ).padStart(2, "0")}
                                %
                              </div>
                            </div>
                          </div>
                        </td>

                        <td
                          className="ingre-delete-td"
                          onClick={() => handleModify(item, index)}
                        >
                          <FontAwesomeIcon
                            className="ingre-delete-icon"
                            icon={faPenToSquare}
                          />
                        </td>
                      </tr>
                    );
                })}
            </tbody>
          </table>
          <div className="ingre-mobile-button-wrapper">
            <button
              onClick={handleAddModifiedItem}
              className="ingre-mobile-button ingre-add-button"
            >
              추가
            </button>
          </div>
        </div>
      </div>

      {/* 폐기 재료 관리 */}
      <div className="ingre-my">
        <div className="ingre-button-container">
          <h3>
            {`${user?.userName}님`}의{" "}
            <span className="ingre-container-red-span">폐기 재료</span> 💀
          </h3>
        </div>

        {/* 재료 리스트 */}
        <div className="ingre-my-list">
          <table className="ingre-table" cellSpacing={"0"}>
            {/* Head */}
            <thead className="ingre-table-head">
              <tr>
                <th className="ingre-name-th">재료 이름</th>
                <th className="ingre-quantity-th">남은 수량</th>
                <th className="ingre-purchase-th">구매일</th>
                <th className="ingre-expired-th">유통기한</th>
                <th className="ingre-status-th">상태</th>
                <th className="ingre-delete-th">수정</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="ingre-table-body">
              {userIngredientData
                ?.filter((item) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const dateObj = new Date(item.expiredDate);
                  dateObj.setHours(0, 0, 0, 0);
                  return dateObj < today;
                })
                .map((item, index) => {
                  if (item?.changed !== "delete")
                    return (
                      <tr key={index}>
                        <td className="ingre-name-td">{item?.ingreName}</td>
                        <td className="ingre-quantity-td">
                          {`${item?.quantity}${item?.unit}`}
                        </td>
                        <td className="ingre-purchase-td">
                          {item?.purchaseDate}
                        </td>
                        <td className="ingre-expired-td">
                          {item?.expiredDate}
                        </td>

                        <td className="ingre-status-td">
                          <div className="inger-status-bar-wrapper">
                            <div className="ingre-per-background">
                              <div
                                className="ingre-per-bar"
                                style={{
                                  width: `${calculatePercentage(
                                    item.purchaseDate,
                                    item.expiredDate
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="ingre-status-bar-circle-wrapper">
                              <div>
                                {getStatusIcon(
                                  calculatePercentage(
                                    item.purchaseDate,
                                    item.expiredDate
                                  )
                                )}
                              </div>
                              <div>
                                {calculatePercentage(
                                  item.purchaseDate,
                                  item.expiredDate
                                ) === 0
                                  ? "0"
                                  : String(
                                      calculatePercentage(
                                        item.purchaseDate,
                                        item.expiredDate
                                      )
                                    ).padStart(2, "0")}
                                %
                              </div>
                            </div>
                          </div>
                        </td>

                        <td
                          className="ingre-delete-td"
                          onClick={() => handleModify(item, index)}
                        >
                          <FontAwesomeIcon
                            className="ingre-delete-icon"
                            icon={faPenToSquare}
                          />
                        </td>
                      </tr>
                    );
                })}
            </tbody>
          </table>
          <div className="ingre-mobile-button-wrapper"></div>
        </div>
      </div>

      {/* 하단 레시피 */}
      <div>
        <h3>
          {`${user?.userName}님`}에게{" "}
          <span className="ingre-container-span">F</span>
          <span className="ingre-container-span">I</span>
          <span className="ingre-container-span">T</span>한 레시피 👀
        </h3>
        {categoryRecipeData && (
          <>
            <div className="ingre-recipe-container">
              {categoryRecipeData?.map((item, index) => (
                <RecipeMoreItem key={index} item={item} />
              ))}
            </div>
            <div className="ingre-recipe-button-wrapper">
              <button
                className="ingre-recipe-button"
                onClick={handleRecommendRecipe}
              >
                나에게 FIT한 레시피 더 보러가기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Ingredients;
