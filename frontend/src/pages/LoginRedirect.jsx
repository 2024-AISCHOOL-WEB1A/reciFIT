import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { userActions } from "../redux/reducers/userSlice";

const LoginRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // query string에서 정보 추출
    const queryParams = new URLSearchParams(location.search);
    const userIdx = queryParams.get("userIdx");
    const userName = queryParams.get("userName");
    const provider = queryParams.get("provider");
    const isNewUser = queryParams.get("isNewUser");

    if (userIdx && userName && provider && isNewUser) {
      // Redux에 유저 정보 저장
      dispatch(
        userActions.serUser({
          userIdx,
          userName,
          provider,
        })
      );

      if (isNewUser == "true") {
        // 비회원의 경우
        navigate("/join-info");
        // console.log("비회원");
      } else {
        // 회원의 경우
        navigate("/");
        // console.log("회원");
      }
      // console.log(isNewUser);
    } else {
      // 쿼리 스트링에 필요한 정보가 없으면 로그인 페이지로 리다이렉트
      navigate("/join");
    }
  }, [location, navigate]);

  return <div>Redirecting...</div>;
};

export default LoginRedirect;
