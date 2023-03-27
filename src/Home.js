import React from "react";
import Box from "@mui/material/Box";
import { useState } from "react";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function Home() {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 150, align:"center" },
    { field: "col1", headerName: "Column 1", width: 150, align:"center" },
    { field: "col2", headerName: "Column 2", width: 150, align:"center"},
  ];

  let [rows, setRows] = useState(() => [
    { id: 1, col1: "Hello", col2: "World", align:"center" },
    { id: 2, col1: "DataGridPro", col2: "is Awesome", align:"center"  },
    { id: 3, col1: "MUI", col2: "is Amazing", align:"center"  },
  ]);

  let [id, setId] = useState(4);

  const insertItem = () => {
    setRows((rows) => [...rows, { id, col1: "Hi", col2: "hello" }]);
    setId(id + 1);
  };

  return (
    <>
      <Box sx={{ "& > :not(style)": { m: 3 } }} textAlign="center">
        <Fab
          color="primary"
          aria-label="add"
          variant="extended"
          onClick={insertItem}
        >
          <AddIcon />
          Insert Item
        </Fab>
      </Box>
      <div style={{ height: 300, width: "80%" }}>
        <DataGrid rows={rows} columns={columns} />
      </div>
    </>
  );
}
