import React, { useRef, useState } from "react";
import "../assets/css/receipt.css";
import { useNavigate } from "react-router-dom";
import swalModal from "../utils/swalModal";
import { apiAxios, generalAxios } from "../utils/axiosUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import _ from "lodash";
import { isValidDate } from "../utils/validation";
import { faDeleteLeft, faSquarePlus } from "@fortawesome/free-solid-svg-icons";

const Receipt = () => {
  const navigate = useNavigate();

  // 유저 정보
  const user = useSelector((state) => state.user.user);

  // 영수증 스캔 데이터
  // const [receiptData, setReceiptData] = useState({
  //   rptIdx: 13,
  //   photoUrl:
  //     "https://ns-sugarguard.s3.ap-northeast-2.amazonaws.com/images/receipt/561e1e3e-a043-42ce-8b04-5eb623bf7191-receipt.jpg",
  //   storeName: "광주농협 하나로클럽 매곡점",
  //   storeAddress: "광주 북구 매곡동 214-19",
  //   storeTel: "062-574-0515",
  //   items: [
  //     {
  //       calories: "2.00",
  //       carbohydrates: "0.26",
  //       expiredDate: "2026-11-02",
  //       fat: "0.04",
  //       fiber: "0.00",
  //       ingreIdx: 109,
  //       ingreName: "홍차",
  //       protein: "0.23",
  //       purchaseDate: "2024-11-02",
  //       quantity: 500,
  //       totalQuantity: 500,
  //       unit: "ml",
  //     },
  //     {
  //       calories: "30.00",
  //       carbohydrates: "10.54",
  //       expiredDate: "2024-11-09",
  //       fat: "0.20",
  //       fiber: "2.80",
  //       ingreIdx: 895,
  //       ingreName: "라임",
  //       protein: "0.70",
  //       purchaseDate: "2024-11-02",
  //       quantity: 500,
  //       totalQuantity: 500,
  //       unit: "ml",
  //     },
  //     {
  //       calories: "67.00",
  //       carbohydrates: "4.86",
  //       expiredDate: "2024-11-09",
  //       fat: "3.85",
  //       fiber: "0.00",
  //       ingreIdx: 148,
  //       ingreName: "우유",
  //       protein: "3.09",
  //       purchaseDate: "2024-11-02",
  //       quantity: 235,
  //       totalQuantity: 235,
  //       unit: "ml",
  //     },
  //     {
  //       calories: "362.00",
  //       carbohydrates: "66.33",
  //       expiredDate: "2026-10-23",
  //       fat: "5.00",
  //       fiber: "25.60",
  //       ingreIdx: 26,
  //       ingreName: "후추",
  //       protein: "12.87",
  //       purchaseDate: "2024-11-02",
  //       quantity: 20,
  //       totalQuantity: 20,
  //       unit: "g",
  //     },
  //     {
  //       calories: "205.00",
  //       carbohydrates: "51.76",
  //       expiredDate: "2025-11-02",
  //       fat: "1.38",
  //       fiber: "5.20",
  //       ingreIdx: 82,
  //       ingreName: "고추장",
  //       protein: "3.66",
  //       purchaseDate: "2024-11-02",
  //       quantity: 1800,
  //       totalQuantity: 1800,
  //       unit: "g",
  //     },
  //   ],
  //   totals: {
  //     totalCalories: 407985,
  //     totalCarbohydrates: 101036.7,
  //     totalFat: 3608.75,
  //     totalFiber: 11272,
  //     totalProtein: 8036.55,
  //   },
  // });
  const [receiptData, setReceiptData] = useState(null);
  
  // 영수증 원본 데이터 저장
  const [originalData, setOriginalData] = useState(
    () => _.cloneDeep(receiptData) || null
  );
  // 영수증 편집 토글
  const [isEditing, setIsEditing] = useState(false);
  // 영수증 이미지 업로드
  const imageInputRef = useRef(null);
  // 영수증 스크롤 타겟
  const targetRef = useRef(null);

  // 영수증 이미지 업로드 작동
  const handleReceiptImageUpload = () => {
    // 로그인 여부 확인
    if (!user) {
      return navigate("/join");
    }

    if (imageInputRef.current) {
      imageInputRef.current.click();
    }
  };
  // 영수증 이미지 업로드
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const fileName = file.name;
      const fileType = file.type;
      // 업로드 요청
      try {
        swalModal.fire({
          title: "영수증 업로드",
          text: "영수증을 업로드 중입니다...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            swalModal.showLoading();
          },
        });

        // presigned URL 요청
        const res = await apiAxios.post("/auth/upload/receipt", {
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

        // 영수증 분석
        swalModal.fire({
          title: "영수증 분석중",
          text: "영수증을 OCR 스캔 중입니다...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            swalModal.showLoading();
          },
        });
        // 서버로 보내서 분석 요청
        const responseReceipt = await apiAxios.post("/receipts", {
          photoUrl: key,
        });

        // 분석 완료 (데이터 넣어주기)
        setReceiptData(responseReceipt.data);
        setOriginalData(_.cloneDeep(responseReceipt.data));

        // 모달 닫기
        swalModal.close();
      } catch (err) {
        console.log(err);
        swalModal.fire({
          title: "영수증 분석 실패",
          text: "영수증 분석에 실패했습니다. 관리자에게 문의바랍니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    }

    // 초기화
    event.target.value = "";
    imageInputRef.current.value = "";
  };

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

  // 1줄 삭제 핸들러
  const handleDeleteItem = (index) => {
    const updatedItems = receiptData.items.filter((_, i) => i !== index);
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

  // 영양정보 확인 버튼
  const handleNutrientButton = () => {};

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

    // 스크롤 이동
    const offset = 30;
    const element = targetRef.current;

    const yPosition =
      element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: yPosition, behavior: "smooth" });
    // targetRef.current.scrollIntoView({ behavior: "smooth" });
  };

  // 완료 버튼
  const handleOkButton = async () => {
    if (isEditing) {
      // 유효성 검사 1: 재료 이름 검사 (빈값 있으면 경고)
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

      // 스크롤 이동
      const offset = 30;
      const element = targetRef.current;
      const yPosition =
        element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });

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
        // console.log(res);

        await swalModal.fire({
          title: "재고 등록 성공",
          text: "재고 등록이 정상적으로 처리되었습니다.",
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
        navigate("/ingredients");
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
                title: "재고 등록 실패",
                text: `${ingreName}은(는) 지원하지 않는 재료입니다.`,
                icon: "error",
                confirmButtonText: "확인",
              });
            }
          } else if (statusCode === 400) {
            if (message === "Invalid date format. Use YYYY-MM-DD") {
              return await swalModal.fire({
                title: "재고 등록 실패",
                text: "입력하신 날짜의 형식이 잘못되었습니다.",
                icon: "error",
                confirmButtonText: "확인",
              });
            }
          }
        }
        return await swalModal.fire({
          title: "재고 등록 실패",
          text: "재고 등록에 실패했습니다. 관리자에게 문의바랍니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    }
  };

  return !receiptData ? (
    <div className="receipt-ocr-wrapper">
      <div className="receipt-ocr-container">
        <div className="receipt-ocr-section">
          <span>영수증 이미지 예시</span>
          <img src="/img/receipt_example.png" alt="receipt example" />
          <p>
            <strong>최대한 바르게 펴진 문서를 기울임 없이,</strong> 사각 영역에
            가득 차도록 인식해 주십시오.
          </p>
          <p>
            접힘, 구겨짐, 빛 반사, 그늘로 인해 글자가 잘 보이지 않으면 정확한
            값을 추출할 수 없습니다.
          </p>
        </div>
        <hr className="receipt-ocr-divide-line" />
        <div
          className="receipt-ocr-upload-section"
          onClick={handleReceiptImageUpload}
        >
          <img src="/img/image_upload.png" alt="image upload" />
          <span>영수증 이미지 업로드</span>
        </div>
      </div>
      <input
        type="file"
        accept="image/*"
        capture="camera"
        className="receipt-input"
        onChange={handleImageUpload}
        ref={imageInputRef}
      />
    </div>
  ) : (
    <div className="receipt-result-container">
      <span className="receipt-result-title">영수증 인식 결과</span>
      <div className="receipt-result-wrapper">
        <div className="receipt-result-section receipt-result-section-receipt">
          <div className="receipt-result-receipt-img">
            <img src={receiptData?.photoUrl} alt="receipt-image" />
          </div>
        </div>
        <div>
          <FontAwesomeIcon
            className="receipt-result-icon"
            icon={faAnglesRight}
          />
        </div>
        <div
          className="receipt-result-section receipt-result-section-result"
          ref={targetRef}
        >
          <div className="receipt-result-div">
            <img src="/img/receipt_logo.png" alt="" />
            <div>
              <span></span>
              <span id="receipt-result-name-span">{`${user?.userName}님`}</span>
            </div>
            <hr />
            <div>
              <span>구매처 :</span>
              <span>{receiptData?.storeName}</span>
            </div>
            <div>
              <span>주소 :</span>
              <span>{receiptData?.storeAddress}</span>
            </div>
            <div>
              <span>전화번호 :</span>
              <span>{receiptData?.storeTel}</span>
            </div>
            <div>
              <span>구매일 :</span>
              <span>{receiptData?.items[0]?.purchaseDate}</span>
            </div>
            <hr />
            <table
              style={{
                width: "100%",
                tableLayout: "fixed",
                borderCollapse: "collapse",
              }}
            >
              <tbody>
                <tr>
                  <th className={!isEditing ? "col58" : "col55"}>상품명</th>
                  <th className={!isEditing ? "col15" : "col15"}>수량</th>
                  <th className={!isEditing ? "col27" : "col25"}>유통기한</th>
                  {isEditing && <th className="col8">삭제</th>}
                </tr>
                {receiptData?.items?.map((item, index) => (
                  <tr key={index}>
                    <td className={!isEditing ? "col58" : "col55"}>
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
                    <td className={!isEditing ? "col15" : "col15"}>
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
                    <td className={!isEditing ? "col27" : "col25"}>
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
                    {isEditing && (
                      <td className="col8">
                        <FontAwesomeIcon
                          className="receipt-result-delete-icon"
                          onClick={() => {
                            handleDeleteItem(index);
                          }}
                          icon={faDeleteLeft}
                        />
                      </td>
                    )}
                  </tr>
                ))}
                {isEditing && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      <FontAwesomeIcon
                        className="receipt-result-plus-icon"
                        onClick={handleAddItem}
                        icon={faSquarePlus}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <hr />
            <div>
              <span></span>
              <span className="#receipt-result-name-span">
                총 구매 품목: {receiptData?.items?.length}
              </span>
            </div>
            <hr />
            <div className="receipt-result-receipt-center-div">
              <span>
                정상적으로 인식되지 않은 품목의 경우에는
                <br />
                편집 버튼을 통해 수정이 가능합니다.
              </span>
              <img src="/img/barcode.png" alt="barcode" />
              <span style={{ fontSize: "1.3em" }}>* * * reciFIT * * *</span>
              {/* <span>* * * * * * * * 감 사 합 니 다 * * * * * * * *</span> */}
            </div>
          </div>
          <div className="receipt-result-button-wrapper">
            {!isEditing && (
              <button
                type="button"
                className="receipt-result-button receipt-result-nutrient-button"
                onClick={handleNutrientButton}
              >
                영양정보 확인
              </button>
            )}
            <button
              type="button"
              className={
                !isEditing
                  ? "receipt-result-button receipt-result-edit-button"
                  : "receipt-result-button receipt-result-cancel-button"
              }
              onClick={handleEditButton}
            >
              {!isEditing ? "편집" : "취소"}
            </button>
            <button
              type="button"
              className="receipt-result-button receipt-result-ok-button"
              onClick={handleOkButton}
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Receipt;
