import React from "react";
import blank_profile_pic from "./images/blankprofilepic.png";
import UserInfo from "./components/UserInfo";

export default function FoodPantryProfile() {
  let food_pantry_name = "Food Pantry X";

  return (
    <>
      <img
        src={blank_profile_pic}
        alt="blankprofilepic"
        className="profile-image"
      ></img>
      <h1 className="center">{food_pantry_name}</h1>
      <hr className="gray-line" />
      <UserInfo />
    </>
  );
}
