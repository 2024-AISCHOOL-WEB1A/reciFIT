import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios'; // axios import
import "../assets/css/mypage.css";

const Mypage = () => {
    const [userData, setUserData] = useState({});
    const dummyData = {
        envScore: userData.envScore,
        remainingScore: 100 - userData.envScore,
    };
    const [recipes, setRecipes] = useState([ 
        {
            favIdx: 1,
            name: "감자조림",
            imageUrl: "https://recipe1.ezmember.co.kr/cache/recipe/2016/07/12/24fe2fa2309eb17dbe2f60b93eee3be21.jpg",
            createdAt: new Date(),
            cookedYn: "Y",
        },
        {
            favIdx: 2,
            name: "불고기",
            imageUrl: "https://recipe1.ezmember.co.kr/cache/recipe/2019/03/03/11baafbe81803965b17c3ab42a5992cb1.jpg",
            createdAt: new Date(),
            cookedYn: "N",
        }
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

    //영수증 이미지 클릭시 팝업 열기
    const [isModalOpen, setIsModalOpen] = useState(false); // 팝업창 열림 상태 관리
    const [selectedImage, setSelectedImage] = useState(''); // 선택된 이미지 URL
    const handleThumbnailClick = (imageUrl) => {
        setSelectedImage(imageUrl); // 선택된 이미지 URL을 설정
        setIsModalOpen(true); // 팝업창 열기
    };

    // 팝업 닫기
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(''); // 선택된 이미지 초기화
    };
    //스크롤이동
    const location = useLocation();
        // 각 섹션에 대한 ref 설정
    const infoSectionRef = useRef(null);
    const additionalSectionRef = useRef(null);
    const recipesRef = useRef(null);
    const envSectionRef = useRef(null);
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

    // 페이지가 로드되면, 쿼리 string에 맞는 섹션으로 스크롤 이동
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const section = params.get('section'); // ?section=env-section 형태의 쿼리 파라미터 처리

        // 해당 섹션으로 스크롤 이동
        if (section) {
            switch (section) {
                case 'info-section':
                    infoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'additional-section':
                    additionalSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'recipes-section':
                    recipesRef.current?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'env-section':
                    envSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                    break;
                case 'receipts-section':
                    receiptsRef.current?.scrollIntoView({ behavior: 'smooth' });
                    break;
                default:
                    break;
            }
        }
    }, [location]);

    const envScore = userData.envScore || 80; // 환경 점수
    const radius = 60; // 원 반지름을 60으로 줄여서 높이를 줄임
    const circumference = Math.PI * radius; // 반원의 둘레
    const scorePercentage = envScore / 100; // 점수 비율
    const scoreStroke = circumference * scorePercentage; // 점수에 해당하는 stroke 길이
    const remainingStroke = circumference - scoreStroke; // 남은 영역 stroke 길이

    return (
        <div className="mypage">
            <h2 className="shared-title-h2">마이 페이지</h2>
            {isLoading ? <p>로딩 중...</p> : (
                <>
                   <section ref={infoSectionRef} className="info-section">
    <h3 className="shared-title1">회원정보 수정</h3>
    <table className="info-table">
        <tbody>
            <tr>
                <td>닉네임 :</td>
                <td>
                    <input 
                        type="text" 
                        name="nickname" 
                        value={userData.nickname || '찬란한 도넛'} 
                        onChange={handleChange} 
                    />
                </td>
            </tr>
            <tr>
                <td>회원 상태 :</td>
                <td>
                    <span>{userData.status || '활성'}</span>
                </td>
            </tr>
            <tr>
                <td>회원 역할 :</td>
                <td>
                    <span>{userData.role || '일반 회원'}</span>
                </td>
            </tr>
            <tr>
                <td>회원 생성일 :</td>
                <td>
                    {userData.createdAt 
                        ? new Date(userData.createdAt).toLocaleDateString() 
                        : '2024-11-15 03:47:12'}
                </td>
            </tr>
            <tr>
                <td>회원 수정일 :</td>
                <td>
                    {userData.updatedAt 
                        ? new Date(userData.updatedAt).toLocaleDateString() 
                        : '2024-11-15 05:14:02'}
                </td>
            </tr>
            <tr>
                <td>최종 로그인 일자 :</td>
                <td>
                    {userData.lastLogin 
                        ? new Date(userData.lastLogin).toLocaleDateString() 
                        : '2024-11-15 06:14:02'}
                </td>
            </tr>
            <tr>
                <td>선호 식재료 :</td>
                <td>
                    <input 
                        type="text" 
                        name="preferredIngredients" 
                        value={userData.preferredIngredients || '닭가슴살'} 
                        onChange={handleChange} 
                    />
                </td>
            </tr>
            <tr>
                <td>기피 식재료 :</td>
                <td>
                    <input 
                        type="text" 
                        name="dislikedIngredients" 
                        value={userData.dislikedIngredients || '홍어'} 
                        onChange={handleChange} 
                    />
                </td>
            </tr>
            <tr>
                <td>섭취불가(알러지) 식재료 :</td>
                <td>
                    <input 
                        type="text" 
                        name="nonConsumableIngredients" 
                        value={userData.nonConsumableIngredients || '복숭아'} 
                        onChange={handleChange} 
                    />
                </td>
            </tr>
        </tbody>
    </table>
</section>
<div class="save-button-container">
        <button onClick={handleSave} className="save-button">저장하기</button>
        </div>

                    <hr style={{margin: '20px 0', height: '2px', backgroundColor: '#f4b057', border: 'none' }} />

                    <section ref={recipesRef} className="recipes-section" style={{ margin: '20px auto', width: '90%' }}>
    <h3 className="shared-title1" style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
        나의 레시피 조회
    </h3>
    {recipes.length > 0 ? (
        <table className="recipes-table" style={{ width: '100%', borderCollapse: 'collapse', margin: '0 auto', textAlign: 'center' }}>
            <thead>
                <tr style={{ backgroundColor: '#f8f8f8', borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>레시피 이미지</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>레시피 이름</th>
                    <th style={{ padding: '10px', border: '1px solid #ddd' }}>요리 여부</th>
                </tr>
            </thead>
            <tbody>
                {recipes.map(recipe => (
                    <tr key={recipe.favIdx} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                            <img 
                                src={recipe.imageUrl} 
                                alt={`${recipe.name} 이미지`} 
                                width="243" 
                                height="150" 
                                style={{ objectFit: 'cover', borderRadius: '8px' }} 
                            />
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd', fontSize: '16px', fontWeight: 'bold' }}>
                            {recipe.name}
                        </td>
                        <td style={{ padding: '10px', border: '1px solid #ddd', fontSize: '14px', color: recipe.cookedYn === "Y" ? 'green' : 'red' }}>
                            {recipe.cookedYn === "Y" ? "완료" : "미완료"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    ) : (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#555' }}>레시피가 없습니다.</p>
    )}
</section>



                    <hr style={{ margin: '20px 0', height: '2px', backgroundColor: '#f4b057', border: 'none' }} />

                    <section ref={envSectionRef} className="env-section">
                        <h3 className="shared-title2">환경 점수</h3>
                        <div className="env-circle-container">
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

                    <section ref={receiptsRef} className="receipts-section">
                        <h3 className="shared-title1">영수증 관리</h3>
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
                                    {receipts.map((receipt) => (
                                        <tr key={receipt.rptIdx}>
                                            <td>
                                                <img 
                                                    src={receipt.rptPhotoUrl} 
                                                    alt="영수증" 
                                                    width="50" 
                                                    height="100" 
                                                    onClick={() => handleThumbnailClick(receipt.rptPhotoUrl)} // 썸네일 클릭 시 팝업 열기
                                                    style={{ cursor: 'pointer' }} // 클릭할 수 있도록 스타일 추가
                                                />
                                            </td>
                                            <td>{receipt.totalCalories}kcal</td>
                                            <td>{receipt.totalProtein}mg</td>
                                            <td>{receipt.totalCarbonhydrates}mg</td>
                                            <td>{receipt.totalFat}mg</td>
                                            <td>{receipt.totalFiber}mg</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>영수증이 없습니다.</p>
                        )}
                    </section>

                     {/* 팝업 창 */}
                     {isModalOpen && (
                        <div className="modal" onClick={closeModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <img src={selectedImage} alt="영수증 원본" style={{ width: '100%' }} />
                                <button onClick={closeModal}>닫기</button>
                            </div>
                        </div>
                   
                    )}
</>
)}
        
        </div>
    );
};

export default Mypage;
