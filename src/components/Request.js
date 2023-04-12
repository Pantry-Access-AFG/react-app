
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Chip } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Grid from '@mui/material/Grid'; // Grid version 1
//import EditRequest from './EditRequest'
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';

/**
 * Makes a request for the my requests page.
 * @returns the navigation bar
 */
export default function Request({ item, requestStatus, date, quantity, foodPantryName, index, editRequestsClick, clientNotes, pantryNotes}) {
  const navigate = useNavigate();
  const location = useLocation();

  // console.log({clientNotes});
  // console.log({pantryNotes});

  //from Home
  // const [open, setOpen] = useState(false);
  // const [editOpen, setEditOpen] = useState(false);
  // const [editIndex, setEditIndex] = useState(0);
  // const [item, setItem] = useState("");
  // const [quantity, setQuantity] = useState(0);
  const [editId, setEditId] = useState(0);


  //0 is fulfilled, 1 is pending, 2 is cancelled, 3 is accepted
  //const [requestNum, requestStatus, date, quantity, foodPantryName] = [0, 1, "Date", 7, "Food Pantry W"]; //change to use props/query
  let requestStatusStr; //the string for the request status
  let requestStatusColor; //the class name for styling the request button
  // const handleEdit = () => {
  //   return <EditRequest></EditRequest>;
  // }


  switch (requestStatus) {
    case 0:
      {
        requestStatusStr = "Fulfilled";
        requestStatusColor = "lightgreen";
        break;
      }
    case 1:
      {
        requestStatusStr = "Pending";
        requestStatusColor = "#fdff93";
        break;
      }
    case 2:
      {
        requestStatusStr = "Cancelled";
        requestStatusColor = "lightcoral";
        break;
      }
    case 3:
      {
        requestStatusStr = "Accepted";
        requestStatusColor = "lightskyblue";
        break;
      }
    default:
      requestStatusStr = "";
      requestStatusColor = "";
  }

  return (
    <div className="gray-bottom-border">
      <Grid container
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={4}>
          <p className="align-text-left">{item}</p>
        </Grid>
        <Grid item xs={4}>
          <div className="chip-container">
            <Chip style={{ backgroundColor: requestStatusColor }} label={requestStatusStr} /> 
          </div>
        </Grid>
        <Grid item xs={4}>
          <p className="align-text-right">{date}</p>
        </Grid>
      </Grid>

      <Grid container alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={4}>
          <p className="align-text-left">x {quantity}</p>
        </Grid>
        <Grid item xs={4}>
          <p className="align-text-center">{foodPantryName}</p>
        </Grid>
        <Grid item xs={4}>
          {requestStatus === 1 ? <IconButton className="centered" aria-label="edit"
            size="large"
            variant="contained"
            onClick={() => editRequestsClick(index)}
          >
            <EditIcon />
          </IconButton> : <div></div>}
        </Grid>
      </Grid>
    </div>
  );
}
