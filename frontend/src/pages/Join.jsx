import React, { useEffect, useState } from 'react'
import '../assets/css/join.css'



const Join = () => {

// 페이드인, 아웃 이미지---------------------------------------------------
    const images = [
        `${process.env.PUBLIC_URL}/img/login_pic/login_pic1.jpg`,
        `${process.env.PUBLIC_URL}/img/login_pic/login_pic2.jpg`,
        `${process.env.PUBLIC_URL}/img/login_pic/login_pic3.jpg`
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            // Fade out
            setFade(false);

            // 다음 이미지로 전환 (fade-out 후에 실행)
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
                setFade(true); // Fade-in
            }, 1000); // fade-out 시간과 일치

        }, 8000); // 8초마다 이미지 전환

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    }, [images.length]);


// 카카오 로그인---------------------------------------------------
    const REST_API_KEY = '백엔드한테 달라하자1';
    const REDIRECT_URI = '백엔드한테 달라하자2';
    const link = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    const loginHandler = () => {
        window.location.href = link;
    };




    return (
        <div className='container'>
            <div className="slider-container">
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className={`slider-image ${fade ? 'fade-in' : 'fade-out'}`}
                />
            </div>

            <div className='login'>
                <img src={`${process.env.PUBLIC_URL}/img/login_pic/logo.png`}
                    alt="로고" className='login-logo' />

                <h3 className='login-small-text'> sns 로그인으로 간편하게 
                    <br/>레시핏 서비스를 즐겨보세요</h3>

                <div className='Query-container'>
                <img
                    src={images[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    className={`query-slider-image ${fade ? 'fade-in' : 'fade-out'} mediaQuery-slider`}
                />
                </div>

                <h1 className='login-text'>로그인</h1>

                <img src={`${process.env.PUBLIC_URL}/img/login_pic/kakao_login_medium_wide.png`} alt="카카오로그인"
                    onClick={loginHandler} className='kakao-button'/>


            </div>
        </div>
    );
};

export default Join;

// export default Join