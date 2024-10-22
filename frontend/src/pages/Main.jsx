import React from 'react'
import '../assets/css/header.css'
import '../assets/css/page.css'
import '../assets/css/footer.css'
import '../assets/css/component.css'

const Main = () => {
  return (
    <div className="home page-template-default page page-id-502 singular">
      <div className="site">
        <div id="site-content" className="site-content">
          <div className="MainTopBanner">
            <div className="Main-container">
              <div className="MainSwipe">
                <h2 className="MainSwipeTitle First">The Better</h2>
                <div class="MainSwipeThumb">
                  <div class="MainSwipeThumbSlide">
                    {/* <img class='MainSwipeThumbSlide-img' src='https://www.chungjungone.com/wp-content/uploads/2022/03/brand-main-img1.png' alt='' /> */}
                    <img class='MainSwipeThumbSlide-img' src='/img/MainSwipeThumbSlide2.png' alt='' />
                    <img class='MainSwipeThumbSlide-img' src='/img/2.png' alt='' />
                    {/* <img class='MainSwipeThumbSlide-img' src='https://www.chungjungone.com/wp-content/uploads/2022/04/brand-main-img3.png' alt='' /> */}
                    <img class='MainSwipeThumbSlide-img' src='/img/3.png' alt='' />
                    <img class='MainSwipeThumbSlide-img' src='/img/01.png' alt='' />
                    <img class='MainSwipeThumbSlide-img' src='/img/1.png' alt='' />					
                  </div>
                </div>
                <h2 className="MainSwipeTitle Last">For you Only</h2>
              </div>
            </div>
            <a href="#;" className="MainTopBannerScroll" rel="noopener noreferrer">
              <span className="MainTopBannerScroll-ico"><span className="MainTopBannerScroll-bg"></span></span>
              <span className="MainTopBannerScroll-text"></span>
            </a>
          </div>
          {/* Additional sections */}
        </div>
      </div>
    </div>
  )
}

export default Main;
