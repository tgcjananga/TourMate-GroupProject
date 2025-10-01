import { CssBaseline, Grid, Box, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import SearchHeader from "../components/SearchHeader/SearchHeader";
import Map from "../components/Map/Map";
import List from "../components/List/List";
import { getPlaceData } from "../api";
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar/Navbar2";

const SearchArea = ({ setSearchClicked, searchAreaBtn }) => {
  const handleClick = () => {
    setSearchClicked(true);
  };

  return (
    <Box
      display={searchAreaBtn ? "flex" : "none"}
      position="absolute"
      zIndex="1000"
      top="5%"
      left="40%"
      className="search-label"
      onClick={handleClick}
    >
      <Search />
      <Typography variant="subtitle">Search this area</Typography>
    </Box>
  );
};

function SearchPlace() {
  const [places, setPlace] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bound, setBound] = useState(null);
  const [childClicked, setChildClicked] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState("");
  const [type, setType] = useState("attractions");
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const previousBoundsRef = useRef(null);
  const previousTypeRef = useRef(type);
  const [searchClicked, setSearchClicked] = useState(false);
  const [searchAreaBtn, setSearchAreaBtn] = useState(false);
  const [cardSelect, setCardSelect] = useState(null);

  const threshold = 0.2; // Adjust this value as needed

  const hasSignificantBoundChange = (newBounds, oldBounds) => {
    if (!oldBounds) return true; // First run, no previous bounds to compare
    setSearchAreaBtn(true);
    const latDiff = Math.abs(
      newBounds._northEast.lat - oldBounds._northEast.lat
    );
    const lngDiff = Math.abs(
      newBounds._northEast.lng - oldBounds._northEast.lng
    );
    return latDiff > threshold || lngDiff > threshold;
  };

  // Get current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, long: longitude });
      },
      (error) => {
        console.error("Error getting location:", error);
        // Optionally set default coordinates
        setCoordinates({ lat: 6, long: 81 });
      }
    );
  }, []);

  useEffect(() => {
    const filteredPlaces = places.filter((place) => place.rating >= rating);
    setFilteredPlaces(filteredPlaces);
  }, [rating]);

  useEffect(() => {
    if (bound) {
      if (
        searchClicked ||
        hasSignificantBoundChange(bound, previousBoundsRef.current) ||
        type !== previousTypeRef.current
      ) {
        const fetchPlaces = () => {
          setIsLoading(true);
          getPlaceData(bound._southWest, bound._northEast, type).then(
            (data) => {
              setPlace(data?.filter((place) => place.name && place.rating > 0));
              setFilteredPlaces([]);
              setChildClicked(0);
              setIsLoading(false);
              console.log(data);

              // Update previousTypeRef and previousBoundsRef after fetching
              previousTypeRef.current = type;
              previousBoundsRef.current = bound;
            }
          );
        };

        fetchPlaces();
        setSearchClicked(false); // Reset after fetching
        setSearchAreaBtn(false);
        setCardSelect(null);
      }
    }
  }, [type, searchClicked, bound]);

  return (
    <>
      <CssBaseline />
      <Navbar />
      <SearchHeader setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: "90%", marginLeft: "3%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            isLoading={isLoading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
            setCardSelect={setCardSelect}
          />
        </Grid>
        <Grid item xs={12} md={8} position="relative">
          <Map
            setCoordinates={setCoordinates}
            setBound={setBound}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            cardSelect={cardSelect}
          />
          <SearchArea
            setSearchClicked={setSearchClicked}
            searchAreaBtn={searchAreaBtn}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default SearchPlace;
