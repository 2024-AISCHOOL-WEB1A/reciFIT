import React, { useEffect, useState } from "react";
import "../assets/css/header.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faX, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { apiAxios } from "../utils/axiosUtils";
import { useDispatch } from "react-redux";
import { userActions } from "../redux/reducers/userSlice";
import swalModal from "../utils/swalModal";


const Header = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuDisplay, setMenuDisplay] = useState(true);
  const [loginText, setLoginText] = useState("로그인");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setLoginText(user.userName);
    }
  }, [user]);

  const handleShutdownMenu = () => {
    setMenuDisplay(true);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleMenu = () => {
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
    swalModal.fire({
      title: "로그아웃",
      text: "로그아웃 중입니다...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        swalModal.showLoading();
      },
    });

    try {
      const res = await apiAxios.post("/auth/logout");

      if (res.status === 200) {
        // redux 삭제
        dispatch(userActions.setUser({ user: null }));

        navigate("/");
        window.location.reload();
      }
    } catch (err) { }
    swalModal.close();
  };

  return (
    <header>
      <div className="site-header">
        <div className="header-container">
          <Link onClick={handleShutdownMenu} to="/">
            <img src="/img/logo.png" className="headerLogo" />
          </Link>

          {/* Navigation */}
          <nav id="site-navigation">
            <div className="menu-container">
              <ul className="menu-list">
                <li>
                  <Link onClick={handleShutdownMenu} to="/">
                    홈
                  </Link>
                </li>
                <li>
                  <Link onClick={handleShutdownMenu} to="/recipe">
                    레시피추천
                  </Link>
                </li>
                <li>
                  <Link onClick={handleShutdownMenu} to="/receipts">
                    영수증
                  </Link>
                </li>
                <li>
                  <Link onClick={handleShutdownMenu} to="/ingredients">
                    재료관리
                  </Link>
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
                onClick={toggleMenu}
              >
                회원정보 수정
              </Link>
            </li>

            {/* <li className="SiteFamilySelect-item">
              <Link
                to="/mypage?section=additional-section"
                className="SiteFamilySelect-link"
                onClick={toggleMenu}
              >
                추가 정보 입력/수정
              </Link>
            </li> */}
            <li className="SiteFamilySelect-item">
              <Link
                to="/mypage?section=recipes-section"
                className="SiteFamilySelect-link"
                onClick={toggleMenu}
              >
                나의 레시피 조회
              </Link>
            </li>
            <li className="SiteFamilySelect-item">
              <Link
                to="/mypage?section=env-section"
                className="SiteFamilySelect-link"
                onClick={toggleMenu}
              >
                나의 환경점수
              </Link>
            </li>
            <li className="SiteFamilySelect-item">
              <Link
                to="/mypage?section=receipts-section"
                className="SiteFamilySelect-link"
                onClick={toggleMenu}
              >
                영수증 관리
              </Link>
            </li>
            {user && (
              <li className="SiteFamilySelect-item">
                <Link
                  className="SiteFamilySelect-link"
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                >
                  로그아웃
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Mobile Btn */}
      <div>
        <button className="MobileMenuBtn" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className="mobileLogoImg">
          <Link onClick={handleShutdownMenu} to="/">
            <img src="/img/mobileLogoImg.png" alt="" />
          </Link>
        </div>
      </div>

      {/* 모바일 토글 메뉴 */}
      <div className={`MobileMenu ${isMobileMenuOpen ? "active" : ""}`}>
        <ul>
          <li onClick={toggleMobileMenu}>
            <div className="ModalCloseBtn">
              <FontAwesomeIcon icon={faX} />
            </div>
            <div className="SiteFamily-text" onClick={toggleMenu}>
              <FontAwesomeIcon icon={faUser} id="userFont" /> {loginText}
              <span className="SiteFamily-bar"></span>
            </div>
          </li>
          <li>
            <Link to="/" onClick={toggleMobileMenu}>홈</Link>
          </li>
          <li>
            <Link to="/recipe" onClick={toggleMobileMenu}>레시피추천</Link>
          </li>
          <li>
            <Link to="/receipts" onClick={toggleMobileMenu}>영수증</Link>
          </li>
          <li>
            <Link to="/ingredients" onClick={toggleMobileMenu}>재료관리</Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/mypage?section=info-section" onClick={toggleMobileMenu}>
                  회원정보 수정
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} style={{ border: "none", background: "none" }}>
                  로그아웃
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
