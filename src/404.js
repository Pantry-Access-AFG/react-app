import { Stack } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * 404 page
 */

export default function FourOhFour() {
  return (
    <>
      <Stack spacing={2} marginTop="auto">
        <h1 style={{ textAlign: "center", margin: "1rem" }}>
          Oops! You seem to be lost.
        </h1>
        <p style={{ textAlign: "center", margin: "auto" }}>
          Take me <Link to="/">home</Link>.
        </p>
      </Stack>
    </>
  );
}
