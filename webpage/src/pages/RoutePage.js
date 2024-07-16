import React, { useRef, useEffect, useState } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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
  const [startCoordinates, setStartCoordinates] = useState(null); // State to hold the start coordinates
  const [destinationCoordinates, setDestinationCoordinates] = useState(null); // State to hold the destination coordinates
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
          setStartCoordinates([lat, lng]);
        } else if (!destinationMarkerRef.current) {
          // Set destination marker
          destinationMarkerRef.current = marker.addTo(mapRef.current);
          destinationMarkerRef.current
            .bindPopup(`<b>Destination:</b> ${locationName}`)
            .openPopup();
          setDestination(locationName);
          setDestinationCoordinates([lat, lng]);
        } else {
          // Clear previous markers and set new start marker
          mapRef.current.removeLayer(startMarkerRef.current);
          mapRef.current.removeLayer(destinationMarkerRef.current);
          startMarkerRef.current = marker.addTo(mapRef.current);
          startMarkerRef.current
            .bindPopup(`<b>Start:</b> ${locationName}`)
            .openPopup();
          setStartLocation(locationName);
          setStartCoordinates([lat, lng]);
          destinationMarkerRef.current = null;
          setDestination("");
          setDestinationCoordinates(null);
        }
      } else {
        console.error("Location name not found.");
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const findRoute = async () => {
    if (startCoordinates && destinationCoordinates) {
      // Display route on map
      if (routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current);
      }

      const routingControl = L.Routing.control({
        waypoints: [
          L.latLng(startCoordinates[0], startCoordinates[1]),
          L.latLng(destinationCoordinates[0], destinationCoordinates[1]),
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

        const instructions = route.instructions.map((instruction, index) => ({
          step: index + 1,
          text: instruction.text,
        }));

        setRouteInstructions(instructions);
      });

      // Update markers on map
      if (startMarkerRef.current) {
        mapRef.current.removeLayer(startMarkerRef.current);
      }
      if (destinationMarkerRef.current) {
        mapRef.current.removeLayer(destinationMarkerRef.current);
      }

      startMarkerRef.current = L.marker(startCoordinates).addTo(mapRef.current);
      startMarkerRef.current
        .bindPopup(`<b>Start:</b> ${startLocation}`)
        .openPopup();

      destinationMarkerRef.current = L.marker(destinationCoordinates).addTo(
        mapRef.current
      );
      destinationMarkerRef.current
        .bindPopup(`<b>Destination:</b> ${destination}`)
        .openPopup();
    } else {
      console.error("Please select both start and destination locations.");
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
              setStartCoordinates([latitude, longitude]);
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

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
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
            htmlFor="start-location"
            style={{
              marginRight: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Start:
          </label>
          <input
            type="text"
            id="start-location"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            placeholder="Enter start location"
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={useCurrentLocation}
            style={{
              padding: "10px 15px",
              fontSize: "16px",
              backgroundColor: "#007BFF",
              color: "#fff",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              marginLeft: "10px",
            }}
          >
            Use Current Location
          </button>
        </div>
        <div>
          <label
            htmlFor="destination"
            style={{
              marginRight: "10px",
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Destination:
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
            style={{
              padding: "10px",
              fontSize: "16px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
      </div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={findRoute}
          style={{
            padding: "10px 20px",
            fontSize: "18px",
            backgroundColor: "#28A745",
            color: "#fff",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Find Route
        </button>
      </div>
      <div id="map" style={{ height: "500px", marginBottom: "20px" }}></div>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#333",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Route Details
        </h2>
        <p
          style={{
            fontSize: "18px",
            color: "#555",
            marginBottom: "10px",
            textAlign: "center",
          }}
        >
          Travel Time: {Math.round(travelTime)} minutes
        </p>
        <p
          style={{
            fontSize: "18px",
            color: "#555",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Distance: {Math.round(distance * 100) / 100} km
        </p>
        <h3
          style={{
            fontSize: "20px",
            color: "#333",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Route Instructions
        </h3>
        <ul
          style={{
            fontSize: "16px",
            color: "#555",
            listStyleType: "decimal",
            paddingLeft: "20px",
          }}
        >
          {routeInstructions.map((instruction) => (
            <li key={instruction.step}>{instruction.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoutePage;
