import  { React, useState, useEffect } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification } from "firebase/auth";
import { db } from "./firebase-config";
import { doc, updateDoc, onSnapshot, addDoc, setDoc } from "firebase/firestore";
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

export default function Login() {

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerZipcode, setRegisterZipcode] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
 
  const [user, setUser] = useState({});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const register = async () =>  {

    try {
    const user = await createUserWithEmailAndPassword(
      auth, 
      registerUsername, 
      registerPassword
    );

    sendEmailVerification(auth.currentUser).then(() => 
    {
      console.log("yay email sent!")
    });

    console.log(user);

    const dbRef = doc(db, "client-accounts", user.user.uid);
    const insertUser = async () => {
      await setDoc(dbRef, {
        full_name: registerFullName,
        password: registerPassword,
        username: registerUsername,
        zipcode: registerZipcode,
      });
    };
    insertUser();
    } catch (error) {
      console.log(error.message);
    }
  };

  const login = async () => {

    try {
      if (loginUsername.includes("@")) {
        const user = await signInWithEmailAndPassword(
          auth, 
          loginUsername, 
          loginPassword)
        ;
      }
      else {
        const user = await signInWithEmailAndPassword(
          auth, 
          loginUsername + "@func.com", 
          loginPassword)
        ;
      }
      
      } catch (error) {
        console.log(error.message);
      }
  };

  const logout = async () => {
    setLoading(true);
    await signOut(auth);
    setLoading(false);
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
