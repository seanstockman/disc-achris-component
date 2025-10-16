import logo from './logo.svg';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import FormPage from './pages/FormPage';
// import Navbar from './components/navbar'; // spaghetti code makes this work
// import "./components/navbar.css";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to ="/">Home</Link> | <Link to ="/map">Developer Map</Link>  | <Link to ="/form">VAHR Form Automation</Link> | <a href="https://taungurung.com.au" target="_blank" rel="noreferrer">Taungurung Land and Water Council Home</a>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/form" element={<FormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
