import React, { useRef, useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import Navbar2 from "../components/Navbar/Navbar2";
import Navbar1 from "../components/Navbar/Navbar";
import { useAuth } from "../utils/AuthContext";

// Ensure the marker icon is correctly displayed
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const RoutePage = () => {
  const mapRef = useRef(null); // Reference for the map instance
  const routingControlRef = useRef(null); // Reference for the routing control
  const startMarkerRef = useRef(null); // Reference for the start location marker
  const destinationMarkerRef = useRef(null); // Reference for the destination marker
  const [startLocation, setStartLocation] = useState(""); // State to hold the start location
  const [destination, setDestination] = useState(""); // State to hold the destination
  const [travelTime, setTravelTime] = useState(""); // State to hold the travel time
  const [distance, setDistance] = useState(""); // State to hold the distance
  const [routeInstructions, setRouteInstructions] = useState([]); // State to hold the route instructions

  useEffect(() => {
    // Initialize map if it's not already initialized
    if (!mapRef.current) {
      const map = L.map("map").setView([7.8731, 80.7718], 7); // Center the map on Sri Lanka
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;

      // Add click event to set markers
      mapRef.current.on("click", handleMapClick);
    }
  }, []);

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    const marker = L.marker([lat, lng]);

    try {
      // Reverse geocode to get location name
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.display_name) {
        const locationName = data.display_name;

        if (!startMarkerRef.current) {
          // Set start marker
          startMarkerRef.current = marker.addTo(mapRef.current);
          startMarkerRef.current
            .bindPopup(`<b>Start:</b> ${locationName}`)
            .openPopup();
          setStartLocation(locationName);
        } else if (!destinationMarkerRef.current) {
          // Set destination marker
          destinationMarkerRef.current = marker.addTo(mapRef.current);
          destinationMarkerRef.current
            .bindPopup(`<b>Destination:</b> ${locationName}`)
            .openPopup();
          setDestination(locationName);
        } else {
          // Clear previous markers and set new start marker
          mapRef.current.removeLayer(startMarkerRef.current);
          mapRef.current.removeLayer(destinationMarkerRef.current);
          startMarkerRef.current = marker.addTo(mapRef.current);
          startMarkerRef.current
            .bindPopup(`<b>Start:</b> ${locationName}`)
            .openPopup();
          destinationMarkerRef.current = null;
          setStartLocation(locationName);
          setDestination("");
        }
      } else {
        console.error("Location name not found.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const findRoute = async () => {
    // Get start and destination locations from state variables
    const startLocationValue = startLocation.trim();
    const destinationValue = destination.trim();

    if (startLocationValue && destinationValue) {
      try {
        // Geocode start location
        const startResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            startLocationValue
          )}`
        );
        const startData = await startResponse.json();

        if (startData && startData.length > 0) {
          const startLatLng = [
            parseFloat(startData[0].lat),
            parseFloat(startData[0].lon),
          ];

          // Geocode destination
          const destinationResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              destinationValue
            )}`
          );
          const destinationData = await destinationResponse.json();

          if (destinationData && destinationData.length > 0) {
            const destinationLatLng = [
              parseFloat(destinationData[0].lat),
              parseFloat(destinationData[0].lon),
            ];

            // Display route on map
            if (routingControlRef.current) {
              mapRef.current.removeControl(routingControlRef.current);
            }

            const routingControl = L.Routing.control({
              waypoints: [
                L.latLng(startLatLng[0], startLatLng[1]),
                L.latLng(destinationLatLng[0], destinationLatLng[1]),
              ],
              routeWhileDragging: true,
              show: true,
              createMarker: function (i, wp, nWps) {
                return L.marker(wp.latLng).bindPopup(
                  `<b>${i === 0 ? "Start" : "Destination"}:</b> ${wp.name}`
                );
              },
            }).addTo(mapRef.current);

            routingControlRef.current = routingControl;

            // Update travel time, distance, and route instructions
            routingControl.on("routesfound", function (e) {
              const route = e.routes[0];
              setTravelTime(route.summary.totalTime / 60); // Convert seconds to minutes
              setDistance(route.summary.totalDistance / 1000); // Convert meters to kilometers

              const instructions = route.instructions.map(
                (instruction, index) => ({
                  step: index + 1,
                  text: instruction.text,
                })
              );

              setRouteInstructions(instructions);
            });

            // Update markers on map
            if (startMarkerRef.current) {
              mapRef.current.removeLayer(startMarkerRef.current);
            }
            if (destinationMarkerRef.current) {
              mapRef.current.removeLayer(destinationMarkerRef.current);
            }

            startMarkerRef.current = L.marker(startLatLng).addTo(
              mapRef.current
            );
            startMarkerRef.current
              .bindPopup(`<b>Start:</b> ${startLocationValue}`)
              .openPopup();

            destinationMarkerRef.current = L.marker(destinationLatLng).addTo(
              mapRef.current
            );
            destinationMarkerRef.current
              .bindPopup(`<b>Destination:</b> ${destinationValue}`)
              .openPopup();
          } else {
            console.error("Geocode for destination was not successful.");
          }
        } else {
          console.error("Geocode for start location was not successful.");
        }
      } catch (error) {
        console.error("Error fetching geocoding data:", error);
      }
    } else {
      console.error("Please enter both start and destination locations.");
    }
  };

  const useCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Clear previous markers
            if (startMarkerRef.current) {
              mapRef.current.removeLayer(startMarkerRef.current);
            }
            if (destinationMarkerRef.current) {
              mapRef.current.removeLayer(destinationMarkerRef.current);
            }

            // Set start marker
            const startMarker = L.marker([latitude, longitude]).addTo(
              mapRef.current
            );

            // Reverse geocode to get location name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();

            if (data && data.display_name) {
              const locationName = data.display_name;
              startMarker
                .bindPopup(`<b>Start:</b> ${locationName}`)
                .openPopup();
              setStartLocation(locationName);
            } else {
              console.error("Location name not found.");
            }
          } catch (error) {
            console.error("Error fetching location data:", error);
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported.");
    }
  };
  const { isAuthenticated } = useAuth();
  return (
    <div  style={{paddingTop:'120px'}}>
    {isAuthenticated ? <Navbar2 /> : <Navbar1 />} 
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          marginTop: "100px",
          padding: "20px",
          maxWidth: "1000px",
          margin: "0 auto",
          backgroundColor: "#f0f0f0",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#007BFF",
            fontSize: "32px",
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Route Finder
        </h1>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ marginRight: "20px" }}>
            <label
              htmlFor="start"
              style={{ display: "block", marginBottom: "5px", color: "#333" }}
            >
              Start Location:
            </label>
            <input
              type="text"
              id="start"
              placeholder="Enter start location"
              style={{
                padding: "8px",
                width: "250px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginRight: "10px",
                fontSize: "14px",
              }}
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
            />
            <button
              onClick={useCurrentLocation}
              style={{
                padding: "8px 16px",
                backgroundColor: "#28A745", // Green color
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px",
                marginLeft: "10px",
                fontSize: "14px",
              }}
            >
              Use Current Location
            </button>
          </div>
          <div>
            <label
              htmlFor="destination"
              style={{ display: "block", marginBottom: "5px", color: "#333" }}
            >
              Destination:
            </label>
            <input
              type="text"
              id="destination"
              placeholder="Enter destination"
              style={{
                padding: "8px",
                width: "250px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                marginRight: "10px",
                fontSize: "14px",
              }}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            <button
              onClick={findRoute}
              style={{
                padding: "8px 16px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              Find Route
            </button>
          </div>
        </div>
        <div
          id="map"
          style={{
            height: "500px",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        ></div>
        {travelTime && distance && (
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              backgroundColor: "#ffffff",
              border: "1px solid #ccc",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <p>
              <strong>Travel Time:</strong> {travelTime.toFixed(2)} minutes
            </p>
            <p>
              <strong>Distance:</strong> {distance.toFixed(2)} kilometers
            </p>
          </div>
        )}
        {routeInstructions.length > 0 && (
          <div style={{ marginBottom: "20px" }}>
            <h2
              style={{
                textAlign: "center",
                marginBottom: "10px",
                color: "#007BFF",
                fontSize: "24px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Route Instructions
            </h2>
            <ol
              style={{
                listStyleType: "decimal",
                paddingLeft: "20px",
                fontSize: "16px",
              }}
            >
              {routeInstructions.map((instruction) => (
                <li key={instruction.step} style={{ marginBottom: "10px" }}>
                  {instruction.text}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoutePage;
