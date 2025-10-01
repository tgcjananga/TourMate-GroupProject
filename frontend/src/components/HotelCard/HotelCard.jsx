import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Rating,
  Button,
} from "@mui/material";
import "./HotelCard.css";
import { LocationOn, Check } from "@mui/icons-material";

export default function HotelCard({
  hotel,
  exchangeRate,
  nights,
  adults,
  children,
}) {
  const handleGoogleMapsClick = (hotelName) => {
    let googleMapsUrl;

    // Use the hotel name if coordinates are not available
    const encodedHotelName = encodeURIComponent(hotelName);
    googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedHotelName}`;

    window.open(googleMapsUrl, "_blank"); // Open in a new tab
  };
  return (
    <Card
      elevation={2}
      className="card"
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        minHeigh: "350px",
        marginBottom: "10px",
      }}
    >
      <CardMedia
        style={{ height: 250, width: 250 }}
        image={
          hotel.basicPropertyData.photos
            ? hotel.basicPropertyData.photos.main.lowResJpegUrl.absoluteUrl
            : "https://st4.depositphotos.com/14953852/24787/v/1600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg"
        }
        title={hotel.basicPropertyData.name}
        className="card-media"
      />
      <CardContent
        className="card-content"
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          className="upper"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "60%",
              flexDirection: "column",
              flexWrap: "wrap",
            }}
            className="upper-left"
          >
            <Box sx={{ display: "flex" }}>
              <Typography variant="h5" gutterBottom>
                {hotel.basicPropertyData.name}
              </Typography>
              {hotel.basicPropertyData.starRating && (
                <Rating
                  value={Number(hotel.basicPropertyData.starRating.value)}
                  precision={0.5}
                  readOnly
                  size="small"
                />
              )}
            </Box>
            <Box sx={{ display: "flex" }}>
              <LocationOn />
              <Typography marginRight="8px">
                {hotel.basicPropertyData.location.city}
              </Typography>
              <Typography variant="subtitle3">
                {hotel.basicPropertyData.location.distanceToPointOfSearchKm.toFixed(
                  1
                )}
                km from centre
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              width: "35%",
              flexWrap: "wrap",
              height: "30px",
            }}
            className="upper-right"
          >
            <Box
              sx={{ textAlign: "end", Width: "150px", paddingRight: "10px" }}
            >
              <Typography variant="h6">
                {hotel.basicPropertyData.reviews.totalScoreTextTag.translation}
              </Typography>
              <Typography variant="subtitle">
                {hotel.basicPropertyData.reviews.reviewsCount} reviews
              </Typography>
            </Box>
            <Box
              sx={{
                padding: "5px",
                width: "60px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#003b95",
                  color: "white",
                  padding: "4px",
                  borderRadius: "8px 8px 8px 0",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {hotel.basicPropertyData.reviews.totalScore}
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="bottom">
          <Box>
            <Box sx={{ display: "flex" }}>
              <Typography>
                {nights} night, {adults} adults
              </Typography>
              {children > 0 && <Typography>, {children} children</Typography>}
            </Box>
            {hotel.priceDisplayInfo && (
              <>
                <Typography variant="h5">
                  LKR{" "}
                  {(
                    hotel.priceDisplayInfo.displayPrice.amountPerStay
                      .amountUnformatted * exchangeRate
                  ).toFixed(2)}
                </Typography>
                <Typography variant="subtitle2">
                  + LKR{" "}
                  {(
                    hotel.priceDisplayInfo.excludedCharges
                      .excludeChargesAggregated.amountPerStay
                      .amountUnformatted * exchangeRate
                  ).toFixed(2)}{" "}
                  taxes and charges
                </Typography>
              </>
            )}
          </Box>
          <Box>
            {hotel.policies.showFreeCancellation === true && (
              <Box display="flex" alignItems="center">
                <Check color="success" />
                <Typography variant="body1" sx={{ ml: 1, color: "green" }}>
                  Free Cancellation
                </Typography>
              </Box>
            )}
            {hotel.policies.showNoPrepayment === true && (
              <Box display="flex" alignItems="center">
                <Check color="success" />
                <Typography variant="body1" sx={{ ml: 1, color: "green" }}>
                  No Prepayment
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                handleGoogleMapsClick(hotel.basicPropertyData.name)
              }
              size="small"
              sx={{ marginTop: "10px" }}
            >
              <LocationOn fontSize="small" />
              Show on map
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
