 import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
 const firebaseConfig = {
    apiKey: "AIzaSyD32hDCgsSNy7WGEDvIwTqux9HXMPemDnE",
    authDomain: "pantryaccess.firebaseapp.com",
    projectId: "pantryaccess",
    storageBucket: "pantryaccess.appspot.com",
    messagingSenderId: "1019635794292",
    appId: "1:1019635794292:web:eec48b565d2cfc4590ac21",
    measurementId: "G-QD39HV1R7N",
  
  };
  
  const app = initializeApp(firebaseConfig);
  
  export const auth = getAuth(app);