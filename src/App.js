import React from "react";
import Weather from "./Weather";
// import Globe from "./Globe";
import { Box } from "@mui/material";

function App() {
  return (
    <Box sx={rootContainer}>
      <Weather />
      {/* <Globe /> */}
    </Box>
  );
}

const rootContainer = {
  backgroundColor: "#1ecbe1",
  display: "flex",
  height: "100vh",
  width: "100vw",
};

export default App;
