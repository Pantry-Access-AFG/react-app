import React from "react";
import blank_profile_pic from "./images/blankprofilepic.png";
import "./FoodPantryProfile.css";

export default function FoodPantryProfile() {
  let food_pantry_name = "Food Pantry X";

  const deleteAccount = () => {
    console.log("delete account!");
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
      <UserInfo />
      <br></br>
      <button onClick={deleteAccount()} className="delete-account-button">
        Delete Account
      </button>
    </>
  );
}

function UserInfo() {
  const usernameChange = (event) => {
    console.log("changed username");
  };

  const usernameSubmit = (event) => {
    console.log("submitted new username");
    event.preventDefault();
  };

  const passwordChange = (event) => {
    console.log("password changed");
  };

  const passwordSubmit = (event) => {
    console.log("password submitted");
  };

  const zipcodeChange = (event) => {
    console.log("zipcode changed");
  };

  const zipcodeSubmit = (event) => {
    console.log("zipcode submitted");
  };

  return (
    <div>
      <div className="row">
        <p className="row">Username: </p>
        <form className="row" onSubmit={usernameSubmit}>
          <input type="text" onChange={usernameChange} />
        </form>
      </div>
      <div className="row">
        <p className="row">Password: </p>
        <form className="row" onSubmit={passwordSubmit}>
          <input type="text" onChange={passwordChange} />
        </form>
      </div>
      <div className="row">
        <p className="row">Zipcode: </p>
        <form className="row" onSubmit={zipcodeSubmit}>
          <input type="text" onChange={zipcodeChange} />
        </form>
      </div>
    </div>
  );
}
