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

  const handleSkip = async () => {
    await swalModal.fire({
      title: "회원 가입 완료",
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
    navigate("/");
  };

  const handleAdditionalData = async () => {
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
        title: "회원 가입 완료",
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
    <div className="info-wrapper">
      <div className="info-container">
        <div className="info-text">추가정보 입력</div>

        <div className="info-box">
          <span className="info-input-div">선호 재료</span>
          <input
            type="text"
            className="info-input"
            placeholder="해당 재료가 포함된 레시피를 우선적으로 추천합니다! (ex. 양파, 감자, 당근)"
            onChange={(e) => {
              setPreferredIngredient(e.target.value);
            }}
          />
          <textarea
            className="info-textarea-input"
            placeholder="해당 재료가 포함된 레시피를 우선적으로 추천합니다! (ex. 양파, 감자, 당근)"
            onChange={(e) => {
              setPreferredIngredient(e.target.value);
            }}
          ></textarea>
        </div>

        <div className="info-box">
          <div className="info-input-div">비선호 재료</div>
          <input
            type="text"
            className="info-input"
            placeholder="해당 재료가 포함된 레시피를 비교적 적게 추천합니다! (ex. 양파, 감자, 당근)"
            onChange={(e) => {
              setDislikedIngredients(e.target.value);
            }}
          />
          <textarea
            className="info-textarea-input"
            placeholder="해당 재료가 포함된 레시피를 비교적 적게 추천합니다! (ex. 양파, 감자, 당근)"
            onChange={(e) => {
              setDislikedIngredients(e.target.value);
            }}
          ></textarea>
        </div>

        <div className="info-box">
          <div className="info-input-div">제외 재료</div>
          <input
            type="text"
            className="info-input"
            placeholder="해당 재료가 포함된 레시피는 추천에서 제외됩니다! (ex. 양파, 감자, 당근)"
            onChange={(e) => {
              setNonConsumableIngredients(e.target.value);
            }}
          />
          <textarea
            className="info-textarea-input"
            placeholder="해당 재료가 포함된 레시피는 추천에서 제외됩니다! (ex. 양파, 감자, 당근)"
            onChange={(e) => {
              setDislikedIngredients(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="info-submitContainer">
          <button className="info-submit" onClick={handleAdditionalData}>
            확인
          </button>
          <button className="info-submit" onClick={handleSkip}>
            건너뛰기
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinInfo;
