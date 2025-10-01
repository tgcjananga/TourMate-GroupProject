import React, { useEffect, useState } from "react";
import Card from "../../components/PlaceCard/Card";
import "./AddBookmarks.css";
import {
  Box,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Typography,
} from "@mui/material";
import Navbar2 from "../../components/Navbar/Navbar2";
import { CircularProgress } from "@mui/material";
import { Error } from "@mui/icons-material";

export default function AddBookmarks() {
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  // Function to handle checkbox selection
  const handleTypeChange = (event) => {
    const value = event.target.name;
    if (event.target.checked) {
      setSelectedTypes([...selectedTypes, value]);
    } else {
      setSelectedTypes(selectedTypes.filter((type) => type !== value));
    }
  };

  // Function to filter attractions based on selected types
  useEffect(() => {
    const filtered = attractions.filter((attraction) => {
      const attractionTypes = attraction.type.split(", ");
      return selectedTypes.some((selectedType) =>
        attractionTypes.includes(selectedType)
      );
    });

    setFilteredPlaces(filtered); // Update filteredAttractions state
  }, [selectedTypes, attractions]); // Make sure to include attractions as a dependency

  // Function to fetch destination types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:1200/api/attractions/getTypes",
          {
            method: "get",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          console.log("Error fetching destination types:", response.status);
          return;
        }
        const data = await response.json();
        setTypes(data); // Set the response data (a list of strings) to state
      } catch (error) {
        console.log("Error fetching destination types");
      }
    };

    fetchTypes();
  }, []);

  // Function to fetch all attractions
  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const response = await fetch(
          "http://localhost:1200/api/attractions/getall",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setAttractions(data);
        } else {
          console.log("Error:", response.statusText);
          setError("Failed to fetch attractions");
        }
      } catch (error) {
        console.log("Error in fetching attractions from database");
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, []);

  // Function to fetch bookmarks
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
  }, []);

  //filtering based on City
  useEffect(() => {
    const filteredPlace = attractions.filter((place) => {
      return (
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    setFilteredPlaces(filteredPlace);
  }, [searchTerm, attractions]);

  if (loading) {
    return (
      <div className="loading">
        <CircularProgress size="5rem" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Navbar2 />
        <div
          style={{
            marginTop: "100px",
            height: "400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" marginRight="10px">
            {error}
          </Typography>{" "}
          <Error />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar2 />
      <div
        className="bookmark-container"
        style={{
          marginTop: "100px",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <h1 className="header-bookmark">Tourist Attractions</h1>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "5px",
          }}
        >
          <input
            type="text"
            placeholder="search by city or names"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            width: "80%",
          }}
        >
          <FormGroup
            sx={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {types.map((type, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    name={type}
                    checked={selectedTypes.includes(type)}
                    onChange={handleTypeChange}
                  />
                }
                label={type.charAt(0).toUpperCase() + type.slice(1)} // Capitalize first letter
              />
            ))}
          </FormGroup>
        </Box>

        {attractions.length === 0 && (
          <Box
            sx={{
              height: "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" sx={{ color: "red", marginRight: "10px" }}>
              No Attraction found
            </Typography>
            <Error />{" "}
          </Box>
        )}

        <Box
          display="flex"
          sx={{
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
            padding: 2,
            maxWidth: "100%",
          }}
        >
          {(filteredPlaces.length > 0 ? filteredPlaces : attractions).map(
            (attraction, _) => (
              <Card
                place={attraction}
                bookmarked={bookmarks.includes(attraction.apiLocationId)}
              />
            )
          )}
        </Box>
      </div>
    </>
  );
}
