import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

function FormDialog({
  open,
  handleClose,
  insertItem,
  item,
  setItem,
  quantity,
  setQuantity,
}) {
  const handleInsertItem2 = () => {
    if (item && quantity > 0) {
      insertItem({ col1Name: item, col2Name: quantity });
      handleClose();
    }
  };

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
            required
            margin="dense"
            id="name"
            label="Item Name"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) => {
              setItem(event.target.value);
            }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="quantity"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            onChange={(event) => {
              setQuantity(event.target.value);
            }}
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
  let [item, setItem] = useState("");
  let [quantity, setQuantity] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setItem("");
    setQuantity(0);
  };

  const deleteRowClick = (e, row, rows, index) => {
    setRows((rows) =>
      rows.slice(0, index).concat(rows.slice(index + 1, rows.length))
    );
    if (index === row.length) setId(id - 1);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150, align: "center" },
    { field: "col1", headerName: "Item", width: 150, align: "center" },
    { field: "col2", headerName: "Quantity", width: 150, align: "center" },
    {
      field: "actions",
      headerName: "Edit",
      width: 150,
      align: "center",
      renderCell: (params) => {
        return (
          <IconButton
            aria-label="delete"
            size="large"
            variant="contained"
            onClick={(e) =>
              deleteRowClick(e, params.row, rows, rows.indexOf(params.row))
            }
          >
            <DeleteIcon />
          </IconButton>
        );
      },
    },
  ];

  let [rows, setRows] = useState(() => [
    {
      id: 1,
      col1: "Hello",
      col2: "World",
      align: "center",
    },
    { id: 2, col1: "DataGridPro", col2: "is Awesome", align: "center" },
    { id: 3, col1: "MUI", col2: "is Amazing", align: "center" },
  ]);

  let [id, setId] = useState(rows.length);

  const handleInsertItem = () => {
    handleClickOpen();
  };

  const insertItem = ({ itemID = id, col1Name, col2Name }) => {
    setId(id + 1);
    setRows((rows) => [
      ...rows,
      { id: itemID, col1: col1Name, col2: col2Name },
    ]);
  };

  let food_bank_name = "Food Bank X";

  return (
    <>
      <h1 style={{ textAlign: "center" }}>{food_bank_name}'s Inventory</h1>
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
      <FormDialog
        open={open}
        handleClose={handleClose}
        insertItem={insertItem}
        item={item}
        setItem={setItem}
        quantity={quantity}
        setQuantity={setQuantity}
      ></FormDialog>
      <div style={{ height: 300, width: "80%", margin: "auto" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </>
  );
}
