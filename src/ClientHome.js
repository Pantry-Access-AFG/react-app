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
import {
  collection,
  getDocs,
  addDoc,
  doc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { auth } from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

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
  let [item, setItem] = React.useState("");
  let [quantity, setQuantity] = React.useState(0);
  let [clientNotes, setClientNotes] = React.useState("");

  /**
   * Function to handle the request and submitting a request
   */
  const handleMakeRequest = () => {
    if (item && quantity > 0) {
      makeRequest(clientID, item, quantity, clientNotes);
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
  itemList,
  wantedItemList,
  foodPantryZipCode,
}) {
  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth={true} p>
        <DialogTitle>{foodPantryName}</DialogTitle>
        <DialogContent>
          <DialogContentText>{foodPantryZipCode}</DialogContentText>
          <DialogContentText>{foodPantryDescription}</DialogContentText>
          <DialogContentText>
            Available Items:{" "}
            {itemList.map((element, index) => {
              if (index != itemList.length - 1) {
                return element + ", ";
              } else {
                return element + ".";
              }
            })}
          </DialogContentText>
          <DialogContentText>
            Requesting Donations:{" "}
            {wantedItemList.map((element, index) => {
              if (index !== itemList.length - 1) {
                return element + ", ";
              } else {
                return element + ".";
              }
            })}
          </DialogContentText>
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
  // React States
  const [foodPantries, setFoodPantries] = useState([
    ["Food Pantry A", "01650", "Food Pantry A is a Food Pantry"],
    ["Food Pantry B", "01772", "Food Pantry B is a Food Pantry"],
  ]);
  const [user, loading, error] = useAuthState(auth);
  const [clientName, setClientName] = useState("");
  const [pantryName, setPantryName] = useState("");
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [learnMoreDialogOpen, setLearnMoreDialogOpen] = useState(false);
  const [foodPantryID, setFoodPantryID] = useState(0);
  const [indexClicked, setIndexClicked] = useState(0);
  const [itemList, setItemList] = useState([]);
  const [wantedItemList, setwantedItemList] = useState([]);

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
          doc.id,
        ]);
      });
      if (foodPantryData) {
        setFoodPantries(foodPantryData);
      }
    };
    fetchData();
  }, []);

  /**
   * Retrive items of pantry from Firebase to be displayed in Food Bank Cards
   */
  useEffect(() => {
    const fetchData = async () => {
      await onSnapshot(doc(db, "inventory", foodPantryID), (doc) => {
        if (doc.exists()) {
          setItemList(doc.data()["itemList"]);
          setwantedItemList(doc.data()["wantedItemList"]);
        } else {
          console.log("Nothing!");
        }
      });
      await onSnapshot(doc(db, "food-bank-accounts", foodPantryID), (doc) => {
        if (doc.exists()) {
          setPantryName(doc.data()["name"]);
        } else {
          console.log("Nothing!");
        }
      });
    };
    fetchData();
  }, [foodPantryID]);

  useEffect(() => {
    if (user) {
      const getName = async () => {
        let docRef = doc(db, "client-accounts", user.uid);
        let docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setClientName(docSnap.data().full_name? docSnap.data().full_name : "");
        }
      };
      getName();
    }
  }, [user]);

  /**
   * @param index of the food bank to be requested from
   * Sets index to be index clicked and opens dialog for requesting foods
   */
  const onRequestClick = (index) => {
    setIndexClicked(index);
    setFoodPantryID(foodPantries[index][3]);
    setRequestDialogOpen(true);
  };

  /**
   * @param index of food bank to be learned more about
   * Sets index to be index clicked
   */
  const onLearnMoreClick = (index) => {
    setIndexClicked(index);
    setFoodPantryID(foodPantries[index][3]);
    setLearnMoreDialogOpen(true);
  };

  /**
   * Function to update a request and send it to the requests collection in Firebase Firestore
   */
  const makeRequest = (clientID, item, quantity, clientNotes) => {
    const request = {
      clientUID: user ? user.uid : 0,
      clientName: clientName,
      pantryName: pantryName,
      foodPantryUID: foodPantryID ? foodPantryID : 0,
      clientNotes: clientNotes ? clientNotes : "",
      foodPantryNotes: "",
      item: item,
      quantity: parseInt(quantity),
      status: 1,
      date:
        String(new Date().getMonth() + 1) +
        "-" +
        String(new Date().getDate()) +
        "-" +
        String(new Date().getFullYear()),
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

  // process food bank cards and load them
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
      <h1 className="text-center" style={{ marginTop: "1rem" }}>
        Food Pantries Near You
      </h1>
      {food_bank_list}
      <MakeRequestDialog
        open={requestDialogOpen}
        handleClose={() => setRequestDialogOpen(false)}
        makeRequest={makeRequest}
        foodPantryName={temp[indexClicked][0]}
      ></MakeRequestDialog>
      <LearnMoreDialog
        open={learnMoreDialogOpen}
        handleClose={() => setLearnMoreDialogOpen(false)}
        foodPantryName={temp[indexClicked][0]}
        foodPantryDescription={temp[indexClicked][2]}
        foodPantryZipCode={temp[indexClicked][1]}
        itemList={itemList}
        wantedItemList={wantedItemList}
      ></LearnMoreDialog>
    </>
  );
}
