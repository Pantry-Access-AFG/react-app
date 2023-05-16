import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Typography, Button } from "@mui/material";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  button: {
    textAlign: "center",
  },
}));

function ForgotPassword() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Forgot Password?
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          You can recover your account by emailing us:
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          href="mailto:pantryaccess@gmail.com"
          className={classes.button}
          sx={{ marginTop: "1rem", marginBottom: "1rem" }}
        >
          Email Us
        </Button>
        <Typography variant="body1" align="center" gutterBottom>
          If you have any questions or concerns about our food pantry program,
          please feel free to contact us using the email below. We will get back
          to you as soon as possible.
        </Typography>
        
      </Container>
    </div>
  );
}

export default ForgotPassword;
