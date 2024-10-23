import React, { useEffect, useState } from 'react'
import '../assets/css/join.css'



const images = [
    `${process.env.PUBLIC_URL}/img/login_pic/login_pic1.jpg`,
    `${process.env.PUBLIC_URL}/img/login_pic/login_pic2.jpg`,
    `${process.env.PUBLIC_URL}/img/login_pic/login_pic3.jpg`,
    `${process.env.PUBLIC_URL}/img/login_pic/login_pic4.jpg`
];

const Join = () => {
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
            }, 800); // fade-out 시간과 일치

        }, 4000); // 4초마다 이미지 전환

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
    }, []);



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
                <img src={`${process.env.PUBLIC_URL}/img/login_pic/logo.png`} alt="로고" className='login-logo'/>
                <h1 className='login-text'>로그인</h1>
            </div>
        </div>
    );
};

export default Join;

// export default Join