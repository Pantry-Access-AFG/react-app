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

export default function Login() {
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerFullName, setRegisterFullName] = useState("");
  const [registerZipcode, setRegisterZipcode] = useState("");
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isPantry, setIsPantry] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

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

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerUsername,
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
        });}
        else {
          await setDoc(dbRef, {
            name: registerFullName,
            password: registerPassword,
            username: registerUsername,
            zipcode: registerZipcode,
            description: "",
          });
          const dbRef2 = doc(db, "inventory", user.user.uid);
          await setDoc(dbRef2, {
            "Pantry UID" : user.user.uid,
            itemList: [],
            quantityList: [],
            wantedItemList: [],
            wantedQuantityList: []
          });
        }
      };
      insertUser();
      navigate("/");
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
          loginPassword
        );
        console.log(user);
      } else {
        const user = await signInWithEmailAndPassword(
          auth,
          loginUsername + "@func.com",
          loginPassword
        );
        console.log(user);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <div className="loginMain">
      <div>
        <h3>Register for a New Client/Food Bank Account</h3>
        <input
          placeholder="Username..."
          onChange={(event) => {
            setRegisterUsername(event.target.value);
          }}
        />
        <input
          placeholder="Password..."
          type="password"
          onChange={(event) => {
            setRegisterPassword(event.target.value);
          }}
        />
        <input
          placeholder="Full Name"
          onChange={(event) => {
            setRegisterFullName(event.target.value);
          }}
        />
        <input
          placeholder="Zipcode"
          onChange={(event) => {
            setRegisterZipcode(event.target.value);
          }}
        />
        <p>Are you a food pantry?</p>
        <input
          type="checkbox"
          id="isPantry"
          onClick={() => setIsPantry(!isPantry)}
        />
        <br></br>
        <button onClick={register}>Create User</button>
      </div>
      <div>
        <h3>Log In to an Existing Client Account</h3>
        <input
          placeholder="Username..."
          onChange={(event) => {
            setLoginUsername(event.target.value);
          }}
        />
        <input
          placeholder="Password..."
          type="password"
          onChange={(event) => {
            setLoginPassword(event.target.value);
          }}
        />
        <button onClick={login}>Log In</button>
      </div>
    </div>
  );
}
