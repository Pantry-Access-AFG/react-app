import Request from "./components/Request";
import RequestsHeader from "./components/RequestsHeader";
import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase-config";
import {
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase-config";
import { Chip } from "@mui/material";

export default function MyRequests(props) {
  // States for form dialog
  const [editOpen, setEditOpen] = useState(false);
  let [editIndex, setEditIndex] = useState(0);
  let [item, setItem] = useState("");
  let [quantity, setQuantity] = useState(0);
  let [foodPantryName, setFoodPantryName] = useState("");
  let [editId, setEditId] = useState(0);
  let [clientNotes, setClientNotes] = useState("");
  let [pantryNotes, setPantryNotes] = useState("");
  let [clientName, setClientName] = useState("");
  let [requestStatus, setRequestStatus] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [user, loading, error] = useAuthState(auth);

  /**
   * Function for editing a row
   * Edits respective row and reinitializes row array
   */

  /**
   * Function for handling closing the form dialog
   * Makes sure to reset the item and quantity state
   */
  const handleEditClose = () => {
    setEditOpen(false);
    setItem("");
    setClientNotes("");
    setPantryNotes("");
    setQuantity(0);
  };
  const handleDeleteOpen = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };
  const [requests, setRequests] = useState([]);

  const requestsRef = collection(db, "requests");

  let q = null;
  let foodbankRef = null;

  if (user) {
    q = query(requestsRef, where("clientUID", "==", user?.uid));
    foodbankRef = doc(db, "client-accounts", user?.uid);
  }

  useEffect(() => {
    if (q !== null)
      onSnapshot(q, (querySnapshot) => {
        const requestsArr = [];

        querySnapshot.forEach((doc) => {
          requestsArr.push({
            item: doc.data().item,
            requestStatus: doc.data().status,
            date: doc.data().date,
            quantity: doc.data().quantity,
            foodPantryName: doc.data().pantryName ? doc.data().pantryName : "",
            clientName: doc.data().clientName,
            clientNotes: doc.data().clientNotes,
            pantryNotes: doc.data().foodPantryNotes,
            id: doc.id,
          });
        });
        setRequests(requestsArr);
      });
  }, [user]);

  const handleDeleteItem = () => {
    var ref = doc(db, "requests", requests[editIndex].id);

    setEditIndex(0);
    deleteDoc(ref);
    handleDeleteClose();
    handleEditClose();
  };

  const editRequestsClick = (index) => {
    setEditIndex(index);
    setItem(requests[index].item);
    setQuantity(requests[index].quantity);
    setFoodPantryName(requests[index].foodPantryName);
    setClientNotes(requests[index].clientNotes);
    setPantryNotes(requests[index].pantryNotes);
    setEditOpen(true);
    setClientName(requests[index].clientName);
    setRequestStatus(requests[index].requestStatus);
  };


  let pendingRequestsUI = requests
    .filter((request) => request.requestStatus === 1)
    .map((request, index) => (
      <Request
        key={request.id.toString()}
        item={request.item}
        requestStatus={request.requestStatus}
        date={request.date}
        quantity={request.quantity}
        foodPantryName={request.foodPantryName}
        index={requests.indexOf(request)}
        editRequestsClick={editRequestsClick}
        requests={requests}
        clientNotes={request.clientNotes}
        pantryNotes={request.pantryNotes}
      ></Request>
    ));

  let acceptedRequestsUI = requests
    .filter((request) => request.requestStatus === 2)
    .map((request, index) => (
      <Request
        key={request.id.toString()}
        item={request.item}
        requestStatus={request.requestStatus}
        date={request.date}
        quantity={request.quantity}
        foodPantryName={request.foodPantryName}
        index={requests.indexOf(request)}
        editRequestsClick={editRequestsClick}
        requests={requests}
        clientNotes={request.clientNotes}
        pantryNotes={request.pantryNotes}
      ></Request>
    ));

  let pastRequestsUI = requests
    .filter(
      (request) => request.requestStatus === 3 || request.requestStatus === 4
    )
    .map((request, index) => (
      <Request
        key={request.id.toString()}
        item={request.item}
        requestStatus={request.requestStatus}
        date={request.date}
        quantity={request.quantity}
        foodPantryName={request.foodPantryName}
        index={requests.indexOf(request)}
        editRequestsClick={editRequestsClick}
        requests={requests}
        clientNotes={request.clientNotes}
        pantryNotes={request.pantryNotes}
      ></Request>
    ));

  return (
    <div style={{ marginLeft: "16px", marginRight: "16px" }}>
      <RequestsHeader title="Pending Requests" />
      {pendingRequestsUI}
      {pendingRequestsUI.length === 0 ? (
        <MoreVertIcon
          fontSize="large"
          style={{
            marginRight: "auto",
            marginLeft: "auto",
            marginTop: "10px",
            display: "block",
            color: "darkgray",
          }}
        />
      ) : (
        <div />
      )}

      <RequestsHeader title="Accepted Requests" />
      {acceptedRequestsUI}
      {acceptedRequestsUI.length === 0 ? (
        <MoreVertIcon
          fontSize="large"
          style={{
            marginRight: "auto",
            marginLeft: "auto",
            marginTop: "10px",
            display: "block",
            color: "darkgray",
          }}
        />
      ) : (
        <div />
      )}

      <RequestsHeader title="Past Requests" />
      {pastRequestsUI}
      {pastRequestsUI.length === 0 ? (
        <MoreVertIcon
          fontSize="large"
          style={{
            marginRight: "auto",
            marginLeft: "auto",
            marginTop: "10px",
            display: "block",
            color: "darkgray",
          }}
        />
      ) : (
        <div />
      )}

      <EditRequestDialog
        editOpen={editOpen}
        item={item}
        setItem={setItem}
        quantity={quantity}
        setQuantity={setQuantity}
        handleEditClose={handleEditClose}
        index={editIndex}
        clientNotes={clientNotes}
        setClientNotes={setClientNotes}
        insertItem={() => {}}
        pantryNotes={pantryNotes}
        requests={requests}
        requestStatus={requestStatus}
        setRequestStatus={setRequestStatus}
        setRequests={setRequests}
        foodPantryName={foodPantryName}
        setFoodPantryName={setFoodPantryName}
        clientName={clientName}
        handleDeleteOpen={handleDeleteOpen}
        handleDeleteClose={handleDeleteClose}
        id={6}
      />
      <AreYourSureDialog
        handleDeleteItem={handleDeleteItem}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
      />
    </div>
  );
}

function EditRequestDialog({
  editOpen,
  pantryNotes,
  item,
  setItem,
  quantity,
  setQuantity,
  handleEditClose,
  handleDeleteClose,
  index,
  clientNotes,
  setClientNotes,
  requests,
  setRequests,
  foodPantryName,
  requestStatus,
  setRequestStatus,
  clientName,
  setFoodPantryName,
  handleDeleteOpen,
  handleDeleteItem,
  id,
}) {
  // let defaultFoodPantryName = "";
  let defaultItem = "";
  let defaultQuantity = 0;
  let defaultClientNotes = "";

  if (requests.length > 0) {
    defaultItem = requests[index].item;
    defaultQuantity = requests[index].quantity;
    defaultClientNotes = requests[index].clientNotes;
  }

  const handleEditItem = () => {
    var ref = doc(db, "requests", requests[index].id);

    updateDoc(ref, {
      item: item,
      date:
        String(new Date().getMonth() + 1) +
        "-" +
        String(new Date().getDate()) +
        "-" +
        String(new Date().getFullYear()),
        quantity: quantity,
      clientNotes: clientNotes,
    });
    handleEditClose();
  };

  

  let requestStatusStr; //the string for the request status
  let requestStatusColor; //the class name for styling the request button

  switch (requestStatus) {
    case 1: {
      requestStatusStr = "Pending";
      requestStatusColor = "#fdff93";
      break;
    }
    case 2: {
      requestStatusStr = "Accepted";
      requestStatusColor = "lightskyblue";
      break;
    }
    case 3: {
      requestStatusStr = "Fulfilled";
      requestStatusColor = "lightgreen";
      break;
    }
    case 4: {
      requestStatusStr = "Cancelled";
      requestStatusColor = "lightcoral";
      break;
    }
    default:
      requestStatusStr = "";
      requestStatusColor = "";
  }

  return (
    <>
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Request</DialogTitle>

        <DialogContent>
          <div className="chip-container">
            <Chip
              style={{ backgroundColor: requestStatusColor, fontSize: "large" }}
              label={requestStatusStr}
            />
          </div>
          {/* <DialogContentText>Edit Item</DialogContentText> */}
          <DialogContentText style={{ fontSize: "small", marginTop: "8px" }}>
            Client Name
          </DialogContentText>
          <DialogContentText style={{ color: "black" }}>
            {clientName}
          </DialogContentText>

          <DialogContentText style={{ fontSize: "small", marginTop: "8px" }}>
            Foodbank Name
          </DialogContentText>
          <DialogContentText style={{ color: "black" }}>
            {foodPantryName? foodPantryName : ""}
          </DialogContentText>

          {/* <TextField
                        autoFocus
                        margin="dense"
                        id="foodbankEdit"
                        label="Foodbank Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={defaultFoodPantryName}
                        onChange={(event) => {
                            setFoodPantryName(() => {
                                console.log(event.target.value);
                                if (!event.target.value) return defaultFoodPantryName;
                                else return event.target.value;
                            });
                        }}
                    /> */}
           { requestStatus === 2  || requestStatus === 3 || requestStatus === 4 ? <>
           <DialogContentText style={{ fontSize: "small", marginTop: "8px" }}>
            Item Name
          </DialogContentText>
          <DialogContentText style={{ color: "black" }}>
            {item}
          </DialogContentText>
          <DialogContentText style={{ fontSize: "small", marginTop: "8px" }}>
            Quantity
          </DialogContentText>
          <DialogContentText style={{ color: "black" }}>
            {quantity}
          </DialogContentText>
          </> : 
    <><TextField
      autoFocus
      margin="dense"
      id="itemEdit"
      label="Item Name"
      type="text"
      fullWidth
      variant="standard"
      defaultValue={defaultItem}
      onChange={(event) => {
        setItem(() => {
          if (!event.target.value) return defaultItem;
          else return event.target.value;
        });
      }}
    />
    <TextField
      autoFocus
      required
      margin="dense"
      id="quantityEdit"
      label="Quantity"
      type="number"
      fullWidth
      variant="standard"
      defaultValue={defaultQuantity}
      onChange={(event) => {
        setQuantity(() => {
          if (!event.target.value || event.target.value <= 0) return defaultQuantity;
          else return event.target.value;
        });
      }}
    /></>}
          <TextField
            autoFocus
            margin="dense"
            id="notesEdit"
            label="Client Notes"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={defaultClientNotes}
            onChange={(event) => {
              setClientNotes(() => {
                // if (!event.target.value) return defaultClientNotes;
                // else
                return event.target.value;
              });
            }}
          />
          <DialogContentText style={{ fontSize: "small", marginTop: "8px" }}>
            Pantry Notes
          </DialogContentText>
          <DialogContentText style={{ color: "black" }}>
            {pantryNotes}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ marginRight: "auto" }}
            color="error"
            endIcon={<DeleteIcon />}
            onClick={handleDeleteOpen}
          >
            Delete
          </Button>
          <Button onClick={handleEditItem}>Update</Button>
          <Button onClick={handleEditClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function AreYourSureDialog({ deleteOpen, setDeleteOpen, handleDeleteItem }) {
  return (
    <Dialog
      open={deleteOpen}
      // {deleteOpen}
      onClose={() => setDeleteOpen(false)}
    >
      <DialogTitle>Are you sure you want to delete this request?</DialogTitle>
      <DialogContent>
        <DialogContentText>Deleting a request is permanent.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
        <Button
          onClick={() => {
            handleDeleteItem();
            setDeleteOpen(false);
          }}
          autoFocus
          color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
