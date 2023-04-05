import React from "react";
import FoodBankCard from "./components/FoodBankCard";
import { useState } from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

/**
 * Creates a form for clients to request items from Food Pantries
 * @returns Form component
 */
function MakeRequestDialog({
  open,
  handleClose,
  makeRequest,
  foodPantryName,
  foodPantryID,
  clientID,
}) {
  /**
   * Function to handle inserting items into the DataGrid
   */

  let [item, setItem] = React.useState("");
  let [quantity, setQuantity] = React.useState(0);

  /**
   * Function to handle the request and submitting a request
   */
  const handleMakeRequest = () => {
    if (item && quantity > 0) {
      makeRequest({ clientID, foodPantryID, item, quantity });
      handleClose();
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Make Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Make a food request to {foodPantryName}
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="itemName"
            label="Item Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => {
              setItem(event.target.value);
            }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="itemQuantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            onChange={(event) => {
              setQuantity(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setItem("");
              setQuantity(0);
              handleMakeRequest(item, quantity);
            }}
          >
            Insert
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/**
 * Creates a list of Food Bank Card components
 * Contains states for opening dialogs and tracking which place was requested from
 * @returns Client Home Page
 */
export default function ClientHome() {
  let [foodPantries, setFoodPantries] = useState([
    ["Food Pantry A", "01650"],
    ["Food Pantry B", "01772"],
  ]);

  let [open, setOpen] = useState(false);
  let [foodPantryID, setFoodPantryID] = useState(0);
  let [indexClicked, setIndexClicked] = useState(0);

  /**
   * @param index of the food bank to be requested from
   * Sets index to be index cliekced and opens dialog for requesting foods
   */
  const onRequestClick = (index) => {
    console.log(index);
    setIndexClicked(index);
    setFoodPantryID(index);
    setOpen(true);
  };

  /**
   * TODO: What happens when request is made --> send to firebase
   */
  const makeRequest = (item, quantity) => {
    console.log(item, quantity);
  };

  let temp = foodPantries.slice();
  let food_bank_list = temp.map((x, index) => (
    <FoodBankCard
      key={index}
      id={index}
      foodBankName={x[0]}
      zipCode={x[1]}
      distanceAway="5"
      onRequestClick={onRequestClick}
    ></FoodBankCard>
  ));

  return (
    <>
      <p className="text-center">...client side in development below...</p>
      <h1 className="text-center" style={{ marginTop: "1rem" }}>
        Food Pantries Near You
      </h1>
      {food_bank_list}
      <MakeRequestDialog
        open={open}
        handleClose={() => setOpen(false)}
        makeRequest={makeRequest}
        foodPantryID={foodPantryID}
        foodPantryName={temp[indexClicked][0]}
      ></MakeRequestDialog>
    </>
  );
}
