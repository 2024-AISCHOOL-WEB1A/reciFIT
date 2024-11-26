import React from "react";
import "../assets/css/notfound.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceFrown } from "@fortawesome/free-regular-svg-icons";
import { Helmet } from "react-helmet";

const NotFoundPage = () => {
  return (
    <div className="notfound-container">
      <Helmet>
        <title>Page Not Found</title>
      </Helmet>
      <img
        style={{ width: "auto", height: "auto" }}
        src="/favicon.ico"
        alt=""
      />
      <FontAwesomeIcon icon={faFaceFrown} className="notfound-icon" />
      <div className="notfound-title">404</div>
      <div className="notfound-subtitle">Page Not Found</div>
    </div>
  );
};

export default NotFoundPage;
