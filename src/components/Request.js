import pencil from "../images/pencil.png";
//import {EditIcon} from '@mui/icons-material/Edit';
import EditIcon from '@mui/icons-material/Edit';
import {IconButton, Chip} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Grid from '@mui/material/Grid'; // Grid version 1

/**
 * Makes a request for the my requests page.
 * @returns the navigation bar
 */
export default function Request(props) {
  const navigate = useNavigate();
  const location = useLocation();
  //0 is fulfilled, 1 is pending, 2 is cancelled
  const [requestNum, requestStatus, date, quantity, foodPantryName] = [0, 0, "date", 7, "Food Pantry W"]; //change to use props/query
  let requestStatusStr; //the string for the request status
  let requestStatusClass; //the class name for styling the request button

  switch (requestStatus) {
    case 0:
      {requestStatusStr = "Fulfilled";
      requestStatusClass = "background-color: green";
      break;}
    case 1:
      {requestStatusStr = "Pending";
      requestStatusClass = "background-color: yellow";
      break;}
    case 2:
      {requestStatusStr = "Cancelled";
      requestStatusClass = "background-color: red";
      break;}
    default:
      requestStatusStr = "";
      requestStatusClass = "";
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid className="columns-three" item xs={4}>
          <p>Request #{requestNum}</p>
        </Grid>
        <Grid className="columns-three" item xs={4}>
          <p>Request #{requestNum}</p>
        </Grid>
        <Grid className="columns-three" item xs={4}>
          <p>Request #{requestNum}</p>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={4}>
          <p className="columns-three">Request #{requestNum}</p>
        </Grid>
        <Grid item xs={4}>
          <p className="columns-three">Request #{requestNum}</p>
        </Grid>
        <Grid item xs={4}>
          <p className="columns-three">Request #{requestNum}</p>
        </Grid>
      </Grid>
      {/* <div className="flex-container">
       
        {/* <p className="columns-three {requestStatusClass}" style={{requestStatusClass}}>{requestStatusStr}</p> */}
        {/* <Chip label="Chip Filled" /> */}
        {/* <p className="columns-three">{date}</p> */}
      {/* </div> */}
      {/* <div className="flex-container">
        <p className="columns-three">x {quantity}</p>
        <p className="columns-three">{foodPantryName}</p>
        <IconButton className="columns-three" aria-label="delete">
          <EditIcon />
        </IconButton>
        
        
      </div> */}
    </>
  );
}
