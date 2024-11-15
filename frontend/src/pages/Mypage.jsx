import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios'; // axios import
import "../assets/css/mypage.css";
//import { Doughnut } from 'react-chartjs-2'; // Doughnut 차트 import



const Mypage = () => {
    const [userData, 
        setUserData
    ] = useState
    ({
        nickname: "찬란한 맛집",
        status: "활성",
        role: "일반 사용자",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
        envScore: 75, // 환경 점수
        preferredIngredients: "감자, 당근",
        dislikedIngredients: "양파",
        nonConsumableIngredients: "땅콩",
    });
    const dummyData = {
        envScore: userData.envScore,
        remainingScore: 100 - userData.envScore,
    };
    const [recipes, setRecipes] = useState([
        {
            favIdx: 1,
            name: "감자조림",
            createdAt: new Date(),
            cookedYn: "Y",
        },
        {
            favIdx: 2,
            name: "불고기",
            createdAt: new Date(),
            cookedYn: "N",
        },
    ]);
    const [receipts, setReceipts] = useState([{
        rptIdx: 1,
        rptPhotoUrl: "https://help.jobis.co/hc/article_attachments/115014257148/c.PNG", // 이미지 URL 변경
        totalCalories: 350,
        totalFat: 10, // 예시 데이터
        totalProtein: 5, // 예시 데이터
        totalCarbonhydrates: 45, // 예시 데이터
        totalFiber: 8, // 예시 데이터
        createdAt: new Date(),
    },]);
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
        // setIsLoading(true);
        // try {
        //     const [recipesResponse, receiptsResponse] = await Promise.all([
        //         axios.get(`/api/recipes/${userIdx}`),
        //         axios.get(`/api/receipts/${userIdx}`)
        //     ]);
        //     // setRecipes(recipesResponse.data);
        //     // setReceipts(receiptsResponse.data);
        // } catch (error) {
        //     console.error("레시피 및 영수증 데이터를 가져오는 데 실패했습니다.", error);
        // } finally {
        //     setIsLoading(false);
        // }
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
    const envScore = userData.envScore; // 환경 점수
    const radius = 90; // 원 반지름
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
                {/* 회원 정보 수정 */}
                <section ref={infoSectionRef} className="info-section">
                    <h3 className="shared-title1">회원정보 수정</h3>
                    <p>닉네임:
                        <input type="text" name="nickname" value={userData.nickname || ''} onChange={handleChange} />
                    </p>
                    <p>회원 상태: <span>{userData.status || '없음'}</span></p>
                    <p>회원 역할: <span>{userData.role || '없음'}</span></p>
                    <p>회원 생성일: {new Date(userData.createdAt).toLocaleDateString() || '없음'}</p>
                    <p>회원 수정일: {new Date(userData.updatedAt).toLocaleDateString() || '없음'}</p>
                    <p>최종 로그인 일자: {new Date(userData.lastLogin).toLocaleDateString() || '없음'}</p>
                </section>
                
                {/* 추가 정보 입력/수정 */}
                <section className="additional-section">
                    <div className="info-card">
                        <h3 className="shared-title1">추가 정보 입력/수정</h3>
                        <p>선호 식재료:
                            <input
                                type="text"
                                name="preferredIngredients"
                                value={userData.preferredIngredients || ''}
                                onChange={handleChange}
                            />
                        </p>
                        <p>기피 식재료:
                            <input
                                type="text"
                                name="dislikedIngredients"
                                value={userData.dislikedIngredients || ''}
                                onChange={handleChange}
                            />
                        </p>
                        <p>섭취불가(알러지) 식재료:
                            <input
                                type="text"
                                name="nonConsumableIngredients"
                                value={userData.nonConsumableIngredients || ''}
                                onChange={handleChange}
                            />
                        </p>
                    </div>
                </section>
                {/* 레시피 조회 */}
                <section ref={recipesRef} className="recipes-section">
                    <h3 className="shared-title1">나의 레시피 조회</h3>
                    {recipes.length > 0 ? (
                        recipes.map(recipe => (
                            <div key={recipe.favIdx}>
                                <p>레시피 이름: {recipe.name}</p>
                                <p>레시피 생성일: {new Date(recipe.createdAt).toLocaleDateString()}</p>
                                <p>요리 여부: {recipe.cookedYn === 'Y' ? '조리됨' : '조리하지 않음'}</p>
                            </div>
                        ))
                    ) : (
                        <p>레시피 정보가 없습니다.</p>
                    )}
                </section>
                {/* 환경 점수 */}
                <section ref={statsSectionRef} className="env-section">
                    <div className="env-score-card">
                        <h3 className="shared-title1">나의 환경점수</h3>
                        <svg
                    width="500"
                    height="200"
                    viewBox="0 0 200 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="transparent"
                        stroke="#E0E0E0"
                        strokeWidth="30"
                        strokeDasharray="251.2"
                        strokeDashoffset="0"
                    />
                    <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="transparent"
                        stroke="#36A2EB"
                        strokeWidth="30"
                        strokeDasharray="251.2"
                        strokeDashoffset={(1 - dummyData.envScore / 100) * 251.2}
                        transform="rotate(-90 100 100)"
                    />
                    <text
                        x="100"
                        y="105"
                        textAnchor="middle"
                        fill="#36A2EB"
                        fontSize="20"
                        fontWeight="bold"
                    >
                        {dummyData.envScore}
                    </text>
                    <text
                        x="100"
                        y="125"
                        textAnchor="middle"
                        fill="#888"
                        fontSize="12"
                    >
                        P
                    </text>
                </svg>
                        
                        
                    </div>
                </section>
                {/* 영수증 관리 */}
                <section ref={receiptsRef} className="receipts-section">
                    <h3 className="shared-title1">영수증 관리</h3>
                    {receipts.length > 0 ? (
                        receipts.map(receipt => (
                            <div key={receipt.rptIdx}>
                                <p>영수증 사진: {receipt.rptPhotoUrl ? <img src={receipt.rptPhotoUrl} alt="영수증" style={{ maxWidth: '200px' }} /> : '없음'}</p>
                                <p>총 지방: {receipt.totalFat || '0'} g</p>
                                <p>총 단백질: {receipt.totalProtein || '0'} g</p>
                                <p>총 탄수화물: {receipt.totalCarbonhydrates || '0'} g</p>
                                <p>총 식이섬유: {receipt.totalFiber || '0'} g</p>
                                <p>생성일: {new Date(receipt.createdAt).toLocaleDateString() || '없음'}</p>
                                <p>총 칼로리: {receipt.totalCalories || '0'} kcal</p>
                            </div>
                        ))
                    ) : (
                        <p>영수증 정보가 없습니다.</p>
                    )}
                </section>
                </>
            )}
            {/* 저장 버튼 */}
            <footer className="mypage-footer">
                <button onClick={handleSave}>저장하기</button>
            </footer>
        </div>
    );
};

export default Mypage;
