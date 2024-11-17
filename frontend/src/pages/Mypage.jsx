import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios'; // axios import
import "../assets/css/mypage.css";

const Mypage = () => {
    const [userData, setUserData] = useState({
        nickname: "",
        status: "활성",
        role: "",
        createdAt: "2023-01-01", // 문자열로 설정
        updatedAt: "2023-10-01", // 문자열로 설정
        lastLogin: "2023-11-01", // 문자열로 설정
    });
    const dummyData = {
        envScore: userData.envScore,
        remainingScore: 100 - userData.envScore,
    };
    const [recipes, setRecipes] = useState([ 
        { favIdx: 1, name: "감자조림", createdAt: new Date(), cookedYn: "Y" },
        { favIdx: 2, name: "불고기", createdAt: new Date(), cookedYn: "N" }
    ]);
    const [receipts, setReceipts] = useState([ 
        {
            rptIdx: 1,
            rptPhotoUrl: "https://help.jobis.co/hc/article_attachments/115014257148/c.PNG", 
            totalCalories: 350,
            totalFat: 10,
            totalProtein: 5,
            totalCarbonhydrates: 45,
            totalFiber: 8,
            createdAt: new Date(),
        },
        {
            rptIdx: 2,
            rptPhotoUrl: "https://help.jobis.co/hc/article_attachments/115014257148/c.PNG", 
            totalCalories: 350,
            totalFat: 13,
            totalProtein: 6,
            totalCarbonhydrates: 55,
            totalFiber: 9,
            createdAt: new Date(),
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    const userIdx = 1; // 요청할 사용자 ID (예시)

    const infoSectionRef = useRef(null);
    const statsSectionRef = useRef(null);
    const recipesRef = useRef(null);
    const receiptsRef = useRef(null);

    // 사용자 정보 가져오기
    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`/api/users/${userIdx}`);
            setUserData(response.data);
        } catch (error) {
            console.error("사용자 정보를 가져오는 데 실패했습니다.", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 레시피 및 영수증 데이터 가져오기
    const fetchRecipesAndReceipts = async () => {
        // 데이터를 가져오는 로직 (주석 처리된 상태)
    };

    // 사용자 정보 저장
    const handleSave = async () => {
        try {
            await axios.put(`/api/users/${userIdx}`, userData);
            alert("사용자 정보가 저장되었습니다.");
        } catch (error) {
            console.error("사용자 정보를 저장하는 데 실패했습니다.", error);
            alert("사용자 정보 저장에 실패했습니다.");
        }
    };

    // 컴포넌트 마운트 시 데이터 가져오기
    useEffect(() => {
        fetchUserData();
        fetchRecipesAndReceipts();
    }, []);

    // 사용자 정보 수정 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const envScore = userData.envScore || 80; // 환경 점수
    const radius = 60; // 원 반지름을 60으로 줄여서 높이를 줄임
    const circumference = Math.PI * radius; // 반원의 둘레
    const scorePercentage = envScore / 100; // 점수 비율
    const scoreStroke = circumference * scorePercentage; // 점수에 해당하는 stroke 길이
    const remainingStroke = circumference - scoreStroke; // 남은 영역 stroke 길이

    return (
        <div className="mypage">
            <header className="my-header">
                <h2 className="shared-title-h2">마이 페이지</h2>
            </header>
            {isLoading ? <p>로딩 중...</p> : (
                <>
               <section ref={infoSectionRef} className="info-section">
                <h3 className="shared-title1">회원정보 수정</h3>
                <table className="info-table">
                    <tbody>
                        <tr>
                            <td>닉네임:</td>
                            <td>
                                <input 
                                    type="text" 
                                    name="nickname" 
                                    value={userData.nickname || '찬란한 맛집'} 
                                    onChange={handleChange} 
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>회원 상태:</td>
                            <td>
                                <span>{userData.status || '활성'}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>회원 역할:</td>
                            <td>
                                <span>{userData.role || '일반 회원'}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>회원 생성일:</td>
                            <td>{new Date(userData.createdAt)?.toLocaleDateString() || '2024-11-01'}</td>
                        </tr>
                        <tr>
                            <td>회원 수정일:</td>
                            <td>{new Date(userData.updatedAt)?.toLocaleDateString() || '2024-11-02'}</td>
                        </tr>
                        <tr>
                            <td>최종 로그인 일자:</td>
                            <td>{new Date(userData.lastLogin)?.toLocaleDateString() || '2024-11-03'}</td>
                        </tr>
                    </tbody>
                </table>
                </section>

<hr style={{ margin: '20px 0', height: '2px', backgroundColor: '#f4b057', border: 'none' }} />

                {/* 추가 정보 입력/수정 */}
                <section className="additional-section">
            <div className="info-card">
                <h3 className="shared-title1">추가 정보 입력/수정</h3>
                <p>
                    선호 식재료:
                    <input
                        type="text"
                        name="preferredIngredients"
                        value={userData.preferredIngredients || '닭가슴살'}
                        onChange={handleChange}
                    />
                </p>
                <p>
                    기피 식재료:
                    <input
                        type="text"
                        name="dislikedIngredients"
                        value={userData.dislikedIngredients || '홍어'}
                        onChange={handleChange}
                    />
                </p>
                <p>
                    섭취불가(알러지) 식재료:
                    <input
                        type="text"
                        name="nonConsumableIngredients"
                        value={userData.nonConsumableIngredients || '복숭아'}
                        onChange={handleChange}
                    />
                </p>
            </div>
        </section>

                <hr style={{ margin: '20px 0', height: '2px', backgroundColor: '#f4b057', border: 'none' }} />

                {/* 레시피 조회 */}
                <section ref={recipesRef} className="recipes-section">
                    <h3 className="shared-title1">나의 레시피 조회</h3>
                    {recipes.length > 0 ? (
                        <table className="recipes-table">
                            <thead>
                                <tr>
                                    <th>레시피 이름</th>
                                    <th>레시피 생성일</th>
                                    <th>요리 여부</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recipes.map(recipe => (
                                    <tr key={recipe.favIdx}>
                                        <td>{recipe.name}</td>
                                        <td>{new Date(recipe.createdAt).toLocaleDateString()}</td>
                                        <td>{recipe.cookedYn === 'Y' ? '조리됨' : '조리되지 않음'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>레시피 정보가 없습니다.</p>
                    )}
                </section>

                <hr style={{ margin: '20px 0', height: '2px', backgroundColor: '#f4b057', border: 'none' }} />

                <section
    ref={statsSectionRef}
    className="env-section"
    style={{ maxHeight: '200px', overflowY: 'auto' }}
>
    <div className="env-score-card">
    <h3 className="shared-title1 env-score-title">나의 환경점수</h3>
        <svg
            width="200" // 크기 조정
            height="100" // 반원 높이 설정
            viewBox="0 0 200 100" // 반원에 적합한 viewBox
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* 회색 배경 반원 */}
            <path
                d="M 10 100 A 90 90 0 0 1 190 100"
                fill="none"
                stroke="#E0E0E0"
                strokeWidth="20"
            />
            {/* 환경 점수 반원 */}
            <path
                d="M 10 100 A 90 90 0 0 1 190 100"
                fill="none"
                stroke="#007BFF"
                strokeWidth="20"
                strokeDasharray="283" // 반원의 전체 길이 (대략적으로 계산한 값)
                strokeDashoffset={(283 * (100 - envScore)) / 100} // 점수에 따라 줄어드는 길이
            />
            {/* 중앙 텍스트 */}
            <text
                x="50%"
                y="90%" // 반원의 중심보다 약간 위쪽에 배치
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="25"
                fontWeight="bold"
                fill="black"
            >
                {envScore}점
            </text>
        </svg>
    </div>
</section>

<hr style={{ margin: '20px 0', height: '2px', backgroundColor: '#f4b057', border: 'none' }} />

                {/* 영수증 목록 */}
                <section ref={receiptsRef} className="receipts-section" style={{ maxHeight: '300px', overflowY: 'auto' }}>
    <h3 className="shared-title1">나의 영수증</h3>
    {receipts.length > 0 ? (
        <table className="receipts-table">
            <thead>
                <tr>
                    <th>영수증 이미지</th>
                    <th>칼로리</th>
                    <th>단백질</th>
                    <th>탄수화물</th>
                    <th>지방</th>
                    <th>식이섬유</th>
                </tr>
            </thead>
            <tbody>
                {receipts.map(receipt => (
                    <tr key={receipt.rptIdx}>
                        <td>
                        <img
                            src={receipt.rptPhotoUrl}
                            alt="영수증"
                            className="receipt-thumbnail"
                        />
                        </td>
                        <td>{receipt.totalCalories}</td>
                        <td>{receipt.totalProtein}</td>
                        <td>{receipt.totalCarbonhydrates}</td>
                        <td>{receipt.totalFat}</td>
                        <td>{receipt.totalFiber}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <p>영수증 정보가 없습니다.</p>
    )}
</section>

                </>
            )}
        </div>
    );
};

export default Mypage;
