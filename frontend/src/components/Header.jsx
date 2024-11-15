import React, { useState } from "react";
import "../assets/css/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const [menuDisplay, setMenuDisplay] = useState("true");

  const userIdx = useSelector((state) => state.user.userIdx);
  const userName = useSelector((state) => state.user.userName);
  const provider = useSelector((state) => state.user.provider);

  console.log(userIdx, userName, provider);

  const toggleMenu = () => {
    setMenuDisplay((prevState) => !prevState);
  };

  return (
    <header>
      <div className="site-header">
        <div className="header-container">
          <Link to="/">
            <img src="/img/logo.png" className="headerLogo" />
          </Link>

          {/* Navigation */}
          <nav id="site-navigation">
            <div className="menu-container">
              <ul className="menu-list">
                <li>
                  <Link to="/">홈</Link>
                </li>
                <li>
                  <Link to="/recipe">레시피추천</Link>
                </li>
                <li>
                  <Link to="/receipts">영수증</Link>
                </li>
                <li>
                  <Link to="/ingredients">재료관리</Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="siteFamily">
          <Link to="/mypage" className="SiteFamily-text" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faUser} id="userFont" /> 로그인
            <span className="SiteFamily-bar"></span>
          </Link>
          <ul className="SiteFamilySelect" style={{ display: menuDisplay ? 'none' : 'block' }}>
          <li className='SiteFamilySelect-item'>
            <Link to='/mypage?section=info-section' className='SiteFamilySelect-link'>회원정보 수정</Link>
          </li>
          <li className='SiteFamilySelect-item'>
            <Link to='/mypage?section=env-section' className='SiteFamilySelect-link'>나의 환경점수</Link>
          </li>
          <li className='SiteFamilySelect-item'>
            <Link to='/mypage?section=additional-section' className='SiteFamilySelect-link'>추가 정보 입력/수정</Link>
          </li>
          <li className='SiteFamilySelect-item'>
            <Link to='/mypage?section=recipes-section' className='SiteFamilySelect-link'>나의 레시피 조회</Link>
          </li>
          
          <li className='SiteFamilySelect-item'>
            <Link to='/mypage?section=receipts-section' className='SiteFamilySelect-link'>영수증 관리</Link>
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
