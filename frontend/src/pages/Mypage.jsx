import React from 'react';
import "../assets/css/mypage.css";

const Mypage = () => {
    return (
        <div className="mypage">
            <header className="mypage-header">
                <h1>마이 페이지</h1>
            </header>
            <section className="info-section">
                <h3>회원정보 수정</h3>
                <p>닉네임 : </p>
                <p>회원 상태 : </p>
                <p>회원 등급 : </p>
                <p>회원 생성일 : </p>
                <p>회원 수정일 : </p>
                <p>최종 로그인 일자 : </p>
            </section>
            <section className="stats-section">
                <div className="stats-card env-score-card">
                    <h3>나의 환경점수는?</h3>
                    <p>100</p>
                </div>
                <div className="info-card">
                    <h3>추가 정보 입력/수정</h3>
                    <p>선호 식재료</p>
                    <p>기피 식재료</p>
                    <p>섭취불가(알러지) 식재료</p>
                </div>
            </section>
            <section className="my-recipes">
                <h3>나의 레시피 조회</h3>
                <p>레시피 실행 여부</p>
                <p>레시피 생성일</p>
            </section>
            <section className="my-ingredients">
                <h3>식재료 재고 관리</h3>
                <p>식재료 현황 목록</p>
                <p>식재료 보유량</p>
                <p>식재료 구매일</p>
                <p>식재료 유통기한 마감일</p>
                <p>식재료 수정일</p>
            </section>
            <footer className="mypage-footer">
                <button>영수증 조회 및 관리</button>
            </footer>
        </div>
    );
};

export default Mypage;
