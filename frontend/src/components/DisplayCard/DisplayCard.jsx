import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Rating,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "./DisplayCard.css";

const DisplayCard = ({
  name,
  imgUrl,
  rating,
  location,
  score,
  type,
  item,
  date,
  meal,
  handleClickCard,
  selected,
}) => {
  const handleClick = () => {
    handleClickCard(type, item, date, meal);
  };

  // Function to handle opening Google Maps
  const openInGoogleMaps = (name) => {
    const query = encodeURIComponent(name);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <Card
      sx={{
        maxWidth: 200,
        minWidth: 180,
        backgroundColor: selected ? "#94f769" : "white", // Change background if the item is selected
      }}
      onClick={handleClick}
      className="display-card"
    >
      <CardMedia
        component="img"
        height="140"
        image={
          imgUrl ||
          "https://st4.depositphotos.com/14953852/24787/v/1600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
        }
        alt={name}
      />
      <CardContent>
        {/* Name */}
        <Typography variant="h6" component="div">
          {name}
        </Typography>
        {/* Rating */}
        {rating && (
          <Typography variant="body2" color="text.secondary">
            <Rating value={rating} precision={0.5} readOnly size="small" />
          </Typography>
        )}

        {/* Location with Google Maps link */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent={"space-between"}
        >
          {/* Score */}
          {score && (
            <Box
              sx={{
                backgroundColor: "#003b95",
                color: "white",
                padding: "4px",
                borderRadius: "8px 8px 8px 0",
                display: "flex",
                justifyContent: "center",
                height: "30px",
                width: "30px",
              }}
            >
              {score}
            </Box>
          )}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body2" color="text.secondary" mr={1}>
              {location}
            </Typography>
            <IconButton onClick={() => openInGoogleMaps(name)} color="primary">
              <LocationOnIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DisplayCard;
