import logo from './logo.svg';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import FormPage from './pages/FormPage';
import Navbar from './components/navbar'; // spaghetti code makes this work

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to ="/">Home</Link> | <Link to ="/map">Developer Map</Link>  | <Link to ="/form">VAHR Form Automation</Link> | <Link to="https://taungurung.com.au/">Taungurung Land and Water Council Home</Link>
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
