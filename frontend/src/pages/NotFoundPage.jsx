import React from "react";
import "../assets/css/notfound.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrown } from "@fortawesome/free-regular-svg-icons"; // Regular 아이콘 import

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <FontAwesomeIcon icon={faFaceFrown} className="notfound-icon" />
      <div className="notfound-title">404</div>
      <div className="notfound-subtitle">Page Not Found</div>
    </div>
  );
};

export default NotFoundPage;
