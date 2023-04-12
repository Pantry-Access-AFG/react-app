import React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { db } from "./firebase-config";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Confetti from "react-confetti";
import {
  InsertInventoryFormDialog,
  EditInventoryFormDialog,
} from "./components/Inventory";
import {
  InsertWantedFormDialog,
  EditWantedFormDialog,
} from "./components/WantedInventory";
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
  const [insertOpen, setInsertOpen] = useState(false);
  const [editInventoryOpen, setInventoryEditOpen] = useState(false);
  const [insertWantedOpen, setInsertWantedOpen] = useState(false);
  const [editWantedOpen, setEditWantedOpen] = useState(false);
  let [editIndex, setEditIndex] = useState(0);
  let [item, setItem] = useState("");
  let [quantity, setQuantity] = useState(0);
  let [editId, setEditId] = useState(0);
  const [confettiOn, setConfettiOn] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [quantityList, setQuantityList] = useState([]);
  const [inventoryRows, setInventoryRows] = useState(() => []);
  const [id] = useState(inventoryRows.length + 1);
  const [wantedItemList, setWantedItemList] = useState([]);
  const [wantedQuantityList, setWantedQuantityList] = useState([]);
  const [wantedRows, setWantedRows] = useState(() => []);

  /**
   * Function for handling opening the form dialog
   */
  const handleClickOpenInsert = () => {
    setInsertOpen(true);
  };

  /**
   * Function for handling opening the form dialog for wanted items
   */
  const handleClickOpenWanted = () => {
    setInsertWantedOpen(true);
  };

  /**
   * Function for handling closing the form dialog
   * Makes sure to reset the item and quantity state
   */
  const handleClose = () => {
    setInsertOpen(false);
    setInsertWantedOpen(false);
    setInventoryEditOpen(false);
    setEditWantedOpen(false);
    setInsertWantedOpen(false);
    setItem("");
    setQuantity(0);
  };

  /**
   * Function for deleting rows
   * Removes respective row and reinitializes row array
   */
  const deleteInventoryRowClick = (e, row, rows, index) => {
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
  };

  const deleteWantedRowClick = (e, row, rows, index) => {
    const docRef = doc(db, "inventory", "pantryUID");
    const deleteData = async () => {
      await updateDoc(docRef, {
        wantedItemList: wantedItemList
          .slice(0, index)
          .concat(wantedItemList.slice(index + 1, rows.length)),
        wantedQuantityList: wantedQuantityList
          .slice(0, index)
          .concat(wantedQuantityList.slice(index + 1, rows.length)),
      });
    };
    deleteData();
  };

  /**
   * Function for editing a row
   * Edits respective row and reinitializes row array
   */
  const editInventoryRowClick = (e, index) => {
    setEditIndex(index);
    setEditId(inventoryRows[index].id);
    setItem(inventoryRows[index].col1);
    setQuantity(inventoryRows[index].col2);
    setInventoryEditOpen(true);
  };

  const editWantedRowClick = (e, index) => {
    setEditIndex(index);
    setEditId(wantedRows[index].id);
    setItem(wantedRows[index].col1);
    setQuantity(wantedRows[index].col2);
    setEditWantedOpen(true);
  };

  // Inventory DataGrid columns
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
              onClick={(e) =>
                editInventoryRowClick(e, inventoryRows.indexOf(params.row))
              }
            >
              <EditIcon />
            </IconButton>

            <IconButton
              aria-label="delete"
              size="large"
              variant="contained"
              onClick={(e) =>
                deleteInventoryRowClick(
                  e,
                  params.row,
                  inventoryRows,
                  inventoryRows.indexOf(params.row)
                )
              }
            >
              <DeleteIcon />
            </IconButton>
          </>
        );
      },
    },
  ];

  // Wanted DataGrid columns
  const wantedColumns = [
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
              onClick={(e) =>
                editWantedRowClick(e, wantedRows.indexOf(params.row))
              }
            >
              <EditIcon />
            </IconButton>

            <IconButton
              aria-label="delete"
              size="large"
              variant="contained"
              onClick={(e) =>
                deleteWantedRowClick(
                  e,
                  params.row,
                  wantedRows,
                  wantedRows.indexOf(params.row)
                )
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
          setWantedItemList(doc.data()["wantedItemList"]);
          setQuantityList(doc.data()["quantityList"]);
          setWantedQuantityList(doc.data()["wantedQuantityList"]);
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

  useEffect(() => {
    let tempRows = [];
    for (let i = 0; i < wantedItemList.length; i += 1) {
      tempRows.push({
        id: i + 1,
        col1: wantedItemList[i],
        col2: wantedQuantityList[i],
        align: "center",
      });
    }
    setWantedRows(tempRows);
  }, [wantedItemList, wantedQuantityList]);

  /**
   * Function to handle inserting an item into the row
   * Opens the form dialog
   */
  const handleInsertInventoryItem = () => {
    handleClickOpenInsert();
  };

  /**
   * Inserts item to row by appending it to the end and increasing the id number
   */
  const insertItemInventory = ({ itemID = id, col1Name, col2Name }) => {
    const docRef = doc(db, "inventory", "pantryUID");
    const insertData = async () => {
      await updateDoc(docRef, {
        itemList: [...itemList, col1Name],
        quantityList: [...quantityList, col2Name],
      });
    };
    insertData();
    setConfettiOn(true);
  };

  const insertItemWanted = ({ itemID = id, col1Name, col2Name }) => {
    const docRef = doc(db, "inventory", "pantryUID");
    const insertData = async () => {
      await updateDoc(docRef, {
        wantedItemList: [...wantedItemList, col1Name],
        wantedQuantityList: [...wantedQuantityList, col2Name],
      });
    };
    insertData();
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
          onClick={handleInsertInventoryItem}
        >
          <AddIcon />
          Insert Item
        </Fab>
      </Box>
      <InsertInventoryFormDialog
        open={insertOpen}
        handleClose={handleClose}
        insertItem={insertItemInventory}
        item={item}
        setItem={setItem}
        quantity={quantity}
        setQuantity={setQuantity}
      ></InsertInventoryFormDialog>
      <EditInventoryFormDialog
        editOpen={editInventoryOpen}
        setEditOpen={setInventoryEditOpen}
        item={item}
        setItem={setItem}
        quantity={quantity}
        setQuantity={setQuantity}
        handleEditClose={handleClose}
        index={editIndex}
        rows={inventoryRows}
        setRows={setInventoryRows}
        id={editId}
        itemList={itemList}
        quantityList={quantityList}
      ></EditInventoryFormDialog>
      <InsertWantedFormDialog
        open={insertWantedOpen}
        handleClose={handleClose}
        insertItem={insertItemWanted}
        item={item}
        setItem={setItem}
        quantity={quantity}
        setQuantity={setQuantity}
      ></InsertWantedFormDialog>
      <InsertInventoryFormDialog
        editOpen={insertWantedOpen}
        setEditOpen={setEditWantedOpen}
        item={item}
        setItem={setItem}
        quantity={quantity}
        setQuantity={setQuantity}
        handleEditClose={handleClose}
        index={editIndex}
        insertItem={insertItemWanted}
        rows={wantedRows}
        setRows={setWantedRows}
        id={editId}
        itemList={wantedItemList}
        quantityList={wantedQuantityList}
      ></InsertInventoryFormDialog>
      <EditWantedFormDialog
        editOpen={editWantedOpen}
        setEditOpen={setEditWantedOpen}
        item={item}
        setItem={setItem}
        quantity={quantity}
        setQuantity={setQuantity}
        handleEditClose={handleClose}
        index={editIndex}
        rows={wantedRows}
        setRows={setWantedRows}
        id={editId}
        itemList={wantedItemList}
        quantityList={wantedQuantityList}
      ></EditWantedFormDialog>
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
      <Box sx={{ "& > :not(style)": { m: 3 } }} textAlign="center">
        <Fab
          color="primary"
          aria-label="add"
          variant="extended"
          onClick={() => handleClickOpenWanted()}
        >
          <AddIcon />
          Insert Item
        </Fab>
      </Box>
      <div style={{ height: 300, width: "80%", margin: "auto" }}>
        <DataGrid
          sx={{
            "& .bold": {
              fontWeight: "bold",
            },
          }}
          rows={wantedRows}
          columns={wantedColumns}
        />
      </div>
    </>
  );
}
