import React from "react";
import FoodBankCard from "./components/FoodBankCard";
import { useState } from "react";

const onRequestClick = () => {};

export default function ClientHome() {
  let [foodPantries] = useState([
    ["Food Pantry A", "01650"],
    ["Food Pantry B", "01772"],
  ]);

  let temp = foodPantries.slice();
  temp = temp.map((x) => (
    <FoodBankCard
      foodBankName={x[0]}
      zipCode={x[1]}
      distanceAway="5mi"
      onRequestClick={onRequestClick}
    ></FoodBankCard>
  ));

  return (
    <>
      <p className="text-center">...client side in development below...</p>
      <h1 className="text-center" style={{ marginTop: "1rem" }}>
        Food Pantries Near You
      </h1>
      {
        //<FoodBankCard foodBankName={"Food Pantry X"} zipCode="01650" distanceAway="5mi" onRequestClick={onRequestClick}></FoodBankCard>
      }
      {temp}
    </>
  );
}
