import React from "react";
import blank_profile_pic from "./images/blankprofilepic.png";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import "./FoodPantryProfile.css";
import { useState } from "react";

export default function FoodPantryProfile() {
  let food_pantry_name = "Food Pantry X";

  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [zipcode, setZipcode] = useState("");

  const deleteAccount = () => {
    setUsername("");
    setPassword("");
    setZipcode("");
  };

  const handleSetUsername = (x) => {
    setUsername(x);
    // firebase
  };

  const handleSetPassword = (x) => {
    setPassword(x);
  };

  const handleSetZipcode = (x) => {
    setZipcode(x);
  };

  return (
    <>
      <img
        src={blank_profile_pic}
        alt="blankprofilepic"
        className="profile-image img-center"
      ></img>
      <h1 className="text-center">{food_pantry_name}</h1>

      <hr className="gray-line" />
      <UserInfo
        username={username}
        password={password}
        zipcode={zipcode}
        setUsername={handleSetUsername}
        setPassword={handleSetPassword}
        setZipcode={handleSetZipcode}
      />
      <br></br>

      {/* <button onClick={deleteAccount} className="delete-account-button">
        Delete Account
      </button> */}
      <Box textAlign="center">
        <Button variant="outlined" color="error" onClick={deleteAccount}>
          Delete Account
        </Button>
      </Box>
    </>
  );
}

function UserInfo({
  username,
  password,
  zipcode,
  setUsername,
  setPassword,
  setZipcode,
}) {
  const usernameChange = (event) => {
    console.log("changed username");
  };

  const usernameSubmit = (event) => {
    event.preventDefault();
    setUsername(event.target.value);
    console.log("submitted new username");
  };

  const passwordChange = (event) => {
    console.log("password changed");
  };

  const passwordSubmit = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
    console.log("password submitted");
  };

  const zipcodeChange = (event) => {
    console.log("zipcode changed");
  };

  const zipcodeSubmit = (event) => {
    event.preventDefault();
    setZipcode(event.target.value);
    console.log("zipcode submitted");
  };

  return (
    <div>
      <div className="row">
        <p className="row">Username:</p>
        <form className="row" onSubmit={usernameSubmit}>
          <input type="text" onChange={usernameChange} />
        </form>
      </div>
      <div className="row">
        <p className="row">Password:</p>
        <form className="row" onSubmit={passwordSubmit}>
          <input type="text" onChange={passwordChange} />
        </form>
      </div>
      <div className="row">
        <p className="row">Zipcode:</p>
        <form className="row" onSubmit={zipcodeSubmit}>
          <input type="text" onChange={zipcodeChange} />
        </form>
      </div>
    </div>
  );
}
