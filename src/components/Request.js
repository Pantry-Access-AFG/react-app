import { useNavigate, useLocation } from "react-router-dom";

/**
 * Makes a request for the my requests page.
 * @returns the navigation bar
 */
export default function Request(props) {
  const navigate = useNavigate();
  const location = useLocation();
  //0 is fulfilled, 1 is pending, 2 is cancelled
  const [requestNum, requestStatus, date, isFoodClient] = [0, 0, "date", true]; //change to use props/query
  let requestStatusStr; //the string for the request status
  let requestStatusClass; //the class name for styling the request button

  switch (requestStatus) {
    case 0:
      requestStatusStr = "Fulfilled";
      requestStatusClass = "fulfilled";
    case 1:
      requestStatusStr = "Pending";
      requestStatusClass = "pending";
    case 2:
      requestStatusStr = "Cancelled";
      requestStatusClass = "cancelled";
    default:
      requestStatusStr = "";
      requestStatusClass = "";
  }

  return (
    <>
      <div className="flex-container">
        <p>Request #{requestNum}</p>
        <p className={requestStatusClass}>{requestStatusStr}</p>
        <p>{date}</p>
      </div>
      <div className="flex-container">
        <p>Request #{requestNum}</p>
        <p className={requestStatusClass}>{requestStatusStr}</p>
        <p>{date}</p>
      </div>
    </>
  );
}
