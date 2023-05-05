import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Button, CardActions } from "@mui/material";
import Stack from "@mui/material/Stack";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export default function FoodBankCard({
  id,
  foodBankName,
  zipCode,
  distanceAway,
  onRequestClick,
  onLearnMoreClick,
}) {
  const [user, loading, error] = useAuthState(auth);
  const zipCodeData = require("zipcode-city-distance");
  const [clientZip, setClientZip] = React.useState("00000");

  React.useEffect(() => {
    if (user) {
      const getZipCode = async () => {
        let docRef = doc(db, "client-accounts", user.uid);
        let docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setClientZip(docSnap.data().zipcode);
        }
      };
      getZipCode();
    }
  }, []);

  let zipCodeDistance = parseInt(
    zipCodeData.zipCodeDistance(clientZip, zipCode, "M")
  );

  return (
    <Card
      sx={{
        maxWidth: "90%",
        justifyContent: "center",
        margin: "auto",
        marginTop: "1rem",
      }}
    >
      <CardContent>
        <Stack container spacing={2}>
          <Typography textAlign="center" gutterBottom variant="h5">
            {foodBankName}
          </Typography>
          <CardActions>
            <Grid
              container
              justifyContent="center"
              textAlign="center"
              spacing={2}
            >
              <Grid
                item
                xs={6}
                alignContent="center"
                alignItems="center"
                justifyContent="center"
              >
                {user && (
                  <Button
                    size="medium"
                    color="primary"
                    onClick={() => {
                      onRequestClick(id);
                    }}
                  >
                    Make Request
                  </Button>
                )}
              </Grid>
              <Grid
                item
                xs={6}
                alignContent="center"
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  size="medium"
                  color="primary"
                  onClick={() => {
                    onLearnMoreClick(id);
                  }}
                >
                  Learn More
                </Button>
              </Grid>
            </Grid>
          </CardActions>

          <Typography variant="body2" color="text.secondary" textAlign="center">
            {zipCode} -- {zipCodeDistance ? zipCodeDistance : "Unknown"} miles
            from you.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
