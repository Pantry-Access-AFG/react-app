import React from "react";
import { Typography, Link } from "@mui/material";
import Stack from "@mui/material/Stack";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#EFEFEF",
        marginTop: "2rem",
        bottom: "0",
        position: "relative",
        left: "0",
        right: "0",
      }}
    >
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        Contact us at{" "}
        <Link color="inherit" href="#">
          here
        </Link>{" "}
      </Typography>
      <Typography
        variant="subtitle2"
        align="center"
        color="textSecondary"
        component="p"
      >
        <Stack>
          Pantry Access Copyright © {new Date().getFullYear()}
          <Link
            color="inherit"
            href="https://github.com/Pantry-Access-AFG"
            target="_blank"
            rel="noopener"
          >
            Documentation
          </Link>{" "}
          All Rights Reserved.
        </Stack>
      </Typography>
    </footer>
  );
}

export default Footer;
