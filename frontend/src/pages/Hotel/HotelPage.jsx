import {
  Box,
  Button,
  Grid,
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  Slider,
  Typography,
  CircularProgress,
  Popover,
  Checkbox,
  FormControlLabel,
  Tooltip,
  TextField,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import PlaceSuggest from "../../components/PlaceSuggest/PlaceSuggest";
import { getHotelData } from "../../api";
import HotelCard from "../../components/HotelCard/HotelCard";
import { debounce } from "lodash";
import { fetchExchangeRate } from "../../api";
import { HotelRounded, KeyboardArrowDown } from "@mui/icons-material";
import "./Hotel.css";
import Navbar from "../../components/Navbar/Navbar2";

export default function HotelPage() {
  const today = new Date().toISOString().split("T")[0];

  const [coordinates, setCoordinates] = useState(null);
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState("");
  const [hotels, setHotels] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [score, setScore] = useState();
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [numOfNights, setNumOfNights] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [children, setChildren] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [cancelChecked, setCancelChecked] = useState(false);
  const [prePayChecked, setPrePayChecked] = useState(false);
  const [enable, setEnable] = useState(false);

  const handleCheck = (event) => {
    setCancelChecked(event.target.checked);
  };

  const handleCheckPrePay = (event) => {
    setPrePayChecked(event.target.checked);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const getNumOfNights = () => {
    if (checkInDate && checkOutDate) {
      // Calculate the difference in time
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      // Difference in milliseconds
      const timeDiff = checkOut.getTime() - checkIn.getTime();

      // Convert milliseconds to days (1 day = 24 * 60 * 60 * 1000)
      const nights = timeDiff / (1000 * 60 * 60 * 24);

      // Only update if the difference is positive (valid date range)
      if (nights > 0) {
        setNumOfNights(nights);
      } else {
        setNumOfNights(0);
      }
    }
  };
  // Debounce to trigger state update after the user stops moving the slider
  const debouncedHandleChange = useCallback(debounce(handleChange, 100), []);

  useEffect(() => {
    // Function to fetch the exchange rate from USD to LKR
    fetchExchangeRate().then((rate) => {
      setExchangeRate(rate);
    });
  }, []);

  const createBound = (coordinates) => {
    const centerLat = parseFloat(coordinates.lat);
    const centerLng = parseFloat(coordinates.long);

    // Define a distance in degrees for latitude and longitude
    // Note: Adjust the distance as needed
    const latOffset = 0.1; // Latitude offset
    const lngOffset = 0.1; // Longitude offset

    // Calculate the southwest (SW) and northeast (NE) corners
    const swLat = centerLat - latOffset;
    const swLng = centerLng - lngOffset;
    const neLat = centerLat + latOffset;
    const neLng = centerLng + lngOffset;

    // Define the bounds
    const bounds = {
      sw: { lat: swLat, lng: swLng },
      ne: { lat: neLat, lng: neLng },
    };
    return bounds;
  };

  // Handle search and fetch Hotels
  const handleSearch = () => {
    setIsLoading(true);
    const bounds = createBound(coordinates);
    getHotelData(
      bounds.sw,
      bounds.ne,
      checkInDate,
      checkOutDate,
      rooms,
      adults,
      children
    ).then((data) => {
      if (data === undefined) {
        setHotels([]);
      }
      setHotels(data);
      setFilteredHotels([]);
      getNumOfNights();
      setScore(0);
      setIsLoading(false);
    });
  };

  // Set price range
  useEffect(() => {
    if (hotels && hotels.length > 0) {
      const prices = hotels.map((hotel) =>
        (
          hotel.priceDisplayInfo.displayPrice.amountPerStay.amountUnformatted *
          exchangeRate
        ).toFixed(0)
      );
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const roundedMin = Math.floor(min / 1000) * 1000;
      const roundedMax = Math.ceil(max / 1000) * 1000;
      setMinPrice(roundedMin);
      setMaxPrice(roundedMax);
      setPriceRange([roundedMin, roundedMax]);
    }
  }, [hotels, exchangeRate]);

  // Filter hotels
  useEffect(() => {
    const filterHotels = hotels.filter((hotel) => {
      const hotelScore = hotel.basicPropertyData.reviews.totalScore;
      const hotelPrice =
        hotel.priceDisplayInfo.displayPrice.amountPerStay.amountUnformatted *
        exchangeRate;
      const prePayCheck = hotel.policies.showNoPrepayment;
      const freeCancel = hotel.policies.showFreeCancellation;

      // Check if the hotel's score, price, prepayment, and cancellation policies match
      return (
        hotelScore >= score &&
        hotelPrice >= priceRange[0] &&
        hotelPrice <= priceRange[1] &&
        (!prePayChecked || prePayCheck) && // Filter by prepayment if prePayChecked is true
        (!cancelChecked || freeCancel) // Filter by free cancellation if cancelChecked is true
      );
    });

    setFilteredHotels(filterHotels);
  }, [score, priceRange, hotels, exchangeRate, prePayChecked, cancelChecked]);

  //Set enable for search button
  useEffect(() => {
    if (checkInDate && checkOutDate && coordinates) {
      setEnable(true);
    } else {
      setEnable(false);
    }
  }, [checkInDate, checkOutDate, coordinates]);

  //Helper function to get min checkout date
  const getMinCheckOutDate = (checkInDate) => {
    const date = new Date(checkInDate);
    date.setDate(date.getDate() + 1); // Increment by 1 day
    return date.toISOString().split("T")[0]; // Format the date to 'YYYY-MM-DD'
  };

  return (
    <>
      <Navbar />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-around"
        className="simple-header"
        sx={{
          height: "80px",
          position: "sticky",
          top: "100px",
          left: 0,
          width: "100%",
          zIndex: 1000,
          backgroundColor: "#fff",
        }}
      >
        <PlaceSuggest setCoordinates={setCoordinates}></PlaceSuggest>
        <Tooltip title="Check-in Date">
          <div>
            <TextField
              id="checkIn"
              label="Check-In Date"
              type="date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              InputLabelProps={{
                shrink: true, // Keeps the label shrunk above the input
              }}
              inputProps={{
                min: today, // Minimum date is today
              }}
              fullWidth
              required
            />
          </div>
        </Tooltip>
        <Tooltip title="Check-out Date">
          <div>
            <TextField
              id="checkout"
              label="Check-Out Date"
              type="date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              InputLabelProps={{
                shrink: true, // Keeps the label shrunk above the input
              }}
              inputProps={{
                min: getMinCheckOutDate(checkInDate) || today,
              }}
              fullWidth
              required
            />
          </div>
        </Tooltip>
        <div>
          {/* Single Dropdown Button */}
          <Button
            variant="outlined"
            onClick={handleClick}
            style={{ color: "grey" }} // Changing text color to grey
          >
            {adults > 0 && `${adults} adults`}
            {children > 0 && ` .${children} children`}
            {rooms > 0 && ` .${rooms} rooms`} <KeyboardArrowDown />
          </Button>

          {/* Popover Container */}
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Box p={2}>
              <Grid container spacing={2}>
                {/* Adults Dropdown */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Adults</InputLabel>
                    <Select
                      value={adults}
                      onChange={(event) => {
                        setAdults(event.target.value);
                      }}
                    >
                      {[...Array(10).keys()].map((value) => (
                        <MenuItem key={value + 1} value={value + 1}>
                          {value + 1} Adult{value + 1 > 1 ? "s" : ""}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Rooms Dropdown */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Rooms</InputLabel>
                    <Select
                      value={rooms}
                      onChange={(event) => {
                        setRooms(event.target.value);
                      }}
                    >
                      {[...Array(5).keys()].map((value) => (
                        <MenuItem key={value + 1} value={value + 1}>
                          {value + 1} Room{value + 1 > 1 ? "s" : ""}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Children Dropdown */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Children</InputLabel>
                    <Select
                      value={children}
                      onChange={(event) => {
                        setChildren(event.target.value);
                      }}
                    >
                      {[...Array(10).keys()].map((value) => (
                        <MenuItem key={value} value={value}>
                          {value} Child{value > 1 ? "ren" : ""}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Popover>
        </div>
        <Button
          variant="contained"
          disabled={!enable || isLoading}
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>
      <>
        {hotels.length === 0 && !isLoading && (
          <div
            className="no-results"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <h1 style={{ color: "grey", marginRight: "20px" }}>
              Find hotels for your trip
            </h1>
            <HotelRounded fontSize="large" />
          </div>
        )}
        {isLoading ? (
          <div className="loading">
            <CircularProgress size="5rem" />
          </div>
        ) : (
          hotels.length > 0 && (
            <Grid
              container
              spacing={3}
              style={{ width: "100%", padding: "10px" }}
            >
              <Grid
                item
                xs={2}
                md={4}
                sx={{
                  position: "fixed",
                  top: "200px",
                  left: "20vh",
                  width: "30%", // Sidebar width
                  height: "100vh", // Full viewport height
                  padding: "10px",
                }}
              >
                <FormControl
                  className="formControl"
                  sx={{ width: "50%", marginBottom: "40px" }}
                >
                  <InputLabel>Score</InputLabel>
                  <Select
                    value={score}
                    className="select"
                    onChange={(e) => setScore(e.target.value)}
                  >
                    <MenuItem value={6}>Pleasant 6+</MenuItem>
                    <MenuItem value={7}>Good 7+</MenuItem>
                    <MenuItem value={8}>Very Good 8+</MenuItem>
                    <MenuItem value={9}>Superb 9+</MenuItem>
                  </Select>
                </FormControl>
                <FormControl
                  className="formControl"
                  sx={{ width: "100%", height: "150px" }}
                >
                  <Box>
                    <Typography gutterBottom>Price Range</Typography>
                    <Slider
                      value={priceRange}
                      onChange={debouncedHandleChange}
                      valueLabelDisplay="auto"
                      min={minPrice}
                      max={maxPrice}
                      step={5000}
                      aria-labelledby="range-slider"
                      sx={{ width: "60%" }}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                        width: "60%",
                      }}
                    >
                      <Typography>Min: LKR {priceRange[0]}</Typography>
                      <Typography>Max: LKR {priceRange[1]}</Typography>
                    </Box>
                  </Box>
                </FormControl>
                <FormControl>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={cancelChecked}
                        onChange={handleCheck}
                        color="primary"
                      />
                    }
                    label="Free Cancelation"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={prePayChecked}
                        onChange={handleCheckPrePay}
                        color="primary"
                      />
                    }
                    label="No Prepayment"
                  />
                </FormControl>
              </Grid>

              <Grid
                item
                xs={10}
                md={8}
                sx={{
                  marginLeft: "35%",
                  overflowY: "auto",
                }}
              >
                {(filteredHotels.length ? filteredHotels : hotels)?.map(
                  (hotel, i) => (
                    <HotelCard
                      key={i}
                      hotel={hotel}
                      exchangeRate={exchangeRate}
                      nights={numOfNights}
                      adults={adults}
                      children={children}
                    />
                  )
                )}
              </Grid>
            </Grid>
          )
        )}
      </>
    </>
  );
}
