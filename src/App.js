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
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#3b9d6e',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: '#0066ff',
      main: '#547AA5',
      // dark: will be calculated from palette.secondary.main,
      // contrastText: '#ffcc00',
    },
    // Provide every color token (light, main, dark, and contrastText) when using
    // custom colors for props in Material UI's components.
    // Then you will be able to use it like this: `<Button color="custom">`
    // (For TypeScript, you need to add module augmentation for the `custom` value)
    custom: {
      light: '#ffa726',
      main: '#f57c00',
      dark: '#ef6c00',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
});


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
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
