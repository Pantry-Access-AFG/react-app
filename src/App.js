import "./App.css";
import Header from "./components/Header";

import { Routes, Route, BrowserRouter  } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./Login";
import React from "react";
import FoodPantryProfile from "./FoodPantryProfile";
import Request from "./components/Request"
import Home from "./Home";
import Footer from "./components/Footer";


function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <NavBar></NavBar>

      <Routes>
        <Route path="/" element={<Home></Home>}/>
        <Route path="/profile"index element={<FoodPantryProfile></FoodPantryProfile>}/>
        <Route path="/myrequests" element={<Request></Request>} />
        <Route path="/login" element={<Login></Login>} />
      </Routes>

      <Footer></Footer>
    </BrowserRouter>
  );
}

export default App;
