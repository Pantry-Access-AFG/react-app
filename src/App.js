import "./App.css";
import Header from "./components/Header";

import { Routes, Route, BrowserRouter} from "react-router-dom"
import NavBar from './components/NavBar';
import React from 'react';
import FoodPantryProfile from "./FoodPantryProfile";
import Request from "./components/Request"

function App() {
  return (
    <BrowserRouter>
    <Header></Header>
      <NavBar></NavBar>
      
      <Routes>
        <Route path="/" element={<p>Lorem ipsum dolor</p>}/>
        <Route path="/profile"index element={<FoodPantryProfile></FoodPantryProfile>}/>
        <Route path="/myrequests" element={<Request></Request>} />
      </Routes>

    


    </BrowserRouter>
  );
}

export default App;
