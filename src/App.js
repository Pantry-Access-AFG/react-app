import "./App.css";
import Header from "./components/Header";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar";
import Login from "./Login";
import React from "react";
import ProfilePage from "./ProfilePage";
import MyRequests from "./PantryMyRequests";
import ClientMyRequests from "./ClientMyRequests";
import PantryHome from "./PantryHome";
import Footer from "./components/Footer";
import ClientHome from "./ClientHome";
import FourOhFour from "./404";
import Welcome from "./Welcome";
import ContactUs from "./ContactUs";
import { auth } from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import  ForgotPassword  from "./ForgotPassword";

function App() {
  // user authentication state for displaying different pages/components
  const [user, loading, error] = useAuthState(auth);
  const [isPantry, setIsPantry] = React.useState(false);
  const [viewFoodPantries, setViewFoodPantries] = React.useState(false);

  // check if user is a pantry or client
  React.useEffect(() => {
    if (user) {
      const getIsPantry = async () => {
        let docRef = doc(db, "client-accounts", user.uid);
        let docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setIsPantry(false);
        } else {
          setIsPantry(true);
        }
      };
      getIsPantry();
    } else {
      setIsPantry(false);
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div style={{minHeight:"80vh", backgroundColor:"white", paddingBottom:"2rem"}}>
      <Header></Header>
      <NavBar></NavBar>

      <Routes >
        <Route
          path="/"
          element={
            <>
              {user ? (
                isPantry ? (
                  <PantryHome></PantryHome>
                ) : (
                  <ClientHome></ClientHome>
                )
              ) : (
                <>
                  <Welcome
                    viewFoodPantries={viewFoodPantries}
                    setViewFoodPantries={setViewFoodPantries}
                  ></Welcome>
                  {viewFoodPantries && <ClientHome></ClientHome>}
                </>
              )}
            </>
          }
        />
        <Route path="/profile" index element={<ProfilePage></ProfilePage>} />
        <Route path="/contact" index element={<ContactUs></ContactUs>} />
        <Route
          path="/myrequests"
          element={
            isPantry ? (
              <MyRequests></MyRequests>
            ) : (
              <ClientMyRequests></ClientMyRequests>
            )
          }
        />
        <Route path="/login" element={<Login></Login>} />
        <Route path="/welcome" element={<Welcome></Welcome>} />
        <Route path="*" element={<FourOhFour />} />
        <Route path="/account-recovery" element={<ForgotPassword></ForgotPassword>} />
      </Routes>
      
      </div>
      <Footer style={{minHeight:"10vh"}}></Footer>
      
      
    </BrowserRouter>
  );
}

export default App;
