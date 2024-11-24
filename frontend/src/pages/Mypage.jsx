import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { apiAxios } from "../utils/axiosUtils";
import "../assets/css/mypage.css";
import swalModal from "../utils/swalModal";
import _ from "lodash";
import {
  formatDateToYyyyMmDd,
  formatDateToString,
  formatDateToKorMonth,
  receiptFormatDate,
} from "../utils/commonUtils";
import FavoriteContent from "../components/FavoriteContent";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";
import { useSelector } from "react-redux";

const Mypage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user.user);
  const stableNavigate = useCallback((path) => navigate(path), [navigate]);

  // 모바일
  const [isMobile, setIsMobile] = useState(false);

  // 탭
  const [tab, setTab] = useState("user");
  // 유저 정보
  const [userData, setUserData] = useState(null);
  const [userOriginalData, setUserOriginalData] = useState(null);
  // 즐겨찾기 정보
  const [favoriteData, setFavoriteData] = useState(null);
  // 환경점수 정보
  const [envScoreData, setEnvScoreData] = useState(null);
  // 영수증 정보
  const [receiptData, setReceiptData] = useState(null);

  // Chart.js 모듈 등록
  ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

  // 탭 이동
  const handleTabButton = (e) => {
    // setTab(e.target.name);
    navigate(`/mypage?tab=${e.target.name}`);
  };

  // 모바일 확인 hook
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = (e) => setIsMobile(e.matches);

    mediaQuery.addEventListener("change", handleChange);
    handleChange(mediaQuery);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  // 정보 받아오기 (나머지도)
  useEffect(() => {
    // 유저 정보 받아오기
    const fetchUserData = async () => {
      try {
        const response = await apiAxios.get("/users");
        setUserData(response.data);
        setUserOriginalData(() => _.cloneDeep(response.data));

        console.log(response);
      } catch (err) {
        // console.log(err);
        // await swalModal.fire({
        //   title: "회원 정보 가져오기 실패",
        //   text: "회원 정보를 가져오는데 실패했습니다. 관리자에게 문의바랍니다.",
        //   icon: "error",
        //   confirmButtonText: "확인",
        // });
        // stableNavigate("/");
      }
    };

    // 즐겨찾기 정보 받아오기
    const fetchFavoriteData = async () => {
      try {
        const response = await apiAxios.get("/favorite");
        setFavoriteData(response.data?.recipes);
      } catch (err) {
        // console.log(err);
        // await swalModal.fire({
        //   title: "즐겨찾기 정보 가져오기 실패",
        //   text: "즐겨찾기 정보를 가져오는데 실패했습니다. 관리자에게 문의바랍니다.",
        //   icon: "error",
        //   confirmButtonText: "확인",
        // });
        // stableNavigate("/");
      }
    };

    // 환경점수 받아오기
    const fetchEnviornmentData = async () => {
      const response = await apiAxios.get("/environment-score");
      setEnvScoreData(response.data);
      console.log(response.data);
      try {
      } catch (err) {
        // await swalModal.fire({
        //   title: "환경점수 가져오기 실패",
        //   text: "환경점수를 가져오는데 실패했습니다. 관리자에게 문의바랍니다.",
        //   icon: "error",
        //   confirmButtonText: "확인",
        // });
        // stableNavigate("/");
      }
    };

    // 영수증 내역 받아오기
    const fetchReceiptData = async () => {
      try {
        const response = await apiAxios.get("/receipts");
        setReceiptData(response.data);
        console.log(response.data);
      } catch (err) {
        // await swalModal.fire({
        //   title: "영수증 분석 내역 가져오기 실패",
        //   text: "영수증 분석 내역를 가져오는데 실패했습니다. 관리자에게 문의바랍니다.",
        //   icon: "error",
        //   confirmButtonText: "확인",
        // });
        // stableNavigate("/");
      }
    };

    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchUserData(),
          fetchFavoriteData(),
          fetchEnviornmentData(),
          fetchReceiptData(),
        ]);
      } catch (err) {
        // console.error("데이터 가져오기 실패", err);
        await swalModal.fire({
          title: "회원 정보 가져오기 실패",
          text: "회원 정보를 가져오는데 실패했습니다. 관리자에게 문의바랍니다.",
          icon: "error",
          confirmButtonText: "확인",
        });
      }
    };

    if (isMobile) {
      fetchAllData();
    } else if (tab === "user") {
      fetchUserData();
    } else if (tab === "recipe") {
      fetchFavoriteData();
    } else if (tab === "env-score") {
      fetchEnviornmentData();
    } else if (tab === "receipt") {
      fetchReceiptData();
    }
  }, [tab, isMobile, stableNavigate]);

  // 유저 정보 수정하기
  const handleModifyUserData = async () => {
    swalModal
      .fire({
        title: "회원 정보 수정",
        text: "회원 정보를 수정하시겠습니까?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "예",
        cancelButtonText: "아니오",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            console.log(userData);

            const {
              nickname,
              preferredIngredients,
              dislikedIngredients,
              nonConsumableIngredients,
            } = userData;
            const res = await apiAxios.patch("/users", {
              nickname,
              preferredIngredients,
              dislikedIngredients,
              nonConsumableIngredients,
            });

            if (res.status === 200) {
              await swalModal.fire({
                title: "음식 재료 차감 성공",
                html: `보유하신 음식 재료가 정상적으로 차감되었습니다<br>즐거운 식사 시간 보내세요~`,
                icon: "success",
                confirmButtonText: "확인",
              });
            } else {
              throw new Error();
            }
          } catch (err) {
            await swalModal.fire({
              title: "회원 정보",
              text: `회원 정보 수정에 실패했습니다. 관리자에게 문의바랍니다.`,
              icon: "error",
              confirmButtonText: "확인",
            });
          }
        } else {
          // console.log("아니오");
        }
      });
  };

  // 유저 정보 수정 취소
  const handleCancelUserData = () => {
    // userData 덮어씌우기
    setUserData(() => _.cloneDeep(userOriginalData));

    swalModal.fire({
      title: "회원 정보 수정 취소",
      text: `회원 정보 수정을 취소했습니다.`,
      icon: "warning",
      confirmButtonText: "확인",
    });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");

    if (
      tab === "user" ||
      tab === "recipe" ||
      tab === "env-score" ||
      tab === "receipt"
    ) {
      setTab(tab);
    } else {
      setTab("user");
    }
  }, [location]);

  if (!user) {
    return <Navigate to="/join" replace />;
  }
  return (
    <>
      <div className="my-page-container">
        <div className="my-page-title">마이페이지</div>
        <div className="my-page-tabbar">
          <button
            className={`my-page-tab-button ${
              tab === "user" ? "my-page-tab-button-selected" : ""
            }`}
            name="user"
            onClick={handleTabButton}
          >
            회원 정보
          </button>
          <button
            className={`my-page-tab-button ${
              tab === "recipe" ? "my-page-tab-button-selected" : ""
            }`}
            name="recipe"
            onClick={handleTabButton}
          >
            레시피 즐겨찾기
          </button>
          <button
            className={`my-page-tab-button ${
              tab === "env-score" ? "my-page-tab-button-selected" : ""
            }`}
            name="env-score"
            onClick={handleTabButton}
          >
            환경점수
          </button>
          <button
            className={`my-page-tab-button ${
              tab === "receipt" ? "my-page-tab-button-selected" : ""
            }`}
            name="receipt"
            onClick={handleTabButton}
          >
            영수증 분석 내역
          </button>
        </div>
        {/* 회원 정보 */}
        {(tab === "user" || isMobile) && userData && (
          <div className="my-page-section-container">
            <div className="my-page-section-title">
              <span>회원 정보</span>
            </div>
            <div className="my-page-user-info-content">
              <table className="my-page-user-info-table">
                <tbody>
                  <tr>
                    <td>연결된 계정</td>
                    <td>{userData?.oauthEmail}</td>
                  </tr>
                  <tr>
                    <td>소셜 로그인</td>
                    <td>{userData?.oauthProvider}</td>
                  </tr>
                  <tr>
                    <td>닉네임</td>
                    <td>
                      <input
                        type="text"
                        value={userData?.nickname}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            nickname: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>가입일</td>
                    <td>{formatDateToString(userData?.createdAt)}</td>
                  </tr>
                </tbody>
              </table>
              <table className="my-page-user-info-table">
                <tbody>
                  <tr>
                    <td>최종 로그인</td>
                    <td>{formatDateToString(userData?.lastLogin)}</td>
                  </tr>
                  <tr>
                    <td>선호 재료</td>
                    <td>
                      <input
                        type="text"
                        value={userData?.preferredIngredients}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            preferredIngredients: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>기피 재료</td>
                    <td>
                      <input
                        type="text"
                        value={userData?.dislikedIngredients}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            dislikedIngredients: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>섭취 불가 재료</td>
                    <td>
                      <input
                        type="text"
                        value={userData?.nonConsumableIngredients}
                        onChange={(e) =>
                          setUserData((prev) => ({
                            ...prev,
                            nonConsumableIngredients: e.target.value,
                          }))
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="my-page-button-wrapper">
              <button className="my-page-button" onClick={handleCancelUserData}>
                취소하기
              </button>
              <button
                className="my-page-button my-page-button-ok"
                onClick={handleModifyUserData}
              >
                수정하기
              </button>
            </div>
          </div>
        )}

        <hr className="my-page-divided-line" />

        {/* 레시피 즐겨찾기 */}
        {(tab === "recipe" || isMobile) && favoriteData && (
          <div className="my-page-section-container">
            <div className="my-page-section-title">
              <span>레시피 즐겨찾기</span>
            </div>
            <div className="my-page-favorite-content">
              {favoriteData?.map((item) => (
                <FavoriteContent key={item?.rcpIdx} item={item} />
              ))}
            </div>
          </div>
        )}

        <hr className="my-page-divided-line" />

        {/* 환경점수 */}
        {console.log(envScoreData)}
        {(tab === "env-score" || isMobile) && envScoreData && (
          <div className="my-page-section-container">
            <div className="my-page-section-title">
              <span>환경 점수</span>
            </div>
            <div className="my-page-env-score-content">
              <div className="my-page-env-score-wrapper">
                <div className="my-page-env-score-graph">
                  <Doughnut
                    data={{
                      labels: ["환경 점수", "차감된 점수"],
                      datasets: [
                        {
                          data: [
                            envScoreData?.envScore,
                            100 - envScoreData?.envScore,
                          ],
                          backgroundColor: ["#007bff", "#ecf0f1"],
                          borderWidth: 0,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                        tooltip: {
                          enabled: false,
                        },
                      },
                      rotation: -90,
                      circumference: 180,
                      cutout: "80%",
                      maintainAspectRatio: true,
                      responsive: false,
                    }}
                  />
                  <div className="my-page-env-score-score">
                    {envScoreData?.envScore}점
                  </div>
                </div>
                <div className="my-page-env-score-month">
                  {formatDateToKorMonth(envScoreData?.monthYear)}
                </div>
              </div>
              <div className="my-page-section-title">환경 점수 차감 내역</div>
              <div className="my-page-env-score-table-content">
                <table>
                  <thead>
                    <tr>
                      <th>폐기 식재료</th>
                      <th>폐기 수량</th>
                      <th>유통기한 마감일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {envScoreData?.decrementLogs?.map((row, index) => (
                      <tr key={index}>
                        <td>{row?.ingredient?.ingreName}</td>
                        <td>
                          {`${row?.ingredient?.quantity} ${row?.ingredient?.unit}`}
                        </td>
                        <td>
                          {formatDateToYyyyMmDd(row?.ingredient?.expiredDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <hr className="my-page-divided-line" />

        {/* 영수증 분석 내역 */}
        {(tab === "receipt" || isMobile) && (
          <div className="my-page-section-container">
            <div className="my-page-section-title">
              <span>영수증 분석 내역</span>
            </div>
            <div className="my-page-receipt-content">
              <table>
                <thead>
                  <tr>
                    <th>영수증{isMobile ? <br /> : " "}이미지</th>
                    <th>구매 매장</th>
                    <th>구매일</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData?.map((item) => (
                    <tr key={item?.rptIdx}>
                      <td>
                        <img src={item?.rptPhotoUrl} alt="receipt-image" />
                      </td>
                      <td>
                        {`${
                          item?.recognizedText?.images[0]?.receipt?.result
                            ?.storeInfo?.name?.text ?? ""
                        } ${
                          item?.recognizedText?.images[0]?.receipt?.result
                            ?.storeInfo?.subName?.text ?? ""
                        }`}
                      </td>
                      <td>
                        {receiptFormatDate(
                          item?.recognizedText?.images[0]?.receipt?.result
                            ?.paymentInfo?.date?.text
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Mypage;
