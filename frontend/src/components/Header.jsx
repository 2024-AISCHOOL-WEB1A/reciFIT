import React, { useEffect, useState } from "react";
import "../assets/css/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { apiAxios } from "../utils/axiosUtils";
import { useDispatch } from "react-redux";
import { userActions } from "../redux/reducers/userSlice";

const Header = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuDisplay, setMenuDisplay] = useState("true");
  const [loginText, setLoginText] = useState("로그인");

  useEffect(() => {
    if (user) {
      setLoginText(user.userName);
    }
  }, [user]);

  const toggleMenu = () => {
    console.log(user);

    // 로그인 여부 확인
    if (user) {
      // 로그인이 되어 있다면, 메뉴가 열리도록
      setMenuDisplay((prevState) => !prevState);
    } else {
      // 로그인이 되어 있지 않다면, join으로 이동
      navigate("/join");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await apiAxios.post("/auth/logout");

      if (res.status === 200) {
        // redux 삭제
        dispatch(userActions.setUser({ user: null }));

        navigate("/");
        window.location.reload();
      }
    } catch (err) {
      // console.error(err);
    }
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

        <div className="SiteFamily">
          <div className="SiteFamily-text" onClick={toggleMenu}>
            <FontAwesomeIcon icon={faUser} id="userFont" /> {loginText}
            <span className="SiteFamily-bar"></span>
          </div>
          <ul
            className="SiteFamilySelect"
            style={{ display: menuDisplay ? "none" : "block" }}
          >
            <li className="SiteFamilySelect-item">
              <Link
                to="/mypage?section=info-section"
                className="SiteFamilySelect-link"
              >
                회원정보 수정
              </Link>
            </li>
            <li className="SiteFamilySelect-item">
              <Link
                to="/mypage?section=env-section"
                className="SiteFamilySelect-link"
              >
                나의 환경점수
              </Link>
            </li>
            <li className="SiteFamilySelect-item">
              <Link
                to="/mypage?section=additional-section"
                className="SiteFamilySelect-link"
              >
                추가 정보 입력/수정
              </Link>
            </li>
            <li className="SiteFamilySelect-item">
              <Link
                to="/mypage?section=recipes-section"
                className="SiteFamilySelect-link"
              >
                나의 레시피 조회
              </Link>
            </li>
            <li className="SiteFamilySelect-item">
              <Link
                to="/mypage?section=receipts-section"
                className="SiteFamilySelect-link"
              >
                영수증 관리
              </Link>
            </li>
            {user && (
              <li className="SiteFamilySelect-item">
                <Link className="SiteFamilySelect-link" onClick={handleLogout}>
                  로그아웃
                </Link>
              </li>
            )}
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
