import React from "react";
import { Typography, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";

function Footer() {
  const navigate = useNavigate();
  return (
    <footer
      style={{
        backgroundColor: "#EFEFEF",
        paddingTop: "16px",
        bottom: "0",
        // paddingBottom: "20px",
        position: "relative",
        left: "0",
        right: "0",
      }}
    >
      <Typography
        variant="subtitle2"
        align="center"
        color="textSecondary"
        component="p"
      >
        <Stack>
          Pantry Access
          <br></br>
          <Link
            color="inherit"
            href="/Contact"
            rel="noopener"
          >
            Contact Us
          </Link>{" "}
          <Link
            color="inherit"
            href="https://github.com/Pantry-Access-AFG"
            target="_blank"
            rel="noopener"
          >
            Documentation
          </Link>{" "}
          Copyright © {new Date().getFullYear()}. All Rights Reserved.
        </Stack>
      </Typography>
    </footer>
  );
}

export default Footer;
