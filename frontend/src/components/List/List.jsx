/*
  List component which render Place in SearchPlace page
*/

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import React, { useState, useEffect, createRef } from "react";
import "./List.css";
import Place from "../Place/Place";

/**
 * List component which render Place in SearchPlace page
 *
 * @param {Array} places list of places from  API
 * @param {number} childClicked index of selected place
 * @param {boolean} isLoading whether the component is loading
 * @param {number} rating filter places by rating
 * @param {function} setRating setter for rating
 * @param {string} type filter places by type
 * @param {function} setType setter for type
 * @param {function} setCardSelect setter for selected place index
 */
export default function List({
  places,
  childClicked,
  isLoading,
  rating,
  setRating,
  type,
  setType,
  setCardSelect,
}) {
  const [elRefs, setElRefs] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const refs = Array(places?.length)
      .fill()
      .map((_, i) => elRefs[i] || createRef());
    setElRefs(refs);
  }, [places]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(
          "http://localhost:1200/api/user/getbookmarks",
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Bookmarks:", data);
          setBookmarks(data);
        } else {
          console.log("Error getting bookmarks:", response.status);
        }
      } catch (error) {
        console.log("Error fetching bookmarks");
      }
    };

    fetchBookmarks();
  }, [places]);

  return (
    <div
      className="container"
      style={{ position: "relative", height: "80vh", overflowY: "auto" }}
    >
      <Typography variant="h6">Restaurant & Attractions</Typography>
      {isLoading ? (
        <div className="loading">
          <CircularProgress size="5rem" />
        </div>
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <FormControl className="formControl" sx={{ zIndex: "10" }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                className="select"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="restaurants">Restaurants</MenuItem>
                <MenuItem value="hotels">Hotels</MenuItem>
                <MenuItem value="attractions">Attractions</MenuItem>
              </Select>
            </FormControl>
            <FormControl className="formControl" sx={{ zIndex: "10" }}>
              <InputLabel>Rating</InputLabel>
              <Select
                value={rating}
                className="select"
                onChange={(e) => setRating(e.target.value)}
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={3}>Above 3.0</MenuItem>
                <MenuItem value={4}>Above 4.0</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Grid
            container
            spacing={3}
            className="list"
            style={{ height: "70vh", overflowY: "auto" }}
          >
            {places?.map((place, i) => (
              <Grid item key={i} xs={12} ref={elRefs[i]}>
                <Place
                  place={place}
                  selected={childClicked === i}
                  refProp={elRefs[i]}
                  setCardSelect={setCardSelect}
                  index={i}
                  bookmarked={bookmarks.includes(Number(place.location_id))}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
}
