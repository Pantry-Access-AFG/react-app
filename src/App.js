import logo from './logo.svg';
import './App.css';
import { Routes, Route, BrowserRouter} from "react-router-dom"
import NavBar from './components/NavBar';
import React from 'react';

function App() {
  return (
    
    <BrowserRouter>
      <NavBar></NavBar>
      <Routes>
        <Route path="/" element={<p>Lorem ipsum dolor</p>}/>
        <Route path="/profile"index element={<p>Profile page</p>} />
        <Route path="/myrequests" element={<p>Request page</p>} />
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
