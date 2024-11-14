import React, { useState } from "react";
import "../assets/css/page.css";
import "../assets/css/component.css";
import { Link } from "react-router-dom";

const Main = () => {
  // 메인페이지 사진 깜빡임 애니메이션
  const images = [
    "/img/refrigerator.png",
    "/img/salad.png",
    "/img/tteokbokki.png",
    "/img/text2.png",
    "/img/grlledfish.png",
    "/img/pepper.png",
    "/img/text1.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // 각각의 MainBrandBanner hover 상태를 관리하기 위한 useState
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 이미지 변경 인터벌
  useState(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 700);

    return () => clearInterval(intervalId);
  }, []);

  // hover 시 애니메이션 트리거
  const handleMouseEnter = (index) => {
    setHoveredIndex(index); // 현재 hover된 index만 설정
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null); // hover가 풀리면 null로 초기화
  };

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
                        className="MainSwipeThumbSlide-img"
                        src={src}
                        alt=""
                        style={{
                          display: currentIndex === index ? "block" : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <h2 className="MainSwipeTitle Last">For you Only</h2>
              </div>
            </div>
            <a
              href="#targetSection"
              className="MainTopBannerScroll"
              rel="noopener noreferrer"
            >
              <span className="MainTopBannerScroll-ico">
                <span className="MainTopBannerScroll-bg"></span>
              </span>
              <span className="MainTopBannerScroll-text"></span>
            </a>

            <div className="FlotingCampaign">
              <span className="FlotingCampaignIco">
                <span className="FlotingCampaignIco-bg"></span>
                <span className="FlotingCampaignIco-text">
                  <span className="ab-text"></span>
                </span>
              </span>
              <a href="#" className="FlotingCampaign-link">
                <div className="FlotingCampaign-title">영수증 등록하기</div>
                <div className="FlotingCampaign-thumb">
                  <img
                    src="/img/camera.png"
                    className="FlotingCampaign-img"
                    alt=""
                  />
                </div>
              </a>
            </div>
          </div>

          {/* --------------------------- Main Selection -------------------------------------*/}
          <div className="MainSection">
            <div className="Main-container">
              {/* 첫 번째 배너 */}
              <div
                id="targetSection"
                className={`MainBrandBanner a-Action a-ParallaxUp ${
                  hoveredIndex === 0 ? "is-Action" : ""
                }`}
                onMouseEnter={() => handleMouseEnter(0)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to="/recipe"
                  className="MainBrandBanner-link"
                  target="_self"
                >
                  <div className="MainBrandBannerBg">
                    <span
                      className="MainBrandBannerBg-img a-BgUp"
                      style={{ backgroundImage: "url(/img/recipe_bg.jpg)" }}
                    ></span>
                  </div>
                  <div className="MainBrandBannerText">레시피</div>
                </Link>
              </div>

              {/* 두 번째 배너 */}
              <div
                className={`MainBrandBanner a-Action a-ParallaxUp ${
                  hoveredIndex === 1 ? "is-Action" : ""
                }`}
                onMouseEnter={() => handleMouseEnter(1)}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="/receipts" className="MainBrandBanner-link" target="_self">
                  <div className="MainBrandBannerBg">
                    <span
                      className="MainBrandBannerBg-img a-BgUp"
                      style={{ backgroundImage: "url(/img/receipt_bg.jpg)" }}
                    ></span>
                  </div>
                  <div className="MainBrandBannerText">영수증 인식</div>
                </Link>
              </div>

              {/* 세 번째 배너 */}
              <div
                className={`MainBrandBanner a-Action a-ParallaxUp ${
                  hoveredIndex === 2 ? "is-Action" : ""
                }`}
                onMouseEnter={() => handleMouseEnter(2)}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="#" className="MainBrandBanner-link" target="_self">
                  <div className="MainBrandBannerBg">
                    <span
                      className="MainBrandBannerBg-img a-BgUp"
                      style={{ backgroundImage: "url(/img/fridge_bg.png)" }}
                    ></span>
                  </div>
                  <div className="MainBrandBannerText">재료 관리</div>
                </Link>
              </div>

              {/* 네 번째 배너 */}
              <div
                className={`MainBrandBanner a-Action a-ParallaxUp ${
                  hoveredIndex === 3 ? "is-Action" : ""
                }`}
                onMouseEnter={() => handleMouseEnter(3)}
                onMouseLeave={handleMouseLeave}
              >
                <Link to="#" className="MainBrandBanner-link" target="_self">
                  <div className="MainBrandBannerBg">
                    <span
                      className="MainBrandBannerBg-img a-BgUp"
                      style={{ backgroundImage: "url(/img/natural.jpg)" }}
                    ></span>
                  </div>
                  <div className="MainBrandBannerText">환경 점수</div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
