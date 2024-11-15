import "./App.css";
import "./assets/css/common.css";
import { Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Main from "./pages/Main";
import Footer from "./components/Footer";
import Join from "./pages/Join";
import JoinInfo from "./pages/JoinInfo";
import RecipeMain from "./pages/RecipeMain";
import Receipt from "./pages/Receipt";
import NotFoundPage from "./pages/NotFoundPage";
import RecipeDetail from "./pages/RecipeDetail";
import Mypage from "./pages/Mypage";
import Ingredients from "./pages/Ingredients";
import LoginRedirect from "./pages/LoginRedirect";
import RecipeList from "./pages/RecipeList";
import ScrollToTop from "./components/ScrollToTop";
import { useDispatch, useSelector } from "react-redux";
import { apiAxios } from "./utils/axiosUtils";
import { userActions } from "./redux/reducers/userSlice";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isNoHeaderFooter =
    [
      "/",
      "/join-info",
      "/receipts",
      "/recipe",
      "/mypage",
      "/ingredients",
    ].includes(location.pathname) || location.pathname.startsWith("/recipe/");
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiAxios.get("/users");
        if (res.status === 200) {
          const userIdx = res.data?.userIdx;
          const userName = res.data?.nickname;
          const provider = res.data?.oauthProvider;

          // user 저장
          dispatch(
            userActions.setUser({ user: { userIdx, userName, provider } })
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    // 유저 정보가 없을 때만 fetchUser 호출
    if (!user) {
      fetchUser();
    }
  }, [dispatch, user]);

  // TODO : user.userIdx가 -1인 경우, 정상 정보가 없으므로 accesstoken을 가지고 유저 정보를 서버로부터 가져오기

  return (
    <div>
      {/*페이지 이동 시 브라우저의 스크롤 위치가 항상 페이지 상단으로 초기화 */}
      <ScrollToTop />
      {/* Join 페이지에서는 Header가 보이지 않도록 설정 */}
      {isNoHeaderFooter && <Header user={user} />}

      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/join" element={<Join />}></Route>
        <Route path="/join-info" element={<JoinInfo />}></Route>
        <Route path="/recipe" element={<RecipeMain />}></Route>
        <Route path="/receipts" element={<Receipt />}></Route>
        <Route path="/recipe/:id" element={<RecipeDetail />}></Route>
        <Route path="/mypage" element={<Mypage />}></Route>
        <Route path="/ingredients" element={<Ingredients />}></Route>
        <Route path="/login/callback" element={<LoginRedirect />} />

        <Route path="/recipeList" element={<RecipeList />}></Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {isNoHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
