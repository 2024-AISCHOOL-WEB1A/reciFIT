import React, { useEffect, useState } from "react";
import "../assets/css/ingredients.css";
import data from "../data/recipesData";
import initialReceiptData from "../json/receiptData.json";
import swalModal from "../utils/swalModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDeleteLeft,
  faCircle,
  faChevronRight,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { isValidDate } from "../utils/validation";
import { apiAxios } from "../utils/axiosUtils";
import _ from "lodash";
import { useSelector } from "react-redux";
import { formatDateToYyyyMmDd } from "../utils/commonUtils";

const Ingredients = () => {
  // 보유 재료
  const [userIngredientData, setUserIngredientData] = useState(null);
  const [originalUserIngredientData, setOriginalUserIngredientData] =
    useState(null);

  // 보유 재료 불러오기
  useEffect(() => {
    const fetchUserIngredientData = async () => {
      try {
        const response = await apiAxios.get("/users/ingredients");
        const userIngredients = response.data?.ingredients.map((item) => ({
          ...item,
          purchaseDate: formatDateToYyyyMmDd(item.purchaseDate),
          expiredDate: formatDateToYyyyMmDd(item.expiredDate),
        }));

        // 계산해서 집어넣기
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
    };

    fetchUserIngredientData();
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
  //
  //
  //

  //
  //
  //
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

  // 퍼센트 계산
  const [percentages, setPercentages] = useState([]);

  useEffect(() => {
    calculatePercentages();
  }, []); // 컴포넌트가 렌더링될 때 자동 실행

  // 유통기한 계산
  const calculatePercentages = () => {
    const today = new Date();
    const results = initialReceiptData.map((item) => {
      const purchasedDate = new Date(item.purchaseDate);
      const expiryDate = new Date(item.expiredDate);

      let percentage;
      if (purchasedDate >= expiryDate || today > expiryDate) {
        percentage = 0; // 유통기한이 이미 지났거나 잘못된 입력일 경우
      } else if (purchasedDate >= today) {
        percentage = 100; // 구매일이 현재 시간 이후라면 아직 100%
      } else {
        const totalDuration = expiryDate - purchasedDate; // 전체 유통기한 기간
        const remainingDuration = expiryDate - today; // 남은 기간
        percentage = ((remainingDuration / totalDuration) * 100).toFixed(0); // 소수점 제거
      }
      return {
        ...item,
        purchasedDate: purchasedDate.toLocaleDateString(),
        percentage,
      };
    });

    setPercentages(results); // 결과 저장
  };

  // 삭제 핸들
  const handleDelete = (ingrename, index) => {
    swalModal
      .fire({
        title: "항목 삭제",
        text: `${ingrename}를 삭제하시겠습니까?`,
        icon: "warning",
        showCancelButton: true,
        // confirmButtonColor: "#FFBB00",
        // cancelButtonColor: "#828282",
        confirmButtonText: "예",
        cancelButtonText: "아니오",
      })
      .then((result) => {
        if (result.isConfirmed) {
          const updatedUserIngredientData = userIngredientData.map(
            (item, idx) => {
              // index가 일치하는 항목을 찾아서 수정
              if (idx === index) {
                return { ...item, changed: "delete" };
              }
              return item;
            }
          );
          setUserIngredientData(updatedUserIngredientData);
        }
      });
  };

  // 날짜 오름차순
  // const [sortOrder, setSortOrder] = useState("asc"); // 정렬 방향

  // const sortByDate = () => {
  //   const sortedData = [...percentages].sort((a, b) => {
  //     const dateA = new Date(a.expiredDate);
  //     const dateB = new Date(b.expiredDate);
  //     return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  //   });

  //   setPercentages(sortedData);
  //   setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  // };

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

  // 화면 길이 관리
  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  // useEffect(() => {
  //   const handleResize = () => setIsMobile(window.innerWidth <= 767);

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  //----------------------------------------------------------------------------------------

  // 영수증 페이지에서 가져온 코드

  const user = useSelector((state) => state.user.user);
  const [isEditing, setIsEditing] = useState(false);
  // const [receiptData, setReceiptData] = useState(initialReceiptData);

  // 영수증 원본 데이터 저장
  // const [originalData, setOriginalData] = useState(
  //   _.cloneDeep(receiptData) || null
  // );

  // 편집 핸들러
  const handleInputChange = (index, name, value) => {
    const updatedUserIngredientData = userIngredientData.map((item, idx) => {
      // index가 일치하는 항목을 찾아서 수정
      if (idx === index) {
        return { ...item, [name]: value, changed: "modify" };
      }
      return item;
    });
    setUserIngredientData(updatedUserIngredientData);
  };
  // 편집 핸들러 (수량)
  const handleQuantityChange = (index, value) => {
    const numericValue = value
      .replace(/[^0-9.]/g, "")
      .replace(/\.(?=.*\.)/g, "");

    // 값 업데이트
    const updatedUserIngredientData = userIngredientData.map((item, idx) => {
      // index가 일치하는 항목을 찾아서 수정
      if (idx === index) {
        return { ...item, quantity: numericValue, changed: "modify" };
      }
      return item;
    });
    setUserIngredientData(updatedUserIngredientData);
  };
  // 편집 핸들러 (날짜)
  const handleDateChange = (index, name, value) => {
    // 숫자만 추출
    const numericValue = value.replace(/\D/g, "");

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

    // 배열 내 해당 항목을 수정하고 새로운 배열 생성
    const updatedUserIngredientData = userIngredientData.map((item, idx) => {
      if (idx === index) {
        return { ...item, [name]: formattedDate, changed: "modify" };
      }
      return item;
    });
    setUserIngredientData(updatedUserIngredientData);
  };

  // 1줄 추가 핸들러
  const handleAddItem = () => {
    const newItem = {
      uIngreIdx: -1,
      ingreIdx: 0,
      ingreName: "",
      purchaseDate: formatDateToYyyyMmDd(new Date()),
      expiredDate: "",
      quantity: 0,
      totalQuantity: 0,
      rptIdx: "",
      unit: "",
      changed: "create",
    };

    setUserIngredientData([...userIngredientData, newItem]);
  };

  // 편집 버튼
  const handleEditButton = () => {
    // 편집모드로 들어간다.
    setIsEditing(!isEditing);

    if (isEditing) {
      // 편집 모드인 경우
      // 취소 기능
      setUserIngredientData(_.cloneDeep(originalUserIngredientData));
    } else {
      // 편집 모드가 아닌 경우
      // 편집모드로 변경되면서 최상단으로 이동
      // 여긴 아무것도 안적어도 된다
    }
  };

  // 완료 버튼
  const handleOkButton = async () => {
    console.log(userIngredientData);

    if (isEditing) {
      // // 유효성 검사 1: 재료 이름 검사 (빈값 있으면 경고)
      const invalidNames = userIngredientData.filter(
        (item) =>
          (!item?.ingreName || item?.ingreName.trim() === "") &&
          item?.changed !== "delete"
      );

      if (invalidNames.length > 0) {
        // 에러 경고창 띄우기
        swalModal.fire({
          title: "재료 이름 에러",
          text: "재료 이름을 반드시 입력해야 합니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }

      // 유효성 검사 2: 수량 검사 (빈값이 있으면 경고)
      const invalidQuantities = userIngredientData.filter(
        (item) =>
          (!item?.quantity || isNaN(item?.quantity) || item?.quantity <= 0) &&
          item?.changed !== "delete"
      );
      if (invalidQuantities.length > 0) {
        // 에러 경고창 띄우기
        return swalModal.fire({
          title: "수량 에러",
          text: "수량은 반드시 0 이상이어야 합니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }

      // 유효성 검사 3: 단위 검사 (빈값 검사)
      const invalidUnits = userIngredientData.filter(
        (item) =>
          (!item?.unit || item?.unit.trim() === "") &&
          item?.changed !== "delete"
      );
      if (invalidUnits.length > 0) {
        // 에러 경고창 띄우기
        swalModal.fire({
          title: "단위 에러",
          text: "상품의 단위를 반드시 입력해야 합니다. (ex. ml, g, 개 등)",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }

      // 유효성 검사 4: 유통기한 날짜 검사 (날짜가 유효한 형태에 맞는지 검사)
      const invalidPurchasedDates = userIngredientData.filter(
        (item) =>
          (!item?.purchaseDate || !isValidDate(item?.purchaseDate)) &&
          item?.changed !== "delete"
      );
      if (invalidPurchasedDates.length > 0) {
        // 경고창 띄우기
        swalModal.fire({
          title: "구매일 에러",
          text: "구매일 날짜의 형식은 반드시 YYYY-MM-DD 형식이어야 합니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }

      // 유효성 검사 5: 유통기한 날짜 검사 (날짜가 유효한 형태에 맞는지 검사)
      const invalidDates = userIngredientData.filter(
        (item) =>
          (!item?.expiredDate || !isValidDate(item?.expiredDate)) &&
          item?.changed !== "delete"
      );
      if (invalidDates.length > 0) {
        // 경고창 띄우기
        swalModal.fire({
          title: "유통기한 에러",
          text: "유통기한 날짜의 형식은 반드시 YYYY-MM-DD 형식이어야 합니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }

      // TODO : 서버로 새로운 정보를 보내야한다
      try {
        const deletedIngredients = userIngredientData.filter(
          (item) => item.changed === "delete"
        );
        const modifiedIngredients = userIngredientData.filter(
          (item) => item.changed === "modify"
        );
        const createdIngredients = userIngredientData.filter(
          (item) => item.changed === "create"
        );

        const response = await apiAxios.post(
          "/users/ingredients/modification",
          {
            createdIngredients,
          }
        );
        console.log(response);

        // TODO : 한번에 처리하는 라우터 만들어서 보내기
      } catch (err) {
        console.log(err);
      }

      console.log(userIngredientData);

      // // 편집 모드가 아닌 경우
      // // 서버로 데이터 보내서 재료 재고 저장
      // const ingredients = receiptData?.items?.map((item) => {
      //   return {
      //     ingreName: item.ingreName,
      //     ingreIdex: item.ingreIdx,
      //     rptIdx: receiptData?.rptIdx,
      //     quantity: item.quantity,
      //     totalQuantity: item.totalQuantity,
      //     unit: item.unit,
      //     purchaseDate: item.purchaseDate,
      //     expiredDate: item.expiredDate,
      //   };
      // });
      // console.log(ingredients);

      // try {
      //   const res = await apiAxios.post("/users/ingredients", {
      //     ingredients,
      //   });

      //   await swalModal.fire({
      //     title: "재고 수정 성공",
      //     text: "재고 수정이 정상적으로 처리되었습니다.",
      //     icon: "success",
      //     confirmButtonText: "확인",
      //     didClose: () => {
      //       window.scrollTo({
      //         top: 0,
      //         left: 0,
      //         behavior: "instant",
      //       });
      //     },
      //   });

      //   // recipeData 초기화
      //   setReceiptData(null);
      //   setOriginalData(null);

      //   // 나의 재고 페이지로 이동
      //   Navigate("/ingredients");
      // } catch (err) {
      //   console.error(err);

      //   if (err.response) {
      //     const statusCode = err.response.status;
      //     const message = err.response.data?.message || null;

      //     if (statusCode === 404) {
      //       // 재고 이름 오류
      //       const ingreName = err.response.data?.ingreName || null;
      //       if (ingreName) {
      //         return await swalModal.fire({
      //           title: "재고 수정 실패",
      //           text: `${ingreName}은(는) 지원하지 않는 재료입니다.`,
      //           icon: "error",
      //           confirmButtonText: "확인",
      //         });
      //       }
      //     } else if (statusCode === 400) {
      //       if (message === "Invalid date format. Use YYYY-MM-DD") {
      //         return await swalModal.fire({
      //           title: "재고 수정 실패",
      //           text: "입력하신 날짜의 형식이 잘못되었습니다.",
      //           icon: "error",
      //           confirmButtonText: "확인",
      //         });
      //       }
      //     }
      //   }
      //   return await swalModal.fire({
      //     title: "재고 수정 실패",
      //     text: "재고 수정에 실패했습니다. 관리자에게 문의바랍니다.",
      //     icon: "error",
      //     confirmButtonText: "확인",
      //   });
      // }

      // TODO : 에러나면 원래대로 복구

      // 편집 모드 완료
      setIsEditing(!isEditing);

      // 편집 모드 완료 기능
      // console.log("완료되었습니다.");
      setOriginalUserIngredientData(_.cloneDeep(userIngredientData));
      // setOriginalData(_.cloneDeep(receiptData));
    }
  };

  return (
    // 전체 컨테이너
    <div className="ingre-container">
      {/* 재료 관리 */}
      <div className="ingre-my">
        <div className="ingre-button-container">
          <h3>
            {`${user?.userName}님`}의 <span>재료</span> 🥩
          </h3>
          {isEditing && (
            <button
              className="ingre-button ingre-add-button"
              onClick={handleAddItem}
            >
              추가
            </button>
          )}
          <button
            onClick={handleEditButton}
            className={`ingre-button ${
              isEditing ? "ingre-cancel-button" : "ingre-edit-button"
            }`}
          >
            {isEditing ? "취소" : "편집"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="ingre-button"
              onClick={handleOkButton}
            >
              완료
            </button>
          )}
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
                {isEditing && <th className="ingre-delete-th">삭제</th>}
              </tr>
            </thead>

            {/* Body */}
            <tbody className="ingre-table-body">
              {userIngredientData?.map((item, index) => {
                if (item?.changed !== "delete")
                  return (
                    <tr key={index}>
                      <td>
                        {isEditing ? (
                          <input
                            type="text"
                            name="ingreName"
                            value={item?.ingreName}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                e.target.name,
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          item?.ingreName
                        )}
                      </td>

                      <td className="ingre-quantity-td">
                        {isEditing ? (
                          <>
                            <input
                              style={{
                                textAlign: "right",
                                width: "65%",
                                marginRight: "5%",
                              }}
                              type="text"
                              name="quantity"
                              value={item?.quantity}
                              onChange={(e) =>
                                handleQuantityChange(index, e.target.value)
                              }
                            />
                            <input
                              style={{ textAlign: "right", width: "25%" }}
                              type="text"
                              name="unit"
                              value={item?.unit}
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  e.target.name,
                                  e.target.value
                                )
                              }
                            />
                          </>
                        ) : (
                          `${item?.quantity}${item?.unit}`
                        )}
                      </td>

                      <td className="ingre-purchase-td">
                        {isEditing ? (
                          <input
                            style={{ textAlign: "right" }}
                            type="text"
                            name="purchaseDate"
                            value={item?.purchaseDate}
                            onChange={(e) =>
                              handleDateChange(
                                index,
                                e.target.name,
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          item?.purchaseDate
                        )}
                      </td>

                      <td className="ingre-expired-td">
                        {isEditing ? (
                          <input
                            style={{ textAlign: "right" }}
                            type="text"
                            name="expiredDate"
                            value={item?.expiredDate}
                            onChange={(e) =>
                              handleDateChange(
                                index,
                                e.target.name,
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          item?.expiredDate
                        )}
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

                      {isEditing && (
                        <td
                          className="ingre-delete-td"
                          onClick={() => handleDelete(item.ingreName, index)}
                        >
                          <FontAwesomeIcon icon={faDeleteLeft} />
                        </td>
                      )}
                    </tr>
                  );
              })}
            </tbody>
          </table>
          <div className="ingre-mobile-button-wrapper">
            {isEditing && (
              <button
                className="ingre-mobile-button ingre-add-button"
                onClick={handleAddItem}
              >
                추가
              </button>
            )}
            <button
              onClick={handleEditButton}
              className={`ingre-mobile-button ${
                isEditing ? "ingre-cancel-button" : "ingre-edit-button"
              }`}
            >
              {isEditing ? "취소" : "편집"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="ingre-mobile-button"
                onClick={handleOkButton}
              >
                완료
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 최상단 슬라이드 */}
      {!isEditing && (
        <div>
          <h3>
            {`${user?.userName}님`}에게 <span>F</span>
            <span>I</span>
            <span>T</span>한 레시피 👀
          </h3>
          <div className="ingre-recipe">
            <div className="ingre-recipe-list">
              {/* 보유 식재료로 만들 수 있는 레시피 슬라이드 */}
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="ingre-left-button"
              >
                <span>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </span>
              </button>

              <div className="ingre-recipe-list">
                {data.blackRecipes
                  .slice(currentIndex, currentIndex + recipesPerPage)
                  .map((recipe) => (
                    <div className="ingre-recipe-item" key={recipe.rcp_idx}>
                      <img
                        src={recipe.ck_photo_url}
                        alt={recipe.ck_name}
                        className="ingre-recipe-image"
                      />
                      <p className="ingre-recipe-name">{recipe.ck_name}</p>
                    </div>
                  ))}
              </div>

              <button
                onClick={handleNext}
                disabled={
                  currentIndex >= data.blackRecipes.length - recipesPerPage
                }
                className="ingre-right-button"
              >
                <span>
                  <FontAwesomeIcon icon={faChevronRight} />
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ingredients;
