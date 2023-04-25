import Request from './components/Request';
import RequestsHeader from './components/RequestsHeader';
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";
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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Chip } from "@mui/material";
import { db } from "./firebase-config";
import { doc, updateDoc, onSnapshot, query, where, collection } from "firebase/firestore";

// import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

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


    //TODO replace with actual array
    const [requests, setRequests] = useState([]);

    const signedInUser = ""

    const requestsRef = collection(db, "requests")
    const q = query(requestsRef, where("foodPantryUID", "==", 238408934)); //TODO CHANGE PANTRYUID TO ACTUAL UID
    

    useEffect(() => {
        
            onSnapshot(q,
                querySnapshot => {
                    const requestsArr = [];
                    querySnapshot.forEach((doc) => {
                        requestsArr.push({
                            item: doc.data().item,
                            requestStatus: doc.data().requestStatus,
                            date: "oldDate",
                            //date: doc.data().date.toDate().toDateString(), //TODO CHANGE WHEN DATE IMPLEMENTED
                            quantity: 2,
                            foodPantryName: doc.data().foodPantryName,
                            clientNotes: doc.data().clientNotes,
                            pantryNotes: doc.data().pantryNotes,
                            id: doc.id
                        }
                            );
                    
                    });
                    console.log(requestsArr);
                    setRequests(requestsArr);
                    // (doc) => { //TODO CHANGE PANTRYUID TO ACTUAL UID
                    // if (doc.exists()) {
                    //   setItemList(doc.data()["itemList"]);
                    //   setQuantityList(doc.data()["quantityList"]);
                    // } else {
                    //   console.log("Nothing!");
                    // }
                });
        
    }, []);

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
        setEditOpen(true);
    };

    let requestsArrayUI = requests.map((request, index) => <Request key={request.toString()}
        item={request.item}
        requestStatus={request.requestStatus}
        date={request.date}
        quantity={request.quantity}
        foodPantryName={request.foodPantryName}
        index={index}
        editRequestsClick={editRequestsClick}
        requests={requests}
        clientNotes={request.clientNotes}
        pantryNotes={request.pantryNotes}
    ></Request>);

    let pendingRequestsUI = requests.filter(request => request.requestStatus===1).map((request, index) => <Request key={request.toString()}
    item={request.item}
    requestStatus={request.requestStatus}
    date={request.date}
    quantity={request.quantity}
    foodPantryName={request.foodPantryName}
    index={index}
    editRequestsClick={editRequestsClick}
    requests={requests}
    clientNotes={request.clientNotes}
    pantryNotes={request.pantryNotes}
></Request>);
    return (
        <div style={{ marginLeft: "16px", marginRight: "16px" }}>
            <RequestsHeader title="Pending Requests" />
            {requestsArrayUI}
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
            <MoreVertIcon fontSize="large" style={{ marginRight: "auto", marginLeft: "auto", marginTop: "10px", display: "block", color: "darkgray" }} />
            <RequestsHeader title="Past Requests" />
            {/* TODO add past request array here! */}
            {requestsArrayUI}
            <MoreVertIcon fontSize="large" style={{ marginRight: "auto", marginLeft: "auto", marginTop: "10px", display: "block", color: "darkgray" }} />
        </div>

    )

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
        defaultRequestStatus = requests[index].pantryNotes;
    }

    // if (rows.length > 0) {
    //   defaultItem = rows[index].col1;
    //   defaultQuantity = rows[index].col2;
    // }

    const handleEditItem = () => {
        // if (!item) setItem(defaultItem);
        // if (!quantity) setQuantity(defaultQuantity);
        if (!pantryNotes) setPantryNotes(defaultPantryNotes);
        if (!requestStatus) setRequestStatus(defaultRequestStatus);
        if (pantryNotes && requestStatus) {
            // console.log(item)
            // setRows((rows) =>
            //   rows
            //     .slice(0, index)
            //     .concat({ id: id, col1: item, col2: quantity })
            //     .concat(rows.slice(index + 1, rows.length))
            // );
            //updates the requests when the item has been edited
            // setRequests((requests) => requests
            //     .slice(0, index)
            //     .concat({
            //         item: item,
            //         requestStatus: requestStatus,
            //         date: "new date", //TODO change to updated date
            //         quantity: quantity,
            //         foodPantryName: foodPantryName,
            //         clientNotes: clientNotes,
            //         pantryNotes: pantryNotes
            //     })
            //     .concat(requests.slice(index + 1, requests.length)))
            var ref = doc(db, "requests", requests[index].id);
            
            updateDoc(ref, {
                item: item,
                requestStatus: requestStatus,
                date: "new date", //TODO change to updated date
                quantity: quantity,
                foodPantryName: foodPantryName,
                clientNotes: clientNotes,
                pantryNotes: pantryNotes
            })
            
        }
        handleEditClose();
    };

    return (
        <>
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Request</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>Edit Item</DialogContentText> */}

                    <DialogContentText style={{ fontSize: "small", marginTop: "8px" }}>
                        Foodbank Name
                    </DialogContentText>
                    <DialogContentText style={{ color: "black" }}>
                        {foodPantryName}
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
                                console.log(event.target.value);
                                if (!event.target.value) return defaultPantryNotes;
                                else return event.target.value;
                            });
                        }}
                    />
                    {/* from https://mui.com/material-ui/react-select/ */}
                    <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <FormControl sx={{ m: 1, minWidth: 120 }} fullWidth style={{ marginTop: "8px" }}>
                            <InputLabel id="demo-simple-select-label">Request Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="requestEdit"
                                value={requestStatus}
                                label="Request Status"
                                onChange={(event) => {
                                    setRequestStatus(() => {
                                        console.log(event.target.value);
                                        if (!event.target.value) return defaultRequestStatus;
                                        else return event.target.value;
                                    });
                                }}
                            >
                                <MenuItem value={1}>
                                    <div className="chip-container">
                                        <Chip style={{ backgroundColor: "#fdff93", fontSize: "large" }} label="Pending" />
                                    </div>
                                </MenuItem>
                                <MenuItem value={2}>
                                    <div className="chip-container">
                                        <Chip style={{ backgroundColor: "lightskyblue", fontSize: "large" }} label="Accepted" />
                                    </div>
                                </MenuItem>
                                <MenuItem value={3}>
                                    <div className="chip-container">
                                        <Chip style={{ backgroundColor: "lightgreen", fontSize: "large" }} label="Fulfilled" />
                                    </div>
                                </MenuItem>
                                <MenuItem value={4}>
                                    <div className="chip-container">
                                        <Chip style={{ backgroundColor: "lightcoral", fontSize: "large" }} label="Cancelled" />
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