import Request from './components/Request';
import RequestsHeader from './components/RequestsHeader';
import React from "react";
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

export default function MyRequests(props) {
    // States for form dialog
    const [editOpen, setEditOpen] = useState(false);
    let [editIndex, setEditIndex] = useState(0);
    let [item, setItem] = useState("");
    let [quantity, setQuantity] = useState(0);
    let [foodPantryName, setFoodPantryName] = useState(0);
    let [editId, setEditId] = useState(0);

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
    setQuantity(0);
  };

    //TODO replace with actual array
    const [requests, setRequests] = useState([{
        item: "potato", 
        requestStatus: 0, 
        date: 34, 
        quantity: 2, 
        foodPantryName: "Food Pantry W"
    }, {
        item: "corn", 
        requestStatus: 0, 
        date: 34, 
        quantity: 2, 
        foodPantryName: "Food Pantry W"
    }, {
        item: "wheat", 
        requestStatus: 0, 
        date: 34, 
        quantity: 2, 
        foodPantryName: "Food Pantry W"
    }]);

    const editRequestsClick = (index) => {
        setEditIndex(index);
        // setEditId(requests[index].id);
        setItem(requests[index].item);
        setQuantity(requests[index].quantity);
        setFoodPantryName(requests[index].foodPantryName);

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
    ></Request>);
    return (
        <div style={{ marginLeft: "16px", marginRight: "16px" }}>
            <RequestsHeader />
            {requestsArrayUI}
            <EditRequestDialog editOpen={editOpen}
                item={item}
                setItem={setItem}
                quantity={quantity}
                setQuantity={setQuantity}
                handleEditClose={handleEditClose}
                index={editIndex}
                insertItem={() => { }}
                requests={requests}
                setRequests={setRequests}
                foodPantryName={foodPantryName}
                setFoodPantryName={setFoodPantryName}
                id={6}
            />
        </div>

    )

}



function EditRequestDialog({
    editOpen,
    item,
    setItem,
    quantity,
    setQuantity,
    handleEditClose,
    index,
    requests,
    setRequests,
    foodPantryName,
    setFoodPantryName,
    id,
}) {

    let defaultFoodPantryName = "";
    let defaultItem = "";
    let defaultQuantity = 0;
    let defaultNotes = "";

    //TODO integrate w/ firebase
    if (requests.length > 0) {
        defaultFoodPantryName = requests[index].foodPantryName;
        defaultItem = requests[index].item;
        defaultQuantity = requests[index].quantity;
        defaultNotes = requests[index].notes;
      }

    // if (rows.length > 0) {
    //   defaultItem = rows[index].col1;
    //   defaultQuantity = rows[index].col2;
    // }

    const handleEditItem = () => {
        if (!item) setItem(defaultItem);
        if (!quantity) setQuantity(defaultQuantity);
        if (item && quantity > 0) {
            // setRows((rows) =>
            //   rows
            //     .slice(0, index)
            //     .concat({ id: id, col1: item, col2: quantity })
            //     .concat(rows.slice(index + 1, rows.length))
            // );
            //updates the requests when the item has been edited
            setRequests((requests) => requests
            .slice(0, index)
            .concat({item: item, 
                requestStatus: 1, 
                date: "new date", 
                quantity: quantity, 
                foodPantryName: foodPantryName})
            .concat(requests.slice(index+1, requests.length)))
        }
        handleEditClose();
    };

    return (
        <>
            <Dialog open={editOpen} onClose={handleEditClose}>
                <DialogTitle>Edit Request</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>Edit Item</DialogContentText> */}
                    <TextField
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
                    />
                    <TextField
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
                                console.log(event.target.value);
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
                                console.log(event.target.value);
                                if (event.target.value === 0) return defaultQuantity;
                                else return event.target.value;
                            });
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="notesEdit"
                        label="Additional Notes"
                        type="text"
                        fullWidth
                        variant="standard"
                        defaultValue={defaultNotes}
                        onChange={(event) => {
                            setItem(() => {
                                console.log(event.target.value);
                                if (!event.target.value) return defaultNotes;
                                else return event.target.value;
                            });
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditItem}>Update</Button>
                    <Button onClick={handleEditClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}