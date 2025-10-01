import React, { useState, useEffect } from "react";
import "./Card.css";
import {
  LocationOn,
  Phone,
  BookmarkTwoTone as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Typography,
  useMediaQuery,
  Tooltip,
  IconButton,
} from "@mui/material";

export default function AttractionCard({ place, bookmarked }) {
  const [Bookmark, setBookmark] = useState(false);

  // Check if place is bookmarked
  useEffect(() => {
    if (bookmarked) {
      setBookmark(true);
    }
  }, [place, bookmarked]);

  const isDesktop = useMediaQuery("(min-width:600px)");
  const handleBookmark = async () => {
    try {
      const url = Bookmark
        ? "http://localhost:1200/api/user/removebookmark"
        : "http://localhost:1200/api/user/addbookmarks";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: place.name,
          description: place.description,
          latitude: Number(place.latitude),
          longitude: Number(place.longitude),
        }),
      });

      if (response.ok) {
        const data = await response.text();
        console.log(data);
        setBookmark((prevBookmark) => !prevBookmark);
      } else {
        console.log("Error adding/removing bookmark:", response.statusText);
      }
    } catch (error) {
      console.log("Error in fetching data:", error);
    }
  };

  return (
    <Card elevation={6} className="card" sx={{ width: 300 }}>
      <CardMedia
        style={{ height: 250, position: "relative" }}
        image={
          place.imgUrl
            ? place.imgUrl
            : "https://st4.depositphotos.com/14953852/24787/v/1600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
        }
        title={place.name}
        className="card-media"
      >
        <Box sx={{ position: "absolute", top: 10, right: 10 }}>
          <Tooltip title="Add bookmark">
            <IconButton onClick={handleBookmark} style={{ cursor: "pointer" }}>
              {Bookmark ? (
                <BookmarkIcon
                  fontSize="large"
                  sx={{
                    color: "yellow",
                  }}
                />
              ) : (
                <BookmarkBorderIcon
                  fontSize="large"
                  sx={{
                    color: "white",
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </CardMedia>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {place.name}
        </Typography>
        <Box display="flex" justifyContent="space-between">
          <Rating
            value={Number(place.rating)}
            precision={0.5}
            readOnly
            size="small"
          />
        </Box>
        {place.type.split(",").map((name) => (
          <Chip
            key={name.trim()}
            size="small"
            label={name.trim()}
            className="chip"
          />
        ))}
        {place.address && (
          <Typography
            gutterBottom
            variant="subtitle2"
            color="textSecondary"
            className="subtitle"
          >
            <LocationOn />
            {place.address}
          </Typography>
        )}
        {place.phone && (
          <Typography
            gutterBottom
            variant="subtitle2"
            color="textSecondary"
            className="spacing"
          >
            <Phone />
            {isDesktop ? (
              <span className="phoneLink">{place.phone}</span>
            ) : (
              <a href={`tel:${place.phone}`} className="phoneLink">
                {place.phone}
              </a>
            )}
          </Typography>
        )}
      </CardContent>
      <CardActions></CardActions>
    </Card>
  );
}
