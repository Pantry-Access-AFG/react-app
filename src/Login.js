import  { React, useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendEmailVerification } from "firebase/auth";
import { getData } from "firebase/firestore";
import "./Login.css";
import {auth} from './firebase-config'; 
// import { Form, Button, Card } from "react-bootstrap";


export default function Login() {

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
 
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser)
  })

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
        console.log(user);
      }
      else {
        const user = await signInWithEmailAndPassword(
          auth, 
          loginUsername + "@func.com", 
          loginPassword)
        ;
        console.log(user);
      }
      
      } catch (error) {
        console.log(error.message);
      }
  };

  const logout = async () => {

    await signOut(auth);
  };

  return (
    <div className="loginMain">
      <div>
        <h3>Register for a New Client Account</h3>
        <input 
          placeholder="Username..." 
          onChange={(event) => 
            {setRegisterUsername(event.target.value);
          }}
        />
        <input 
          placeholder="Password..."
          type="password"
          onChange={(event) => 
            {setRegisterPassword(event.target.value);
          }}
        />

        <button onClick={register}>Create User</button>
      </div>
      <div>
        <h3>Log In to an Existing Client Account</h3>
        <input 
          placeholder="Username..."
          onChange={(event) => 
            {setLoginUsername(event.target.value);
          }}
        />
        <input 
          placeholder="Password..."
          type="password"
          onChange={(event) => 
            {setLoginPassword(event.target.value);
          }}
        />
        <button onClick={login}>Log In</button>
      </div>

      <h4>User Logged In: </h4>
      {user?.email}
      <button onClick={logout}>Sign Out</button>
    </div>
    

  )
};

