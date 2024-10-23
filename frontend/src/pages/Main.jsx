import React, { useState, useEffect } from 'react';
import '../assets/css/page.css';
import '../assets/css/component.css';

const Main = () => {
  const images = [
    '/img/refrigerator.png',
    '/img/salad.png',
    '/img/tteokbokki.png',
    '/img/text2.png', 
    '/img/grlledfish.png',
    '/img/pepper.png',
    '/img/text1.png'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 700);

    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <div className="home page-template-default page page-id-502 singular">
      <div className="site">
        <div id="site-content" className="site-content">
          <div className="MainTopBanner">
            <div className="Main-container">
              <div className="MainSwipe">
                <h2 className="MainSwipeTitle First">The Better</h2>
                <div className="MainSwipeThumb">
                  <div className="MainSwipeThumbSlide">
                    {images.map((src, index) => (
                      <img
                        key={index}
                        className='MainSwipeThumbSlide-img'
                        src={src}
                        alt=''
                        style={{ display: currentIndex === index ? 'block' : 'none' }} // 현재 인덱스의 이미지만 표시
                      />
                    ))}
                  </div>
                </div>
                <h2 className="MainSwipeTitle Last">For you Only</h2>
              </div>
            </div>
            <a href="#;" className="MainTopBannerScroll" rel="noopener noreferrer">
              <span className="MainTopBannerScroll-ico"><span className="MainTopBannerScroll-bg"></span></span>
              <span className="MainTopBannerScroll-text"></span>
            </a>

            <div className="FlotingCampaign">
              <span className="FlotingCampaignIco">
                <span className="FlotingCampaignIco-bg"></span>
                <span className="FlotingCampaignIco-text"><span className="ab-text"></span></span>
              </span>
              <a href="/gift-catalogue-202409/" className="FlotingCampaign-link">
                <div className="FlotingCampaign-title">영수증 등록하기</div>
                <div className="FlotingCampaign-thumb"><img src="/img/camera.png" className="FlotingCampaign-img" alt="" /></div>
              </a>
            </div>
          </div>
          {/* Additional sections */}
        </div>
      </div>
    </div>
  );
}

export default Main;
