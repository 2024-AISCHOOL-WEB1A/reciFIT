import React, { useState } from "react";
import "../assets/css/joinInfo.css";
import { apiAxios } from "../utils/axiosUtils";
import { useNavigate } from "react-router-dom";

const JoinInfo = () => {
  const navigate = useNavigate();

  const [preferredIngredients, setPreferredIngredient] = useState("");
  const [dislikedIngredients, setDislikedIngredients] = useState("");
  const [nonConsumableIngredients, setNonConsumableIngredients] = useState("");

  const postAdditionalUserDate = async () => {
    try {
      const res = await apiAxios.patch("/users", {
        preferredIngredients,
        dislikedIngredients,
        nonConsumableIngredients,
      });

      if (res.status === 200) {
        // TODO : 성공 모달창
        // TODO : 확인 누르면 메인 페이지로 이동
        navigate("/");
      } else {
        // TODO : 실패 모달창
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="info-container">
        <div className="info-text">추가정보 입력</div>

        <div className="like-box">
          <span className="like-text">선호</span>
          <input
            type="text"
            className="info-like"
            placeholder="해당 재료가 포함된 레시피를 우선적으로 추천합니다! (ex. 양파, 감자, 당근)"
            onChange={(e) => {
              setPreferredIngredient(e.target.value);
            }}
          />
        </div>

        <div className="dislike-box">
          <div className="dislike-text">비선호</div>
          <input
            type="text"
            className="info-dislike"
            placeholder="해당 재료가 포함된 레시피를 비교적 적게 추천합니다! (ex. 양파, 감자, 당근)"
            onChange={(e) => {
              setDislikedIngredients(e.target.value);
            }}
          />
        </div>

        <div className="allergy-box">
          <div className="allergy-text">제외</div>
          <input
            type="text"
            className="info-allergy"
            placeholder="해당 재료가 포함된 레시피는 추천에서 제외됩니다! (ex. 양파, 감자, 당근)"
            onChange={(e) => {
              setNonConsumableIngredients(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="info-submitContainer">
        <button className="info-submit" onClick={postAdditionalUserDate}>
          확인
        </button>
      </div>
    </div>
  );
};

export default JoinInfo;
