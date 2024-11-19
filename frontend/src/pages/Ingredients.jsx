import React, { useEffect, useRef, useState } from 'react'
import '../assets/css/ingredients.css';
import data from '../data/recipesData';
import initialReceiptData from '../json/receiptData.json';
import swalModal from "../utils/swalModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faCircle } from "@fortawesome/free-solid-svg-icons";
import { isValidDate } from "../utils/validation";
import { Navigate } from 'react-router-dom';
import { apiAxios } from '../utils/axiosUtils';
import _ from "lodash";





const Ingredients = () => {
  // 하단 슬라이드 -------------------------------------------------
  const [currentIndex, setCurrentIndex] = useState(0);
  const recipesPerPage = 4; // 1열로 보여줄 항목의 수

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
      return { ...item, percentage }; // 기존 데이터에 퍼센티지 추가      
    });

    setPercentages(results); // 결과 저장
  };

  // 삭제 핸들
  const handleDelete = (ingrename) => {
    swalModal.fire({
      title: "항목 삭제",
      text: "삭제하시겠습니까?",
      icon: "warning",
      showCancelButton: true, // cancel 버튼 표시
      confirmButtonColor: '#FFBB00', // confirm 버튼 색깔
      cancelButtonColor: '#828282', // cancel 버튼 색깔
      confirmButtonText: '승인', // confirm 버튼 텍스트
      cancelButtonText: '취소', // cancel 버튼 텍스트
    }).then((result) => {
      if (result.isConfirmed) {
        // 승인 버튼을 눌렀을 때만 삭제 실행
        setPercentages(percentages.filter((item) => item.ingreName !== ingrename));
        swalModal.fire('삭제되었습니다.', '', 'success');
      }
    });
  };

  // 날짜 오름차순
  const [sortOrder, setSortOrder] = useState("asc"); // 정렬 방향

  const sortByDate = () => {
    const sortedData = [...percentages].sort((a, b) => {
      const dateA = new Date(a.expiredDate);
      const dateB = new Date(b.expiredDate);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setPercentages(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // 상태 아이콘
  const getStatusIcon = (percentage) => {
    if (percentage >= 50) {
      return <FontAwesomeIcon icon={faCircle} style={{ color: '#06FF00' }} />; // 50 이상이면 초록색
    } else if (percentage >= 20) {
      return <FontAwesomeIcon icon={faCircle} style={{ color: '#FFE400' }} />; // 20 이상 50 미만이면 노란색
    } else {
      return <FontAwesomeIcon icon={faCircle} style={{ color: '#FF1700' }} />; // 20 미만이면 빨간색
    }
  };

  //----------------------------------------------------------------------------------------

  // 영수증 페이지에서 가져온 코드

  const [isEditing, setIsEditing] = useState(false);
  const [receiptData, setReceiptData] = useState(initialReceiptData)

  // 영수증 원본 데이터 저장
  const [originalData, setOriginalData] = useState(
    () => _.cloneDeep(receiptData) || null
  );

  // 편집 핸들러
  const handleInputChange = (index, name, value) => {
    const updatedItems = [...receiptData.items];
    updatedItems[index][name] = value;
    setReceiptData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // 편집 핸들러 (수량)
  const handleQuantityChange = (index, value) => {
    // 숫자만 허용
    const numericValue = value.replace(/\D/g, ""); // 숫자가 아닌 값 제거

    // 값 업데이트
    const updatedItems = [...receiptData.items];
    updatedItems[index].quantity = numericValue;
    setReceiptData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // 편집 핸들러 (날짜)
  const handleDateChange = (index, value) => {
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

    // 값 업데이트
    const updatedItems = [...receiptData.items];
    updatedItems[index].expiredDate = formattedDate;
    setReceiptData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };
  
    // 1줄 추가 핸들러
    const handleAddItem = () => {
      const newItem = {
        calories: "",
        carbohydrates: "",
        expiredDate: "",
        fat: "",
        fiber: "",
        ingreIdx: null,
        ingreName: "",
        protein: "",
        purchaseDate: "",
        quantity: "",
        totalQuantity: "",
        unit: "",
      };
  
      const updatedItems = [...receiptData.items, newItem];
      setReceiptData((prev) => ({
        ...prev,
        items: updatedItems,
      }));
    };
  
  // 편집 버튼
  const handleEditButton = () => {
    // 편집모드로 들어간다.
    setIsEditing(!isEditing);

    if (isEditing) {
      // 편집 모드인 경우
      // 취소 기능
      console.log("취소되었습니다.");
      setReceiptData(_.cloneDeep(originalData));
    } else {
      // 편집 모드가 아닌 경우
      // 편집모드로 변경되면서 최상단으로 이동
      // 여긴 아무것도 안적어도 된다
    }
  };

  // 완료 버튼
  const handleOkButton = async () => {
    if (isEditing) {
      // // 유효성 검사 1: 재료 이름 검사 (빈값 있으면 경고)
      const invalidNames = receiptData.items.filter(
        (item) => !item.ingreName || item.ingreName.trim() === ""
      );
      console.log(invalidNames);

      if (invalidNames.length > 0) {
        // 에러 경고창 띄우기
        swalModal.fire({
          title: "상품명 에러",
          text: "상품 이름을 반드시 입력해야 합니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }

      // 유효성 검사 2: 수량 검사 (빈값이 있으면 경고)
      const invalidQuantities = receiptData.items.filter(
        (item) => !item.quantity || isNaN(item.quantity) || item.quantity <= 0
      );
      if (invalidQuantities.length > 0) {
        // 에러 경고창 띄우기
        swalModal.fire({
          title: "수량 에러",
          text: "수량은 반드시 0 이상이어야 합니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
        return;
      }

      // 유효성 검사 3: 단위 검사 (빈값 검사)
      const invalidUnits = receiptData.items.filter(
        (item) => !item.unit || item.unit.trim() === ""
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
      const invalidDates = receiptData.items.filter(
        (item) => !item.expiredDate || !isValidDate(item.expiredDate)
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

      // 편집 모드 완료
      setIsEditing(!isEditing);

      // 편집 모드 완료 기능
      console.log("완료되었습니다.");
      setOriginalData(_.cloneDeep(receiptData));
    } else {
      console.log("??");
      // 편집 모드가 아닌 경우
      // TODO : 서버로 데이터 보내서 재료 재고 저장
      const ingredients = receiptData?.items?.map((item) => {
        return {
          ingreName: item.ingreName,
          ingreIdex: item.ingreIdx,
          rptIdx: receiptData?.rptIdx,
          quantity: item.quantity,
          totalQuantity: item.totalQuantity,
          unit: item.unit,
          purchaseDate: item.purchaseDate,
          expiredDate: item.expiredDate,
        };
      });
      console.log(ingredients);

      try {
        const res = await apiAxios.post("/users/ingredients", {
          ingredients,
        });

        await swalModal.fire({
          title: "재고 수정 성공",
          text: "재고 수정이 정상적으로 처리되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
          didClose: () => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "instant",
            });
          },
        });

        // recipeData 초기화
        setReceiptData(null);
        setOriginalData(null);

        // 나의 재고 페이지로 이동
        Navigate("/ingredients");
      } catch (err) {
        console.error(err);

        if (err.response) {
          const statusCode = err.response.status;
          const message = err.response.data?.message || null;

          if (statusCode === 404) {
            // 재고 이름 오류
            const ingreName = err.response.data?.ingreName || null;
            if (ingreName) {
              return await swalModal.fire({
                title: "재고 수정 실패",
                text: `${ingreName}은(는) 지원하지 않는 재료입니다.`,
                icon: "error",
                confirmButtonText: "확인",
              });
            }
          } else if (statusCode === 400) {
            if (message === "Invalid date format. Use YYYY-MM-DD") {
              return await swalModal.fire({
                title: "재고 수정 실패",
                text: "입력하신 날짜의 형식이 잘못되었습니다.",
                icon: "error",
                confirmButtonText: "확인",
              });
            }
          }
        }
        return await swalModal.fire({
          title: "재고 수정 실패",
          text: "재고 수정에 실패했습니다. 관리자에게 문의바랍니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    }
  };

  console.log(receiptData);  
  console.log(receiptData.items);
  

  return (

    // 전체 컨테이너
    <div className='ingre-container'>

      {/* 재료 관리 */}
      <div className='ingre-my'>

        <div className='ingre-button-container'>
          <h3> [닉네임]님의 <span>재료</span> 🥩 </h3>
          <button onClick={handleEditButton} className='ingre-button'>
            {isEditing ? '취소' : '편집'}
          </button>
          {isEditing && (
    <button
      type="button"
      className="ingre-result-ok-button"
      onClick={handleOkButton}
    >
      완료
    </button>
  )}
        </div>

        {/* 재료 리스트 */}
        <div className='ingre-my-list'>
          <table className='ingre-table' cellSpacing={"0"}>

            {/* Head */}
            <thead className='ingre-table-head'>
              <tr>
                <th style={{ width: "15%" }}>상품명</th>
                <th style={{ width: "10%" }}>수량</th>
                <th style={{ width: "15%" }}>구매일</th>
                <th style={{ width: "15%", cursor: "pointer" }} onClick={sortByDate}>
                  유통기한 {sortOrder === "asc" ? "▲" : "▼"}
                </th>
                <th>상태</th>
                <th style={{ width: "5%" }}></th>
                <th style={{ width: "10%" }}>삭제</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className='ingre-table-body'>

              {percentages.map((item, index) => (
                <tr key={index}>
                  <td>{isEditing ? (
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

                  <td>
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

                  <td>
                  {isEditing ? (
                        <input
                          style={{ textAlign: "right" }}
                          type="text"
                          name="expiredDate"
                          value={item?.purchaseDate}
                          onChange={(e) =>
                            handleDateChange(index, e.target.value)
                          }
                        />
                      ) : (
                        item?.purchaseDate
                      )}
                  </td>

                  <td>
                  {isEditing ? (
                        <input
                          style={{ textAlign: "right" }}
                          type="text"
                          name="expiredDate"
                          value={item?.expiredDate}
                          onChange={(e) =>
                            handleDateChange(index, e.target.value)
                          }
                        />
                      ) : (
                        item?.expiredDate
                      )}
                  </td>

                  <td className='ingre-status-td'>
                    <div className='ingre-per-background'>
                      <div className='ingre-per-bar' style={{ width: `${item.percentage}%` }}></div>
                    </div>
                  </td>

                  <td>
                    <div className='ingre-per-status'>
                      {getStatusIcon(item.percentage)} {String(item.percentage).padStart(2, '0')}%
                    </div>
                  </td>

                  <td onClick={() => handleDelete(item.ingreName)}
                    className="ingre-delete">
                    <FontAwesomeIcon
                      icon={faDeleteLeft}
                    />
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* 최상단 슬라이드 */}
      {!isEditing && (
        <div>
          <h3>이건 어때요? [닉네임]님에게 <span>F</span><span>I</span><span>T</span>한 레시피 👀</h3>
          <div className='ingre-recipe'>
            <div className='ingre-recipe-list'>
              {/* 보유 식재료로 만들 수 있는 레시피 슬라이드 */}
              <button onClick={handlePrevious} disabled={currentIndex === 0} className='ingre-left-button'>
                {"<"}
              </button>

              <div className="ingre-recipe-list">
                {data.blackRecipes
                  .slice(currentIndex, currentIndex + recipesPerPage)
                  .map((recipe) => (
                    <div className="ingre-recipe-item" key={recipe.rcp_idx}>
                      <img src={recipe.ck_photo_url} alt={recipe.ck_name} className="ingre-recipe-image" />
                      <p className="ingre-recipe-name">{recipe.ck_name}</p>
                    </div>
                  ))}
              </div>

              <button onClick={handleNext} disabled={currentIndex >= data.blackRecipes.length - recipesPerPage} className='ingre-right-button'>
                {">"}
              </button>

            </div>
          </div>
        </div>
      )}


    </div>


  )
}


export default Ingredients