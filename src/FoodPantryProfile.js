import React from "react";
import blank_profile_pic from "./images/blankprofilepic.png";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import "./FoodPantryProfile.css";
import { useState } from "react";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

/**
 * Page for Food Pantry Profiles
 * @returns Component for Food Pantry Profile page
 */

// TODO: Integrate with Firebase authentication and create more conditionals for checking and confirmation dialogs

export default function FoodPantryProfile() {
  let food_pantry_name = "Food Pantry X";

  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [zipcode, setZipcode] = useState("");

  // Delete account function to reset all values and remove user from database (TBD)
  const deleteAccount = () => {
    setUsername("");
    setPassword("");
    setZipcode("");
  };

  // Set username listener
  const handleSetUsername = (x) => {
    setUsername(x);
    // firebase
  };

  // Set password listener
  const handleSetPassword = (x) => {
    setPassword(x);
  };

  // Set zipcode listener
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

      {/* Delete account button*/}
      <Box textAlign="center">
        <Button variant="outlined" color="error" onClick={deleteAccount}>
          Delete Account
        </Button>

        <Alert
          sx={{ width: "50%",'& .MuiAlert-message':{textAlign:"center", width:"inherit"}}}
          severity="error"
        >
          Deleting your account is permanent.
        </Alert>
      </Box>
    </>
  );
}

/**
 * Function for creating userinfo component (to be replaced with MUI?)
 * @returns Component for User Info boxes
 */
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
  };;

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
      <Grid container spacing={2}>
        <Grid item xs={4} />
        <Grid item xs={2}></Grid>
        <Grid item xs={2}>
          <TextField
            autoFocus
            required
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            onChange={usernameChange}
            onSubmit={usernameSubmit}
          />
        </Grid>
        <Grid item xs={4} />
      </Grid>

      <div className="row"></div>
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
