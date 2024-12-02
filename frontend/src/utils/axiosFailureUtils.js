import store from '../redux/store'
import { userActions } from "../redux/reducers/userSlice";

// 토큰 재발급 실패 처리
export function handleAuthFailure() {
  // Redux 상태 초기화
  store.dispatch(userActions.setUser({ user: null }));

  // 로그인 페이지로 이동
  // window.location.href = "/join";
};

