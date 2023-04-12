import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { db } from "./firebase-config";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
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
import EditIcon from "@mui/icons-material/Edit";
import Confetti from "react-confetti";

/**
 * Creates a form for inserting items into the Food Bank inventory
 * Inputs various states for determining whether the form should be open/closed or what functions should be performed when items are submitted into the table
 * @returns Form component
 */

// TODO: create a boolean state error for quantityInsert, nameInsert, quantityEdit, nameEdit that is toggled in the components when the text is still empty
// make the field error in textfield error = {errorQuantityInsert/NameInsert/...}
function InsertFormDialog({
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
            id="nameInsert"
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
            id="quantityInsert"
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
 * Creates a form for editing items into the Food Bank inventory
 * Inputs various states for determining whether the form should be open/closed or what functions should be performed when items are edited into the table
 * @returns Form component
 */
function EditFormDialog({
  editOpen,
  setEditOpen,
  item,
  setItem,
  quantity,
  setQuantity,
  handleEditClose,
  index,
  rows,
  setRows,
  id,
  itemList,
  quantityList,
}) {
  let defaultItem = "";
  let defaultQuantity = 0;

  if (rows.length > 0 && index >= 0 && index < rows.length) {
    defaultItem = rows[index].col1;
    defaultQuantity = rows[index].col2;
  }

  const handleEditItem = () => {
    if (!item) setItem(defaultItem);
    if (!quantity) setQuantity(defaultQuantity);
    if (item && quantity > 0) {
      //ONLY UPDATE FIREBASE
      const docRef = doc(db, "inventory", "pantryUID");
      const editData = async () => {
        let tempItems = itemList.slice();
        tempItems[index] = item;
        let tempQuantity = quantityList.slice();
        tempQuantity[index] = quantity;
        await updateDoc(docRef, {
          itemList: tempItems,
          quantityList: tempQuantity,
        });
      };
      editData();
      // setRows((rows) =>
      //   rows
      //     .slice(0, index)
      //     .concat({ id: id, col1: item, col2: quantity })
      //     .concat(rows.slice(index + 1, rows.length))
      // );
    }
    handleEditClose();
  };

  return (
    <>
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit Item</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="nameEdit"
            label="Item Name"
            type="text"
            fullWidth
            variant="standard"
            defaultValue={defaultItem}
            onChange={(event) => {
              setItem(() => {
                if (!event.target.value) return defaultItem;
                else return event.target.value;
              });
            }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="quantityEdit"
            label="Quantity"
            type="number"
            fullWidth
            variant="standard"
            defaultValue={defaultQuantity}
            onChange={(event) => {
              setQuantity(() => {
                if (event.target.value === 0) return defaultQuantity;
                else return event.target.value;
              });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditItem}>Update</Button>
          <Button onClick={handleEditClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

/**
 *
 * @returns Confetti object!
 */
const ConfettiMode = ({ confettiOn, setConfettiOn }) => {
  return (
    <div>
      <Confetti
        numberOfPieces={confettiOn ? 200 : 0}
        recycle={false}
        wind={0.05}
        gravity={2}
        onConfettiComplete={(confetti) => {
          setConfettiOn(false);
          confetti.reset();
        }}
      />
    </div>
  );
};

/**
 * Creates homepage which lists inventory in a DataGrid format and allows volunteers and organizers to input inventory into the database
 * @returns Home page
 */
export default function PantryHome() {
  // States for form dialog
  const [insertOpen, setRequestOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  let [editIndex, setEditIndex] = useState(0);
  let [item, setItem] = useState("");
  let [quantity, setQuantity] = useState(0);
  let [editId, setEditId] = useState(0);
  const [confettiOn, setConfettiOn] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [quantityList, setQuantityList] = useState([]);
  const [inventoryRows, setInventoryRows] = useState(() => []);
  const [id] = useState(inventoryRows.length + 1);

  /**
   * Function for handling opening the form dialog
   */
  const handleClickOpen = () => {
    setRequestOpen(true);
  };

  /**
   * Function for handling closing the form dialog
   * Makes sure to reset the item and quantity state
   */
  const handleClose = () => {
    setRequestOpen(false);
    setEditOpen(false);
    setItem("");
    setQuantity(0);
  };

  /**
   * Function for deleting rows
   * Removes respective row and reinitializes row array
   */
  const deleteRowClick = (e, row, rows, index) => {
    const docRef = doc(db, "inventory", "pantryUID");
    const deleteData = async () => {
      await updateDoc(docRef, {
        itemList: itemList
          .slice(0, index)
          .concat(itemList.slice(index + 1, rows.length)),
        quantityList: quantityList
          .slice(0, index)
          .concat(quantityList.slice(index + 1, rows.length)),
      });
    };
    deleteData();

    // setRows((rows) =>
    //   rows.slice(0, index).concat(rows.slice(index + 1, rows.length))
    // );
  };

  /**
   * Function for editing a row
   * Edits respective row and reinitializes row array
   */
  const editRowClick = (e, index) => {
    setEditIndex(index);
    setEditId(inventoryRows[index].id);
    setItem(inventoryRows[index].col1);
    setQuantity(inventoryRows[index].col2);
    setEditOpen(true);
  };

  // DataGrid columns
  const columns = [
    {
      field: "col1",
      headerName: "Item",
      flex: 1,
      width: "25%",
      align: "center",
      headerAlign: "center",
      headerClassName: "bold",
    },
    {
      field: "col2",
      headerName: "Quantity",
      flex: 1,
      width: "25%",
      align: "center",
      headerAlign: "center",
      headerClassName: "bold",
    },
    {
      field: "actions",
      headerName: "Edit",
      width: "25%",
      align: "center",
      flex: 1,
      headerAlign: "center",
      headerClassName: "bold",
      renderCell: (params) => {
        return (
          // Delete/trash button for each row
          <>
            <IconButton
              aria-label="delete"
              size="large"
              variant="contained"
              onClick={(e) => editRowClick(e, inventoryRows.indexOf(params.row))}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              aria-label="delete"
              size="large"
              variant="contained"
              onClick={(e) =>
                deleteRowClick(e, params.row, inventoryRows, inventoryRows.indexOf(params.row))
              }
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  /**
   * Retrives items and quantities from firebase for this food pantry
   */
  useEffect(() => {
    async function getInventoryData() {
      onSnapshot(doc(db, "inventory", "pantryUID"), (doc) => {
        if (doc.exists()) {
          setItemList(doc.data()["itemList"]);
          setQuantityList(doc.data()["quantityList"]);
        } else {
          console.log("Nothing!");
        }
      });
    }
    getInventoryData();
  }, []);

  useEffect(() => {
    let tempRows = [];
    for (let i = 0; i < itemList.length; i += 1) {
      tempRows.push({
        id: i + 1,
        col1: itemList[i],
        col2: quantityList[i],
        align: "center",
      });
    }
    setInventoryRows(tempRows);
  }, [itemList, quantityList]);

  // const fetchData = async () => {
  //   const docRef = doc(db, "inventory", "pantryUID");
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     setItemList(docSnap.data()["itemList"]);
  //     setQuantityList(docSnap.data()["quantityList"]);
  //     let tempRows = [];
  //     for (let i = 0; i < itemList.length; i += 1) {
  //       tempRows.push({
  //         id: i + 1,
  //         col1: itemList[i],
  //         col2: quantityList[i],
  //         align: "center",
  //       });
  //     }
  //     setRows(tempRows);
  //   } else {
  //     console.log("Nothing!");
  //   }
  // };
  // fetchData();

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
    const docRef = doc(db, "inventory", "pantryUID");
    const insertData = async () => {
      await updateDoc(docRef, {
        itemList: [...itemList, col1Name],
        quantityList: [...quantityList, col2Name],
      });
    };
    insertData();
    /* setId(id + 1);
    setRows((rows) => [
      ...rows,
      { id: itemID, col1: col1Name, col2: col2Name },
    ]);*/
    setConfettiOn(true);
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
      <InsertFormDialog
        open={insertOpen}
        handleClose={handleClose}
        insertItem={insertItem}
        item={item}
        setItem={setItem}
        quantity={quantity}
        setQuantity={setQuantity}
      ></InsertFormDialog>
      <EditFormDialog
        editOpen={editOpen}
        setEditOpen={setEditOpen}
        item={item}
        setItem={setItem}
        quantity={quantity}
        setQuantity={setQuantity}
        handleEditClose={handleClose}
        index={editIndex}
        insertItem={insertItem}
        rows={inventoryRows}
        setRows={setInventoryRows}
        id={editId}
        itemList={itemList}
        quantityList={quantityList}
      ></EditFormDialog>
      <ConfettiMode
        confettiOn={confettiOn}
        setConfettiOn={setConfettiOn}
      ></ConfettiMode>
      <div style={{ height: 300, width: "80%", margin: "auto" }}>
        <DataGrid
          sx={{
            "& .bold": {
              fontWeight: "bold",
            },
          }}
          rows={inventoryRows}
          columns={columns}
        />
      </div>
      <h1 style={{ textAlign: "center" }}>Food Needed</h1>
    </>
  );
}
