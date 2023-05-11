import React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";
import { db } from "./firebase-config";
import { doc, updateDoc, onSnapshot, getDoc } from "firebase/firestore";
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
import useWindowSize from "react-use/lib/useWindowSize";
import { auth } from "./firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";

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
  const [food_bank_name, setName] = useState("");
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
  const { width, height } = useWindowSize();
  const [user, loading, error] = useAuthState(auth);

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
   * Removes respective row and updates it in Firebase firestore
   */
  const deleteInventoryRowClick = (e, row, rows, index) => {
    const docRef = doc(db, "inventory", user?.uid);
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

  /**
   * Function for deleting rows in the wanted items table
   * Removes respective row and updates it in Firebase firestore
   */
  const deleteWantedRowClick = (e, row, rows, index) => {
    const docRef = doc(db, "inventory", user?.uid ? user.uid : 0);
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
   * Edits respective row and opens the dialog to edit the item
   */
  const editInventoryRowClick = (e, index) => {
    setEditIndex(index);
    setEditId(inventoryRows[index].id);
    setItem(inventoryRows[index].col1);
    setQuantity(inventoryRows[index].col2);
    setInventoryEditOpen(true);
  };

  /**
   * Function for editing a row in the wanted items table
   * Edits respective row and opens the dialog to edit the item
   */
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
   * Runs on load of the component
   */
  useEffect(() => {
    async function getInventoryData() {
      if (user) {
        onSnapshot(doc(db, "inventory", user?.uid ? user.uid : 0), (doc) => {
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
    }
    getInventoryData();
  }, []);

  /**
   * For everytime itemList or quantityList changes, it will update the rows array with new updated data
   */
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

  /**
   * For everytime wantedItemList or wantedQuantityList changes, it will update the wantedRows array with new data
   */
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
   * On component load or startup, the user's name will be loaded from Firebase firestore and shown at the top of the page
   */
  useEffect(() => {
    if (user) {
      const getName = async () => {
        if (user) {
          let docRef = doc(db, "client-accounts", user?.uid);
          let docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setName(docSnap.data().full_name ? docSnap.data().full_name : "");
          } else {
            docRef = doc(db, "food-bank-accounts", user?.uid);
            docSnap = await getDoc(docRef);
            setName(docSnap.data().name ? docSnap.data().name : "");
          }
        }
      };
      getName();
    }
  }, [user]);

  /**
   * Function to handle inserting an item into the row
   * Opens the form dialog
   */
  const handleInsertInventoryItem = () => {
    handleClickOpenInsert();
  };

  /**
   * Inserts item to row by appending it to the end and updating Firebase Firestore inventory
   */
  const insertItemInventory = ({ itemID = id, col1Name, col2Name }) => {
    const docRef = doc(db, "inventory", user?.uid);
    const insertData = async () => {
      await updateDoc(docRef, {
        itemList: [...itemList, col1Name],
        quantityList: [...quantityList, col2Name],
      });
    };
    insertData();
    setConfettiOn(true);
  };

  /**
   * Inserts item to row by appending it to the end and updating Firebase Firestore list
   */
  const insertItemWanted = ({ itemID = id, col1Name, col2Name }) => {
    const docRef = doc(db, "inventory", user?.uid);
    const insertData = async () => {
      await updateDoc(docRef, {
        wantedItemList: [...wantedItemList, col1Name],
        wantedQuantityList: [...wantedQuantityList, col2Name],
      });
    };
    insertData();
    setConfettiOn(true);
  };

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
      {/*Dialogs for inventory */}
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
        pantryID={user ? user?.uid : 0}
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
      {/*Dialogs for wanted inventory */}
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
        pantryID={user ? user?.uid : 0}
      ></EditWantedFormDialog>
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
      <h1 style={{ textAlign: "center" }}>{food_bank_name}'s Food Needed</h1>
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
      <ConfettiMode
        confettiOn={confettiOn}
        setConfettiOn={setConfettiOn}
        width={width}
        height={height}
      ></ConfettiMode>
    </>
  );
}
