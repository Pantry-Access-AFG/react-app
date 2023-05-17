import Request from "./components/Request";
import RequestsHeader from "./components/RequestsHeader";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Chip } from "@mui/material";
import { db } from "./firebase-config";
import {
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  collection,
} from "firebase/firestore";

// import Box from '@mui/material/Box';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase-config";

export default function MyRequests(props) {
  // States for form dialog
  const [editOpen, setEditOpen] = useState(false);
  let [editIndex, setEditIndex] = useState(0);
  let [item, setItem] = useState("");
  let [quantity, setQuantity] = useState(0);
  let [foodPantryName, setFoodPantryName] = useState(0);
  let [editId, setEditId] = useState(0);
  let [clientNotes, setClientNotes] = useState("");
  let [pantryNotes, setPantryNotes] = useState("");
  let [requestStatus, setRequestStatus] = useState(1);
  let [clientName, setClientName] = useState("");

  const [user, loading, error] = useAuthState(auth);
  const [username, setUsername] = useState("");

  //TODO replace with actual array
  const [requests, setRequests] = useState([]);

  const signedInUser = "";

  const requestsRef = collection(db, "requests");

  let q = null;
  let foodbankRef = null;


  if (user) {
    q = query(requestsRef, where("foodPantryUID", "==", user?.uid));
    foodbankRef = doc(db, "food-bank-accounts", user?.uid);
  }

  useEffect(() => {
    if (user) {
      if (q !== null)
        onSnapshot(q, (querySnapshot) => {
          const requestsArr = [];
          querySnapshot.forEach((doc) => {
            requestsArr.push({
              item: doc.data().item,
              requestStatus: doc.data().status,
              date: doc.data().date,
              quantity: doc.data().quantity,
              foodPantryName: username,
              clientNotes: doc.data().clientNotes,
              pantryNotes: doc.data().foodPantryNotes,
              clientName: doc.data().clientName,
              id: doc.id
            }
            );

          });
          setRequests(requestsArr);
          // (doc) => { //TODO CHANGE PANTRYUID TO ACTUAL UID
          // if (doc.exists()) {
          //   setItemList(doc.data()["itemList"]);
          //   setQuantityList(doc.data()["quantityList"]);
          // } else {
          //   console.log("Nothing!");
          // }
        });
      if (foodbankRef !== null)
        onSnapshot(foodbankRef, snapshot => {
          setUsername(snapshot.data()?.name ? snapshot.data().name : "");
        })
    }
  }, [user, username]);

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
    setRequestStatus(1);
  };

  const editRequestsClick = (index) => {
    setEditIndex(index);
    // setEditId(requests[index].id);
    setItem(requests[index].item);
    setQuantity(requests[index].quantity);
    setFoodPantryName(requests[index].foodPantryName);
    setClientNotes(requests[index].clientNotes);
    setPantryNotes(requests[index].pantryNotes);
    setRequestStatus(requests[index].requestStatus);
    setClientName(requests[index].clientName)
    setEditOpen(true);
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
        foodPantryName={request.clientName}
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
        foodPantryName={request.clientName}
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
        foodPantryName={request.clientName}
        index={requests.indexOf(request)}
        editRequestsClick={editRequestsClick}
        requests={requests}
        clientNotes={request.clientNotes}
        pantryNotes={request.pantryNotes}
      ></Request>
    ));

  // let pendingRequestsUI = requests.filter(request => request.requestStatus===1).map((request, index) => <Request key={request.id.toString()}
  // item={request.item}
  // requestStatus={request.requestStatus}
  // date={request.date}
  // quantity={request.quantity}
  // foodPantryName={request.foodPantryName}
  // index={index}
  // editRequestsClick={editRequestsClick}
  // requests={requests}
  // clientNotes={request.clientNotes}
  // pantryNotes={request.pantryNotes}
  //></Request>);
  return (
    <div style={{ marginLeft: "16px", marginRight: "16px" }}>
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
          clientName={clientName}
          insertItem={() => { }}
          pantryNotes={pantryNotes}
          setPantryNotes={setPantryNotes}
          requests={requests}
          setRequests={setRequests}
          requestStatus={requestStatus}
          setRequestStatus={setRequestStatus}
          foodPantryName={foodPantryName}
          setFoodPantryName={setFoodPantryName}
          id={6}
        />

        {/* <MoreVertIcon fontSize="large" style={{ marginRight: "auto", marginLeft: "auto", marginTop: "10px", display: "block", color: "darkgray" }} />
            <RequestsHeader title="Past Requests" />
            {/* TODO add past request array here! */}
        {/* {requestsArrayUI}
            <MoreVertIcon fontSize="large" style={{ marginRight: "auto", marginLeft: "auto", marginTop: "10px", display: "block", color: "darkgray" }} /> */}
      </div>
    </div>
  );
}

function EditRequestDialog({
  editOpen,
  pantryNotes,
  setPantryNotes,
  item,
  setItem,
  quantity,
  setQuantity,
  handleEditClose,
  index,
  clientNotes,
  setClientNotes,
  requestStatus,
  setRequestStatus,
  requests,
  setRequests,
  foodPantryName,
  clientName,
  setFoodPantryName,
  id,
}) {
  // let defaultFoodPantryName = "";
  // let defaultItem = "";
  // let defaultQuantity = 0;
  // let defaultClientNotes = "";
  let defaultPantryNotes = "";
  let defaultRequestStatus = 1;

  //TODO integrate w/ firebase
  if (requests.length > 0) {
    // defaultFoodPantryName = requests[index].foodPantryName;
    // defaultItem = requests[index].item;
    // defaultQuantity = requests[index].quantity;
    // defaultClientNotes = requests[index].clientNotes;
    defaultPantryNotes = requests[index].pantryNotes;
    defaultRequestStatus = requests[index].status;
  }

  // if (rows.length > 0) {
  //   defaultItem = rows[index].col1;
  //   defaultQuantity = rows[index].col2;
  // }

  const handleEditItem = () => {
    // if (!item) setItem(defaultItem);
    // if (!quantity) setQuantity(defaultQuantity);
    // if (!pantryNotes) setPantryNotes(defaultPantryNotes);
    // if (!requestStatus) setRequestStatus(defaultRequestStatus);
    // if (pantryNotes !== "") {
    var ref = doc(db, "requests", requests[index].id);

    updateDoc(ref, {
      // item: item,
      status: requestStatus,
      date:
        String(new Date().getMonth() + 1) +
        "-" +
        String(new Date().getDate()) +
        "-" +
        String(new Date().getFullYear()),
      // quantity: quantity,
      // clientNotes: clientNotes,
      foodPantryNotes: pantryNotes,
    });

    // }
    handleEditClose();
  };

  return (
    <>
      <Dialog
        PaperProps={{ sx: { width: { xs: "80%", md: "40%" } } }}
        open={editOpen}
        onClose={handleEditClose}
      >
        <DialogTitle>Edit Request</DialogTitle>
        <DialogContent>
          <DialogContentText style={{ fontSize: "small", marginTop: "8px" }}>
            Foodbank Name
          </DialogContentText>
          <DialogContentText style={{ color: "black" }}>
            {foodPantryName}
          </DialogContentText>

          <DialogContentText style={{ fontSize: "small", marginTop: "8px" }}>
            Client Name
          </DialogContentText>
          <DialogContentText style={{ color: "black" }}>
            {clientName}
          </DialogContentText>

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

          <DialogContentText style={{ fontSize: "small", marginTop: "8px" }}>
            Client Notes
          </DialogContentText>
          <DialogContentText style={{ color: "black" }}>
            {clientNotes}
          </DialogContentText>

          <TextField
            autoFocus
            margin="dense"
            id="notesEdit"
            label="Pantry Notes"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={defaultPantryNotes}
            onChange={(event) => {
              setPantryNotes(() => {
                return event.target.value;
              });
            }}
          />
          {/* from https://mui.com/material-ui/react-select/ */}
          <Box component="form" sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControl
              sx={{ m: 1, minWidth: 120 }}
              fullWidth
              style={{ marginTop: "8px" }}
            >
              <InputLabel id="demo-simple-select-label">
                Request Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="requestEdit"
                value={requestStatus}
                label="Request Status"
                onChange={(event) => {
                  setRequestStatus(() => {
                    if (!event.target.value) return defaultRequestStatus;
                    else return event.target.value;
                  });
                }}
              >
                <MenuItem value={1}>
                  <div className="chip-container">
                    <Chip
                      style={{ backgroundColor: "#fdff93", fontSize: "large" }}
                      label="Pending"
                    />
                  </div>
                </MenuItem>
                <MenuItem value={2}>
                  <div className="chip-container">
                    <Chip
                      style={{
                        backgroundColor: "lightskyblue",
                        fontSize: "large",
                      }}
                      label="Accepted"
                    />
                  </div>
                </MenuItem>
                <MenuItem value={3}>
                  <div className="chip-container">
                    <Chip
                      style={{
                        backgroundColor: "lightgreen",
                        fontSize: "large",
                      }}
                      label="Fulfilled"
                    />
                  </div>
                </MenuItem>
                <MenuItem value={4}>
                  <div className="chip-container">
                    <Chip
                      style={{
                        backgroundColor: "lightcoral",
                        fontSize: "large",
                      }}
                      label="Cancelled"
                    />
                  </div>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditItem}>Update</Button>
          <Button onClick={handleEditClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
