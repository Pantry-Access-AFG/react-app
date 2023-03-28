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

/**
 * Creates a form for inserting items into the Food Bank inventory
 * Inputs various states for determining whether the form should be open/closed or what functions should be performed when items are submitted into the table
 * @returns Form component
 */

// TODO: integrate with firebase

function FormDialog({
  open,
  handleClose,
  insertItem,
  item,
  setItem,
  quantity,
  setQuantity,
}) {
  /**
   * Function to handle insertting items into the DataGrid
   */
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

/**
 * Creates homepage which lists inventory in a DataGrid format and allows volunteers and organizers to input inventory into the database
 * @returns Home page
 */
export default function Home() {
  // States for form dialog
  const [open, setOpen] = useState(false);
  let [item, setItem] = useState("");
  let [quantity, setQuantity] = useState(0);

  /**
   * Function for handling opening the form dialog
   */
  const handleClickOpen = () => {
    setOpen(true);
  };

  /**
   * Function for handling closing the form dialog
   * Makes sure to reset the item and quantity state
   */
  const handleClose = () => {
    setOpen(false);
    setItem("");
    setQuantity(0);
  };

  /**
   * Function for deleting rows
   * Removes respective row and reinitializes row array
   */
  const deleteRowClick = (e, row, rows, index) => {
    setRows((rows) =>
      rows.slice(0, index).concat(rows.slice(index + 1, rows.length))
    );
  };

  // DataGrid columns
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
          // Delete/trash button for each row
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

  // State variable for holding rows in the table to be modified
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

  let [id, setId] = useState(rows.length+1);

  /**
   * Function to handle inserting an item into the row
   * Opens the form dialog
   */
  const handleInsertItem = () => {
    handleClickOpen();
  };

  /**
   * Inserts item to row by appending it to the end and increasing the id number
   */
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
