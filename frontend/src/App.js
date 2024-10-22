import './App.css';
import './assets/css/common.css'
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Main from './pages/Main';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Header></Header>
      <Routes>
        <Route path='/' element={<Main/>}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
