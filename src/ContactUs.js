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

function ContactUs() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          Thank you for using Pantry Access. Our support is volunteer-based, so
          please be patient while we get back to your question or concern.
          Please reserve emailing us to app bugs, account inquiries, password
          reset, and additional features you would like to see in a future
          update.
        </Typography>
        <Typography variant="body1" align="center" gutterBottom>
          If you have any questions or concerns about our food pantry program,
          please feel free to contact us using the email below. We will get back
          to you as soon as possible.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          href="mailto:pantryaccess@gmail.com"
          className={classes.button}
          sx={{ marginTop: "2rem" }}
        >
          Email Us
        </Button>
      </Container>
    </div>
  );
}

export default ContactUs;
