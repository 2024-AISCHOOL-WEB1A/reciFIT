import React, { useEffect, useState } from 'react';
import "../assets/css/mypage.css";

const Mypage = () => {
    const [userData, setUserData] = useState({});
    
    const [recipes, setRecipes] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [receipts, setReceipts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userId = 1; // 요청할 사용자 ID (예시)
    const [additionalInfo, setAdditionalInfo] = useState({
        preferredIngredients: '',
        avoidedIngredients: '',
        allergyIngredients: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();
                setUserData(data);
                const envScoreResponse = await fetch(`/api/environmentScore/${userId}`);
                const envScoreData = await envScoreResponse.json();
                setUserData(prevData => ({
                    ...prevData,
                    envScore: envScoreData.env_score // 환경 점수 추가
                }));
            } catch (error) {
                console.error('사용자 정보를 불러오는 데 실패했습니다.', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const handleSectionClick = async (section) => {
        try {
            setIsLoading(true);
            let response;
            switch (section) {
                case 'recipes':
                    response = await fetch(`/api/users/${userId}/recipes`);
                    setRecipes(await response.json());
                    break;
                case 'ingredients':
                    response = await fetch(`/api/users/${userId}/ingredients`);
                    setIngredients(await response.json());
                    break;
                case 'receipts':
                    response = await fetch(`/api/users/${userId}/receipts`);
                    setReceipts(await response.json());
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('정보를 불러오는 데 실패했습니다.', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            alert('저장 완료');
        } catch (error) {
            console.error('저장 중 오류 발생:', error);
        }
    };

    if (isLoading) return <div>로딩 중...</div>;

    return (
        <div className="mypage">
            <header className="my-header">
                <h3>마이 페이지</h3>
            </header>
            <section className="info-section">
                <h3 className="info-title">회원정보 관리</h3>
                <p>닉네임: 
                    <input type="text" name="nickname" value={userData.nickname || ''} onChange={handleChange} />
                </p>
                <p>회원 상태: 
                    <span>{userData.status || '없음'}</span>
                </p>
                <p>회원 역할:
                    <span>{userData.role || '없음'}</span>
                </p>
                <p>회원 생성일: {new Date(userData.created_at).toLocaleDateString() || '없음'}</p>
                <p>회원 수정일: {new Date(userData.updated_at).toLocaleDateString() || '없음'}</p>
                <p>최종 로그인 일자: {new Date(userData.last_login).toLocaleDateString() || '없음'}</p>
            </section>

            <section className="stats-section">
                <div className="stats-card env-score-card">
                    <h3>나의 환경점수는?</h3>
                    <p>{userData.envScore || '0'}</p>
                </div>
                <div className="info-card">
                    <h3>추가 정보 입력/수정</h3>
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

            <section className="my-recipes">
                <button onClick={() => handleSectionClick('recipes')}>나의 레시피 조회 및 관리</button>
                {recipes.length > 0 ? (
                    recipes.map(recipe => (
                        <div key={recipe.fav_idx}>
                            <p>레시피 이름: {recipe.name}</p>
                            <p>레시피 생성일: {new Date(recipe.created_at).toLocaleDateString()}</p>
                            <p>요리 여부: {recipe.cooked_yn === 'Y' ? '조리됨' : '조리하지 않음'}</p>
                        </div>
                    ))
                ) : (
                    <p>레시피 정보가 없습니다.</p>
                )}
            </section>

            <section className="my-ingredients">
            <button onClick={() => handleSectionClick('ingredients')}>식재료 재고 조회 및 관리</button>
            {ingredients.length > 0 ? (
                ingredients.map(ingredient => (
                    <div key={ingredient.u_ingre_idx}>
                        <p>식재료 이름: {ingredient.name}</p>
                        <p>식재료 보유량: {ingredient.quantity || 0}</p>
                        <p>식재료 구매일: {new Date(ingredient.purchase_date).toLocaleDateString() || '없음'}</p>
                        <p>식재료 유통기한: {new Date(ingredient.expired_date).toLocaleDateString() || '없음'}</p> {/* 계산된 유통기한 사용 */}
                    </div>
                ))
            ) : (
                <p>식재료 정보가 없습니다.</p>
            )}
            </section>

            <section className="my-receipts">
                <button onClick={() => handleSectionClick('receipts')}>영수증 조회 및 관리</button>
                {receipts.length > 0 ? (
                    receipts.map(receipt => (
                        <div key={receipt.rpt_idx}>
                            <p>영수증 사진: {receipt.rpt_photo_url ? <img src={receipt.rpt_photo_url} alt="영수증" style={{ maxWidth: '200px' }} /> : '없음'}</p>
                            <p>인식된 글자: {receipt.recognized_text || '없음'}</p>
                            <p>총 칼로리: {receipt.total_calories || '0'}</p>
                            <p>총 지방: {receipt.total_fat || '0'}</p>
                            <p>총 단백질: {receipt.total_protein || '0'}</p>
                            <p>총 탄수화물: {receipt.total_carbohydrates || '0'}</p>
                            <p>총 식이섬유: {receipt.total_fiber || '0'}</p>
                            <p>영수증 생성일: {new Date(receipt.created_at).toLocaleDateString() || '없음'}</p>
                        </div>
                    ))
                ) : (
                    <p>영수증 정보가 없습니다.</p>
                )}
            </section>

            <footer className="mypage-footer">
                <button onClick={handleSave}>저장하기</button>
            </footer>
        </div>
    );
};

export default Mypage;
