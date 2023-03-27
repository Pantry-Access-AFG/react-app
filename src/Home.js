import React from "react";
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import { useState } from "react";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function FormDialog({ open, handleClose, insertItem }) {

  let [item, setItem] = useState("");
  let [quantity, setQuantity] = useState(0);

  const handleInsertItem2 = () => {
    insertItem({col1Name: item, col2Name: quantity});
    handleClose();
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Insert Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter item to be added to the inventory.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Item Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => {setItem(event.target.value)}}
          />
          <TextField
            autoFocus
            margin="dense"
            id="quantity"
            label="Quantity"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => {setQuantity(event.target.value)}}
          />
        </DialogContent>
        <DialogActions>
        <Button onClick={handleInsertItem2}>Insert</Button>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default function Home() {
  // States for form dialog
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150, align: "center" },
    { field: "col1", headerName: "Item", width: 150, align: "center" },
    { field: "col2", headerName: "Quantity", width: 150, align: "center" },
  ];

  let [rows, setRows] = useState(() => [
    { id: 1, col1: "Hello", col2: "World", align: "center" },
    { id: 2, col1: "DataGridPro", col2: "is Awesome", align: "center" },
    { id: 3, col1: "MUI", col2: "is Amazing", align: "center" },
  ]);

  let [id, setId] = useState(4);

  const handleInsertItem = () => {
    handleClickOpen();
  };

  const insertItem = ({ itemID=id, col1Name, col2Name }) => {
    setRows((rows) => [
      ...rows,
      { id: itemID, col1: col1Name, col2: col2Name },
    ]);
    setId(id + 1);
  };

  return (
    <>
      <Box sx={{ "& > :not(style)": { m: 3 } }} textAlign="center">
        <Fab
          color="primary"
          aria-label="add"
          variant="extended"
          onClick={handleInsertItem}
        >
          <AddIcon />
          Insert Item
        </Fab>
      </Box>
      <FormDialog open={open} handleClose={handleClose} insertItem={insertItem}></FormDialog>
      <div style={{ height: 300, width: "80%", margin: "auto"}}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </>
  );
}
