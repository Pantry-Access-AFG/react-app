import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/system";
import "./FoodPantryProfile.css";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Confetti from "react-confetti";
import { auth } from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase-config";

/**
 * Page for Food Pantry Profiles
 * @returns Component for Food Pantry Profile page
 */

// TODO: Integrate with Firebase authentication and create more conditionals for checking and confirmation dialogs

export default function ProfilePage() {
  let [name, setName] = useState("");

  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [zipcode, setZipcode] = useState("");
  let [description, setDescription] = useState("");
  let [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  let [confettiOn, setConfettiOn] = useState(false);
  let [isPantry, setIsFoodPantry] = useState(false);
  const [user, loading, error] = useAuthState(auth);

  // Delete account function to reset all values and remove user from database (TBD)
  const handleDeleteAccount = () => {
    setUsername("");
    setPassword("");
    setZipcode("");
    handleCloseAreYouSure();
  };

  // Set username listener
  const handleSetUsername = (x) => {
    setUsername(x);
    // firebase
  };

  // Set password listener
  const handleSetPassword = (x) => {
    setPassword(x);
  };

  // Set zipcode listener
  const handleSetZipcode = (x) => {
    setZipcode(x);
  };

  const handleSetDescription = (x) => {
    setDescription(x);
  };

  const handleOpenAreYouSure = () => {
    setDeleteAccountOpen(true);
  };

  const handleCloseAreYouSure = () => {
    setDeleteAccountOpen(false);
  };

  const handleSaveChanges = () => {
    setConfettiOn(true);
  };

  const logout = () => {
    signOut(auth);
  }

  useEffect(() => {
    if (user) {
      const getName = async () => {
        let docRef = doc(db, "client-accounts", user.uid);
        let docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setName(docSnap.data().full_name)
        } else {
          docRef = doc(db, "food-bank-accounts", user.uid);
          docSnap = await getDoc(docRef);
          setName(docSnap.data().full_name)
        }        
      }
      getName();
    }
  }, [])

  return (
    <>
      <h1 className="text-center" style={{ marginTop: "1rem" }}>
        {name}
      </h1>

      <UserInfo
        username={username}
        password={password}
        zipcode={zipcode}
        description={description}
        setUsername={handleSetUsername}
        setPassword={handleSetPassword}
        setZipcode={handleSetZipcode}
        setDescription={handleSetDescription}
        isPantry={isPantry}
      />
      <br></br>

      {/* Delete account button*/}
      <Box textAlign="center" alignContent="center" margin="auto">
        <Button variant="outlined" color="success" onClick={handleSaveChanges}>
          Save Changes
        </Button>

        <br />
        <br />

        <Button variant="outlined" color="error" onClick={logout}>
          Log Out
        </Button>

        <br />
        <br />

        <Button variant="outlined" color="error" onClick={handleOpenAreYouSure}>
          Delete Account
        </Button>

        <Alert
          sx={{
            width: "50%",
            margin: "auto",
            marginTop: "1rem",
          }}
          severity="error"
        >
          Deleting your account is permanent.
        </Alert>
      </Box>

      <AreYourSureDialog
        deleteAccountOpen={deleteAccountOpen}
        deleteAccount={handleDeleteAccount}
        handleClose={handleCloseAreYouSure}
      />

      <ConfettiMode
        confettiOn={confettiOn}
        setConfettiOn={setConfettiOn}
      ></ConfettiMode>
    </>
  );
}

/**
 * Function for creating userinfo component (to be replaced with MUI?)
 * @returns Component for User Info boxes
 */
function UserInfo({
  username,
  password,
  zipcode,
  description,
  setUsername,
  setPassword,
  setZipcode,
  setDescription,
  isPantry
}) {
  const usernameChange = (event) => {
    setUsername(event.target.value);
  };

  const usernameSubmit = (event) => {
    event.preventDefault();
    setUsername(event.target.value);
  };

  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  const passwordSubmit = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  const zipcodeChange = (event) => {
    setZipcode(event.target.value);
  };

  const zipcodeSubmit = (event) => {
    event.preventDefault();
    setZipcode(event.target.value);
  };

  const descriptionChange = (event) => {
    setDescription(event.target.value);
  }

  const descriptionSubmit = (event) => {
    event.preventDefault();
    setDescription(event.target.value);
  };

  return (
    <div>
      <div className="row">
        <p className="row">Username:</p>
        <form className="row" onSubmit={usernameSubmit}>
          <input type="text" value={username} onChange={usernameChange} />
        </form>
      </div>

      <div className="row"></div>
      <div className="row">
        <p className="row">Password:</p>
        <form className="row" onSubmit={passwordSubmit}>
          <input type="text" value={password} onChange={passwordChange} />
        </form>
      </div>
      <div className="row">
        <p className="row">Zipcode:</p>
        <form className="row" onSubmit={zipcodeSubmit}>
          <input type="text" value={zipcode} onChange={zipcodeChange} />
        </form>
      </div>
      {isPantry && <div className="row">
        <p className="row">Description:</p>
        <form className="row" onSubmit={descriptionSubmit}>
          <input type="text" value={description} onChange={descriptionChange} />
        </form>
      </div>}
    </div>
  );
}

function AreYourSureDialog({ deleteAccountOpen, deleteAccount, handleClose }) {
  return (
    <>
      <Dialog open={deleteAccountOpen} onClose={handleClose}>
        <DialogTitle>Delete Account Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to delete your account? All of your information
            will be lost permanently.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteAccount}>Delete Account</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/**
 * 
 * @returns confetti mode component to be used for submission of new inventory items
 */
const ConfettiMode = ({ confettiOn, setConfettiOn }) => {
  return (
    <div>
      <Confetti
        numberOfPieces={confettiOn ? 200 : 0}
        recycle={false}
        wind={0.05}
        gravity={2}
        onConfettiComplete={(confetti) => {
          setConfettiOn(false);
          confetti.reset();
        }}
      />
    </div>
  );
};
