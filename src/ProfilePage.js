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
import {
  FormControl,
  InputLabel,
  Input,
  TextField,
  Typography,
} from "@material-ui/core";
import { Stack } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import Confetti from "react-confetti";
import { auth } from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut, deleteUser } from "firebase/auth";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  /**
   * Async function to delete an account by removing it from Firebase Auth and it's document in Firebase Firestore
   */
  const handleDeleteAccount = async () => {
    setUsername("");
    setPassword("");
    setZipcode("");
    let docRef = doc(
      db,
      isPantry ? "food-bank-accounts" : "client-accounts",
      user.uid
    );
    deleteDoc(docRef);

    try {
      deleteUser(user)
        .then(() => {
          setConfettiOn(true);
        })
        .catch((error) => {
          console.log(error);
        });
      handleCloseAreYouSure();
      logout();
    } catch (error) {}
  };

  // Set username listener
  const handleSetUsername = (x) => {
    setUsername(x);
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

  /**
   * Funciton to update the account details.
   * If an account needs to change a username or a password, they will need to email us.
   */
  const handleSaveChanges = () => {
    let docRef = doc(
      db,
      isPantry ? "food-bank-accounts" : "client-accounts",
      user.uid
    );
    setDoc(
      docRef,
      { zipcode: zipcode, description: description },
      { merge: true }
    );
    setConfettiOn(true);
  };

  /**
   * Function to logout by calling the signOut React Firebase Hook and navigating to the default login page.
   */
  const logout = () => {
    signOut(auth);
    navigate("/login");
  };

  /**
   * Runs on component load or when user changes to find all of the user's information from Firebase Firestore and display it under account details
   */
  useEffect(() => {
    if (user) {
      const getName = async () => {
        let docRef = doc(db, "client-accounts", user.uid);
        let docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setName(docSnap.data().full_name);
          setUsername(docSnap.data().full_name);
          setUsername(docSnap.data().username);
          setPassword(docSnap.data().password);
          setZipcode(docSnap.data().zipcode);
          setIsFoodPantry(false);
        } else {
          docRef = doc(db, "food-bank-accounts", user.uid);
          docSnap = await getDoc(docRef);
          setName(docSnap.data().name);
          setUsername(docSnap.data().name);
          setPassword(docSnap.data().password);
          setZipcode(docSnap.data().zipcode);
          setDescription(docSnap.data().description);
          setIsFoodPantry(true);
        }
      };
      getName();
    }
  }, [user]);

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
    <Box textAlign="center" margin="auto" style={{width:"50vw", maxWidth:'500px'}} sx={{display: 'flex', flexDirection: {xs:'column', md:"row"}, justifyContent:'space-around', alignContent:"space-around"}}>
        <Button variant="outlined" color="success" style={{marginBottom:"8px"}} onClick={handleSaveChanges}>
          Save Changes
        </Button>
{/* 
        <br />
        <br /> */}

        <Button variant="outlined" color="error" style={{marginBottom:"8px"}} onClick={logout}>
          Log Out
        </Button>
{/* 
        <br />
        <br /> */}

        <Button variant="outlined" color="error" style={{marginBottom:"8px"}} onClick={handleOpenAreYouSure}>
          Delete Account
        </Button>

     
      </Box>
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
  isPantry,
}) {
  // username listener
  const usernameChange = (event) => {
    setUsername(event.target.value);
  };

  // username submit listener
  const usernameSubmit = (event) => {
    event.preventDefault();
    setUsername(event.target.value);
  };

  // password listener
  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  // password submit listener
  const passwordSubmit = (event) => {
    event.preventDefault();
    setPassword(event.target.value);
  };

  // zipcode listener
  const zipcodeChange = (event) => {
    setZipcode(event.target.value);
  };

  // zipcode submit listener
  const zipcodeSubmit = (event) => {
    event.preventDefault();
    setZipcode(event.target.value);
  };

  // description listener
  const descriptionChange = (event) => {
    setDescription(event.target.value);
  };

  // description submit listener
  const descriptionSubmit = (event) => {
    event.preventDefault();
    setDescription(event.target.value);
  };

  return (
    <>
      <Stack spacing={3} marginTop={1} >
        <div  className="row">
          <form onSubmit={usernameSubmit}>
            <FormControl>
              {/* <InputLabel htmlFor="username-input">Username</InputLabel> */}
              <TextField 
              style={{width:"50vw", maxWidth:"500px"}}
                disabled
              id="username-input"
                label="Username"
                value={username}
                onChange={usernameChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </form>
        </div>

        <div className="row">
          <form onSubmit={passwordSubmit}>
            <FormControl>
              {/* <InputLabel htmlFor="password-input">Password</InputLabel> */}
              <TextField
              style={{width:"50vw", maxWidth:"500px"}}
                id="password-input"
                label="Password"
                disabled
                value={password}
                onChange={passwordChange}
                InputProps={{
                  readOnly: true,
                }}
              />
            </FormControl>
          </form>
        </div>

        <div className="row">
          <form onSubmit={zipcodeSubmit}>
            <FormControl>
              {/* <InputLabel htmlFor="zipcode-input">Zipcode</InputLabel> */}
              <TextField 
              style={{width:"50vw", maxWidth:"500px"}}
              id="zipcode" 
              label="Zipcode"
              value={zipcode} 
              onChange={zipcodeChange} />
            </FormControl>
          </form>
        </div>

        {isPantry && (
          <div className="row">
            <form onSubmit={descriptionSubmit}>
              <FormControl>
                {/* <InputLabel htmlFor="description-input">Description</InputLabel> */}
                <TextField
                style={{width:"50vw", maxWidth:"500px"}}
                 label="Description"
                  multiline
                  id="description"
                  value={description}
                  onChange={descriptionChange}
                />
              </FormControl>
            </form>
          </div>
        )}
      </Stack>
    </>
  );
}

/**
 *
 * @returns React Dialog Component for confirming if a person wants to delete their account.
 */
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
