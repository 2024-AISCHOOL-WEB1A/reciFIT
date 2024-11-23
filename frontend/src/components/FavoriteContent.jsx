import React from "react";
import "../assets/css/favorite-content.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils, faHeart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const FavoriteContent = ({ item }) => {
  const navigate = useNavigate();

  return (
    <div
      className="favorite-wrapper"
      onClick={() => {
        navigate(`/recipe/${item?.rcpIdx}`);
      }}
    >
      <div className="favorite-image-wrapper">
        <img src={item?.ckPhotoUrl} alt="recipe-image" />
      </div>
      <div className="favorite-description-content">
        <span>{item?.ckName}</span>
        <span>{item?.ckInstructions}</span>
      </div>
      <div className="favorite-icon-content">
        <FontAwesomeIcon
          className={`favorite-icon${
            item?.cookedYn === "Y" ? " favorite-cooking-icon-selected" : ""
          }`}
          icon={faUtensils}
        />
      </div>
      <div className="favorite-icon-content">
        <FontAwesomeIcon
          className={`favorite-icon${
            item?.favoriteYn === "Y" ? " favorite-favorite-icon-selected" : ""
          }`}
          icon={faHeart}
        />
      </div>
    </div>
  );
};

export default FavoriteContent;
