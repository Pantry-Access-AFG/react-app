import "./App.css";
import Header from "./components/Header";

import { Routes, Route, BrowserRouter  } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./Login";
import React from "react";
import FoodPantryProfile from "./FoodPantryProfile";
import Home from "./Home";

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <NavBar></NavBar>

      <Routes>
        <Route path="/" element={<Home></Home>} />
        <Route
          path="/profile"
          index
          element={<FoodPantryProfile></FoodPantryProfile>}
        />
        <Route path="/myrequests" element={<p>Request page</p>} />
        <Route path="/login" index element={<Login></Login>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
