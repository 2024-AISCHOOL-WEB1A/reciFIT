import React, { useState } from 'react';
import '../assets/css/header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [menuDisplay, setMenuDisplay] = useState('true'); 

  const toggleMenu = () => {
    setMenuDisplay(prevState => !prevState);
  };

  return (
    <header>
      <div className='site-header'>
        <div className='header-container'>
          <a href="/"><h1>𝓇ℯ𝒸𝒾ℱℐ𝒯</h1></a>

          {/* Navigation */}
          <nav id='site-navigation'>
            <div className='menu-container'>
              <ul className='menu-list'>
                <li id='menu-item'>홈</li>
                <li id='menu-item'>레시피추천</li>
                <li id='menu-item'>영수증</li>
                <li id='menu-item'>재료관리</li>
              </ul>
            </div>
          </nav>
        </div>

        <div className='siteFamily'>
          <a href="#" className="SiteFamily-text" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faUser} id='userFont' /> 마이페이지
            <span className="SiteFamily-bar"></span>
          </a>
          <ul className="SiteFamilySelect" style={{ display: menuDisplay ? 'none' : 'block' }}>
            <li className='SiteFamilySelect-item'>
              <a href='http://blog.chungjungone.com/' className='SiteFamilySelect-link' target='_blank' rel="noopener noreferrer">회원정보 수정</a>
            </li>
            <li className='SiteFamilySelect-item'>
              <a href='http://www.jongga.co.kr' className='SiteFamilySelect-link' target='_blank' rel="noopener noreferrer">추가 정보 입력/수정</a>
            </li>
            <li className='SiteFamilySelect-item'>
              <a href='http://www.daesang.com/' className='SiteFamilySelect-link' target='_blank' rel="noopener noreferrer">나의 레시피 조회</a>
            </li>
            <li className='SiteFamilySelect-item'>
              <a href='http://www.jungoneshop.com/' className='SiteFamilySelect-link' target='_blank' rel="noopener noreferrer">현재 재고 관리</a>
            </li>
            <li className='SiteFamilySelect-item'>
              <a href='http://www.wellife.co.kr/' className='SiteFamilySelect-link' target='_blank' rel="noopener noreferrer">영수증 조회 및 관리</a>
            </li>
          </ul>
        </div>

        {/* Mobile Btn */}
        {/* <button className="MobileMenuBtn">
          <span className="MobileMenuBtn-line"></span>
          <span className="MobileMenuBtn-line"></span>
          <span className="MobileMenuBtn-line"></span>
        </button> */}
      </div>
    </header>
  );
};

export default Header;
