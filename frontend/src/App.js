import './App.css';
import './assets/css/common.css'
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Main from './pages/Main';
import Footer from './components/Footer';
import Join from './pages/Join'
import JoinInfo from './pages/JoinInfo'
import RecipeMain from './pages/RecipeMain';
import Receipt from './pages/Receipt';

function App() {

  const location = useLocation();

  return (
    <div>
      {/* Join 페이지에서는 Header가 보이지 않도록 설정 */}
      {location.pathname !== '/join' && <Header/>}

      <Routes>
        <Route path='/' element={<Main/>}></Route>
        <Route path='/join' element={<Join/>}></Route>
        <Route path='/joinInfo' element={<JoinInfo/>}></Route>
        <Route path='/recipeMain' element={<RecipeMain/>}></Route>
        <Route path='/receipts' element={<Receipt/>}></Route>
      </Routes>

      {location.pathname !== '/join' && <Footer/>}
    </div>
  );
}

export default App;
