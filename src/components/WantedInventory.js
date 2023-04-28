import React from "react";
import Button from "@mui/material/Button";
import { db } from "../firebase-config";
import { doc, updateDoc } from "firebase/firestore";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

/**
 * Creates a form for inserting items into the Food Bank inventory
 * Inputs various states for determining whether the form should be open/closed or what functions should be performed when items are submitted into the table
 * @returns Form component
 */

// TODO: create a boolean state error for quantityInsert, nameInsert, quantityEdit, nameEdit that is toggled in the components when the text is still empty
// make the field error in textfield error = {errorQuantityInsert/NameInsert/...}
export function InsertWantedFormDialog({
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
export function EditWantedFormDialog({
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
  pantryID
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
      const docRef = doc(db, "inventory", pantryID);
      const editData = async () => {
        let tempItems = itemList.slice();
        tempItems[index] = item;
        let tempQuantity = quantityList.slice();
        tempQuantity[index] = quantity;
        await updateDoc(docRef, {
          wantedItemList: tempItems,
          wantedQuantityList: tempQuantity,
        });
      };
      editData();
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
