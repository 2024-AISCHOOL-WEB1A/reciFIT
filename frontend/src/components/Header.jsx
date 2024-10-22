import React from 'react'
import '../assets/css/header.css'

const Header = () => {
  return (
    <header>
      <div className='site-header'>
        <div className='header-container'>
          <a href="/"><h1>reciFIT</h1></a>
        
          {/* Navication */}
          <nav id='site-navigation'>
            <div className='menu-container'>
              <ul className='menu-list'>
                <li id='menu-item'>Home</li>
                <li id='menu-item'>레시피 추천</li>
                <li id='menu-item'>영수증 인식</li>
                <li id='menu-item'>재고 관리</li>
              </ul>
            </div>
          </nav>
        </div>

        <div className='siteFamily'>
          <a href="javascript:void(0)" class="SiteFamily-text">마이페이지<span class="SiteFamily-bar"></span></a>
          <ul class="SiteFamilySelect">
            <li class='SiteFamilySelect-item'><a href='http://blog.chungjungone.com/' class='SiteFamilySelect-link' target='_blank'>회원정보 수정</a></li>
            <li class='SiteFamilySelect-item'><a href='http://www.jongga.co.kr' class='SiteFamilySelect-link' target='_blank'>추가 정보 입력/수정</a></li>
            <li class='SiteFamilySelect-item'><a href='http://www.daesang.com/' class='SiteFamilySelect-link' target='_blank'>나의 레시피 조회</a></li>
            <li class='SiteFamilySelect-item'><a href='http://www.jungoneshop.com/' class='SiteFamilySelect-link' target='_blank'>현재 재고 관리</a></li>
            <li class='SiteFamilySelect-item'><a href='http://www.wellife.co.kr/' class='SiteFamilySelect-link' target='_blank'>영수증 조회 및 관리</a></li>				
          </ul>
				</div>

        {/* <!-- Mobile Btn -->
        <button class="MobileMenuBtn">
          <span class="MobileMenuBtn-line"></span>
          <span class="MobileMenuBtn-line"></span>
          <span class="MobileMenuBtn-line"></span>
        </button>
        <!-- .Mobile Btn --> */}
      </div>
    </header>
  )
}

export default Header