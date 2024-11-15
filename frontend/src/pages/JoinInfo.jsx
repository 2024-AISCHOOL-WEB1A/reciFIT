import React, { useState } from "react";
import "../assets/css/joinInfo.css";
import { apiAxios } from "../utils/axiosUtils";
import { useNavigate } from "react-router-dom";
import swalModal from "../utils/swalModal";

const JoinInfo = () => {
  const navigate = useNavigate();

  const [preferredIngredients, setPreferredIngredient] = useState("");
  const [dislikedIngredients, setDislikedIngredients] = useState("");
  const [nonConsumableIngredients, setNonConsumableIngredients] = useState("");

  const postAdditionalUserDate = async () => {
    let isSuccess = false;

    // 모든 항목이 비어 있는 경우
    if (
      !preferredIngredients &&
      !dislikedIngredients &&
      !nonConsumableIngredients
    ) {
      isSuccess = true;
    } else {
      try {
        const res = await apiAxios.patch("/users", {
          preferredIngredients,
          dislikedIngredients,
          nonConsumableIngredients,
        });

        if (res.status === 200) {
          isSuccess = true;
        } else {
          // 실패로 이동
          throw new Error();
        }
      } catch (err) {
        // console.error(err);
        // 실패
        await swalModal.fire({
          title: "추가정보 입력 실패",
          text: "추가정보 입력에 실패하였습니다. 관리자에게 문의바랍니다.",
          icon: "error",
          confirmButtonText: "확인",
          didClose: () => {
            window.scrollTo({
              top: 0,
              left: 0,
              behavior: "instant",
            });
          },
        });
      }
    }

    // 성공
    if (isSuccess) {
      await swalModal.fire({
        title: "회원 가입 성공",
        text: "회원 가입을 축하드립니다!",
        icon: "success",
        confirmButtonText: "확인",
        didClose: () => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
          });
        },
      });
    }
    navigate("/");
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
