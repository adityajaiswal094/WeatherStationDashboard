import React from "react";
import { Box, Typography } from "@mui/material";

export default function GridContent({ title, subtitle, icon }) {
  return (
    <Box sx={gridItem}>
      <Box display={"flex"} paddingX={3} justifyContent={"space-between"}>
        <Typography>{title}</Typography>
        {icon}
      </Box>
      <Box height={30} />
      <Box sx={subtitleStyle}>
        <Typography fontSize={40}>{subtitle}</Typography>
      </Box>
    </Box>
  );
}

const gridItem = {
  height: 130,
  width: 250,
  borderRadius: 10,
  backgroundColor: "white",
  overflow: "hidden",
  paddingTop: 1,
};

const subtitleStyle = {
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
};
