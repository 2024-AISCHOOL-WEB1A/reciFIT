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
import RecipeList from "./pages/RecipeList";
import ScrollToTop from "./components/ScrollToTop";


function App() {
  const location = useLocation();

  const isNoHeaderFooter =
    ["/", "/joinInfo", "/receipts", '/recipe', '/mypage', '/ingredients', '/recipeList'].includes(location.pathname) ||
    location.pathname.startsWith("/recipe/");

  return (
    <div>
      <ScrollToTop /> {/*페이지 이동 시 브라우저의 스크롤 위치가 항상 페이지 상단으로 초기화 */}

      <div>
        {console.log(isNoHeaderFooter)}
        {/* Join 페이지에서는 Header가 보이지 않도록 설정 */}
        {isNoHeaderFooter && <Header />}

        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/join" element={<Join />}></Route>
          <Route path="/joinInfo" element={<JoinInfo />}></Route>
          <Route path="/recipe" element={<RecipeMain />}></Route>
          <Route path="/receipts" element={<Receipt />}></Route>
          <Route path="/recipe/:id" element={<RecipeDetail />}></Route>
          <Route path="/mypage" element={<Mypage />}></Route>
          <Route path="/ingredients" element={<Ingredients />}></Route>
          <Route path="/recipeList" element={<RecipeList />}></Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        {isNoHeaderFooter && <Footer />}
      </div>
    </div>
  );
}

export default App;
