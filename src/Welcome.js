import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Container, Typography } from "@material-ui/core";
import logo from "./images/pantryaccess.png";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { Link } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    backgroundColor: "none",
    margin: "auto",
  },
  logo: {
    width: 250,
    marginRight: "auto",
    marginLeft: "auto",
    display: "flex",
  },
  title: {
    color: theme.palette.common.black,
    marginBottom: theme.spacing(2),
    textAlign: "center",
  },
  description: {
    color: theme.palette.common.black,
    marginBottom: theme.spacing(4),
    textAlign: "center",
  },
  button: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    outline: "true",
    textAlign: "center",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    display: "flex",
    margin: "auto",
    marginTop: "2rem",
  },
}));

function LandingPage({ viewFoodPantries, setViewFoodPantries }) {
  const classes = useStyles();
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  const redirect = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      redirect();
    }
  }, [user]);

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <img src={logo} alt="Logo" className={classes.logo} />
        <Typography variant="h4" className={classes.title}>
          Welcome to the Pantry Access
        </Typography>
        <Typography variant="subtitle1" className={classes.description}>
          Pantry Access is a <i>universal</i> food pantry application for food
          pantries and clients. Our free cross-platform app streamlines
          communication between clients and pantries, as well as provide a
          single cloud-based location to manage inventory and donations desired.
        </Typography>
        <Typography variant="subtitle2" className={classes.description}>
          This application was developed by Charles Tang, Jennifer Schaughnessy,
          and Sumanth Sura of Mass Academy in the Apps for Good project. This
          project was also advised by Mrs. Taricco of Mass Academy. The code is{" "}
          <i>open-source</i>, and the documentation can be found{" "}
          <Link target="0" href="https://github.com/Pantry-Access-AFG">
            here
          </Link>
          .
        </Typography>

        {!viewFoodPantries ? (
          <>
            <Button
              variant="contained"
              className={classes.button}
              onClick={redirect}
            >
              Login/Register Now
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              onClick={() => setViewFoodPantries(true)}
            >
              Skip Registration
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            className={classes.button}
            onClick={() => setViewFoodPantries(false)}
          >
            Hide Pantries
          </Button>
        )}
        <Button
            variant="contained"
            className={classes.button}
            onClick={() => navigate("/Contact")}
          >
            Contact Us
          </Button>
      </Container>
    </div>
  );
}

export default LandingPage;
