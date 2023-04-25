import React from "react";
import FoodBankCard from "./components/FoodBankCard";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { db } from "./firebase-config";
import { collection, getDocs, addDoc } from "firebase/firestore";


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
  let [clientNotes, setClientNotes] = React.useState("");

  /**
   * Function to handle the request and submitting a request
   */
  const handleMakeRequest = () => {
    if (item && quantity > 0) {
      makeRequest(clientID, foodPantryID, item, quantity, clientNotes);
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
          <TextField
            autoFocus
            margin="dense"
            id="clientNotes"
            label="Notes to Food Pantry"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => {
              setClientNotes(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleMakeRequest();
              setItem("");
              setQuantity(0);
              setClientNotes("");
            }}
          >
            Make Request
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/**
 * 
 * @param {open, handleClose, foodBankName, foodPantryDesription, foodPantryID} parameters to describe the food bank to be described
 * @returns a dialog that shows the user more about the food pantry in question
 */
function LearnMoreDialog({
  open,
  handleClose,
  foodPantryName,
  foodPantryDescription,
  foodPantryID,
  foodPantryZipCode,
}) {
  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth={true} p>
        <DialogTitle>{foodPantryName}</DialogTitle>
        <DialogContent>
          <DialogContentText>{foodPantryZipCode}</DialogContentText>
          <DialogContentText>{foodPantryDescription}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Back</Button>
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
    ["Food Pantry A", "01650", "Food Pantry A is a nonprofit"],
    ["Food Pantry B", "01772", "Food Pantry B is CollegeBoard"],
  ]);

  /**
   * Retrieve food pantries (in food-bank-accounts collection) from Firebase
   */
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "food-bank-accounts"));
      let foodPantryData = [];
      querySnapshot.forEach((doc) => {
        foodPantryData.push([
          doc.data()["name"],
          doc.data()["zipcode"],
          doc.data()["description"],
        ]);
      });
      setFoodPantries(foodPantryData);
    };
    fetchData();
  }, []);

  let [requestDialogOpen, setRequestDialogOpen] = useState(false);
  let [learnMoreDialogOpen, setLearnMoreDialogOpen] = useState(false);
  let [foodPantryID, setFoodPantryID] = useState(0);
  let [indexClicked, setIndexClicked] = useState(0);

  /**
   * @param index of the food bank to be requested from
   * Sets index to be index clicked and opens dialog for requesting foods
   */
  const onRequestClick = (index) => {
    setIndexClicked(index);
    setFoodPantryID(index);
    setRequestDialogOpen(true);
  };

  /**
   * @param index of food bank to be learned more about
   * Sets index to be index clicked
   */
  const onLearnMoreClick = (index) => {
    setIndexClicked(index);
    setFoodPantryID(index);
    setLearnMoreDialogOpen(true);
  };

  /**
   * TODO: What happens when request is made --> send to firebase
   */
  const makeRequest = (clientID, pantryID, item, quantity, clientNotes) => {
    const request = {
      clientUID: 3480242,
      foodPantryUID: 238408934,
      clientNotes: clientNotes ? clientNotes : null,
      foodPantryNotes: null,
      item: item,
      quantity: quantity,
      status: 0,
    };
    const sendRequest = async (request) => {
      await addDoc(collection(db, "requests"), request)
        .then((docRef) => {
          console.log("Document has been added successfully");
        })
        .catch((error) => {
          console.log(error);
        });
      setRequestDialogOpen(false);
    };
    sendRequest(request);
  };

  //process food bank cards and load them
  let temp = foodPantries.slice();
  let food_bank_list = temp.map((x, index) => (
    <FoodBankCard
      key={index}
      id={index}
      foodBankName={x[0]}
      zipCode={x[1]}
      distanceAway="5"
      onRequestClick={onRequestClick}
      onLearnMoreClick={onLearnMoreClick}
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
        open={requestDialogOpen}
        handleClose={() => setRequestDialogOpen(false)}
        makeRequest={makeRequest}
        foodPantryID={foodPantryID}
        foodPantryName={temp[indexClicked][0]}
      ></MakeRequestDialog>
      <LearnMoreDialog
        open={learnMoreDialogOpen}
        handleClose={() => setLearnMoreDialogOpen(false)}
        foodPantryName={temp[indexClicked][0]}
        foodPantryID={foodPantryID}
        foodPantryDescription={temp[indexClicked][2]}
        foodPantryZipCode={temp[indexClicked][1]}
      ></LearnMoreDialog>
    </>
  );
}
