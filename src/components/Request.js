import pencil from "../images/pencil.png";
import { useNavigate, useLocation } from "react-router-dom";

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
      <div className="flex-container">
        <p>Request #{requestNum}</p>
        <p className={requestStatusClass} style={{requestStatusClass}}>{requestStatusStr}</p>
        <p>{date}</p>
      </div>
      <div className="flex-container">
        <p className="columns-three">x {quantity}</p>
        <p className="columns-three">{foodPantryName}</p>
        <div className="right">
        <img src={pencil} className="placeholder" alt="pencil" />
        </div>
        
        
      </div>
    </>
  );
}
