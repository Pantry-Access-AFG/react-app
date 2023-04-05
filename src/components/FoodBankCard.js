import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Button, CardActions } from "@mui/material";

export default function FoodBankCard({ id, foodBankName, zipCode, distanceAway, onRequestClick }) {
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
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Typography textAlign="center" gutterBottom variant="h5">
              {foodBankName}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <CardActions>
              <Button size="medium" color="primary" onClick={() => {onRequestClick(id)}}>
                Make Request
              </Button>
            </CardActions>
          </Grid>
        </Grid>

        <Typography variant="body2" color="text.secondary" textAlign="center">
          {zipCode} -- {distanceAway} mi from you.
        </Typography>
      </CardContent>
    </Card>
    
  );
}
