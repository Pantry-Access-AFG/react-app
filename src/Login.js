import { React, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { db } from "./firebase-config";
import { doc, setDoc } from "firebase/firestore";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Stack,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

/**
 * @returns Component for the LoginPage
 */
export default function Login() {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerZipcode, setRegisterZipcode] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isPantry, setIsPantry] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * When logged in, navigate to home page.
   * Else, navigate by default to the login page.
   * Runs when user or the loading variables update.
   */
  useEffect(() => {
    if (loading) {
      return;
    }
    if (user) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [user, loading]);

  /**
   * Async method to register a user
   * If the username does not have an email, it will add an automatic "fake" one
   * Will update account informtaion in Firebase Firestore as well as Firebase Authenatication
   */
  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerUsername.includes("@")
          ? registerUsername
          : registerUsername + "@func.com",
        registerPassword
      );
      let path = "client-accounts";
      if (isPantry) {
        path = "food-bank-accounts";
      }
      const dbRef = doc(db, path, user.user.uid);
      const insertUser = async () => {
        if (!isPantry) {
          await setDoc(dbRef, {
            full_name: registerFullName,
            password: registerPassword,
            username: registerUsername,
            zipcode: registerZipcode,
            description: "",
          });
        } else {
          await setDoc(dbRef, {
            name: registerFullName,
            password: registerPassword,
            username: registerUsername,
            zipcode: registerZipcode,
            description: "",
          });
          const dbRef2 = doc(db, "inventory", user.user.uid);
          await setDoc(dbRef2, {
            "Pantry UID": user.user.uid,
            itemList: [],
            quantityList: [],
            wantedItemList: [],
            wantedQuantityList: [],
          });
        }
      };
      insertUser();
      navigate("/");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  /**
   * Async method to log in.
   * Will automatically apply ending email if not found in the username
   */
  const login = async () => {
    try {
      if (loginUsername.includes("@")) {
        const user = await signInWithEmailAndPassword(
          auth,
          loginUsername,
          loginPassword
        );
      } else {
        const user = await signInWithEmailAndPassword(
          auth,
          loginUsername + "@func.com",
          loginPassword
        );
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  /**
   * Method to logout by calling the signOut hook from React Firebase Hooks
   */
  const logout = () => {
    signOut(auth);
  };

  // return (
  //   <>
  //     {!registerOpen && (
  //       <Stack className="center" spacing={2}>
  //         <h3>Log In to an Existing Account</h3>
  //         <input
  //           placeholder="Username..."
  //           onChange={(event) => {
  //             setLoginUsername(event.target.value);
  //             setErrorMessage("");
  //           }}
  //         />
  //         <input
  //           placeholder="Password..."
  //           type="password"
  //           onChange={(event) => {
  //             setLoginPassword(event.target.value);
  //             setErrorMessage("");
  //           }}
  //         />
  //         <button onClick={login}>Log In</button>
  //         <button
  //           onClick={() => {
  //             setRegisterOpen(!registerOpen);
  //             setErrorMessage("");
  //           }}
  //         >
  //           Register Account
  //         </button>
  //       </Stack>
  //     )}

  //     {registerOpen && (
  //       <Stack className="center" spacing={2}>
  //         <h3>Register for a New Client/Food Bank Account</h3>
  //         <input
  //           placeholder="Username..."
  //           onChange={(event) => {
  //             setRegisterUsername(event.target.value);
  //             setErrorMessage("");
  //           }}
  //         />
  //         <input
  //           placeholder="Password..."
  //           type="password"
  //           onChange={(event) => {
  //             setRegisterPassword(event.target.value);
  //             setErrorMessage("");
  //           }}
  //         />
  //         <input
  //           placeholder="Full Name"
  //           onChange={(event) => {
  //             setRegisterFullName(event.target.value);
  //             setErrorMessage("");
  //           }}
  //         />
  //         <input
  //           placeholder="Zipcode"
  //           onChange={(event) => {
  //             setRegisterZipcode(event.target.value);
  //             setErrorMessage("");
  //           }}
  //         />
  //         <p>Are you a food pantry?</p>
  //         <input
  //           type="checkbox"
  //           id="isPantry"
  //           onClick={() => {
  //             setIsPantry(!isPantry);
  //             setErrorMessage("");
  //           }}
  //         />
  //         <br></br>
  //         <button onClick={register}>Create User</button>

  //         <button
  //           onClick={() => {
  //             setRegisterOpen(!registerOpen);
  //             setErrorMessage("");
  //           }}
  //         >
  //           Return to Login
  //         </button>
  //       </Stack>
  //     )}
  //     {errorMessage && (
  //       <Typography component="p" variant="p" align="center" padding={3}>
  //         {errorMessage}
  //       </Typography>
  //     )}
  //   </>
  return (
    <>
      {!registerOpen && (
        <Stack className="center" spacing={2}>
          <Typography variant="h5" margin={3}>
            Log In to an Existing Account
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            onChange={(event) => {
              setLoginUsername(event.target.value);
              setErrorMessage("");
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            onChange={(event) => {
              setLoginPassword(event.target.value);
              setErrorMessage("");
            }}
          />
          <Button variant="contained" onClick={login}>
            Log In
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setRegisterOpen(!registerOpen);
              setErrorMessage("");
            }}
          >
            Register Account
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/Contact")}
          >
            Reset Password
          </Button>
        </Stack>
      )}

      {registerOpen && (
        <Stack className="center" spacing={2}>
          <Typography variant="h5" margin={3}>
            Register for a New Client/Food Bank Account
          </Typography>
          <TextField
            label="Username"
            variant="outlined"
            onChange={(event) => {
              setRegisterUsername(event.target.value);
              setErrorMessage("");
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            onChange={(event) => {
              setRegisterPassword(event.target.value);
              setErrorMessage("");
            }}
          />
          <TextField
            label="Full Name"
            variant="outlined"
            onChange={(event) => {
              setRegisterFullName(event.target.value);
              setErrorMessage("");
            }}
          />
          <TextField
            label="Zipcode"
            variant="outlined"
            onChange={(event) => {
              setRegisterZipcode(event.target.value);
              setErrorMessage("");
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                id="isPantry"
                onChange={() => {
                  setIsPantry(!isPantry);
                  setErrorMessage("");
                }}
              />
            }
            label="Are you a food pantry?"
          />
          <br />
          <Button variant="contained" onClick={register}>
            Create User
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setRegisterOpen(!registerOpen);
              setErrorMessage("");
            }}
          >
            Return to Login
          </Button>
        </Stack>
      )}
      {errorMessage && (
        <Typography variant="body1" align="center" color="red" padding={3}>
          {errorMessage}
        </Typography>
      )}
    </>
  );
}
