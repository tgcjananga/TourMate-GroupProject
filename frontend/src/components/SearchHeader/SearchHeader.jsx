import React from "react";
import { Box, Typography } from "@mui/material";
import "./Header.css";
import PlaceSuggest from "../PlaceSuggest/PlaceSuggest";

export default function SearchHeader({ setCoordinates }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      className="simple-header"
    >
      <Typography variant="h6" className="title">
        Explore New Places
      </Typography>
      <PlaceSuggest setCoordinates={setCoordinates} />
    </Box>
  );
}
