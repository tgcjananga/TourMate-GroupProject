import React, { useState, useCallback, useRef } from "react";
import { InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./PlaceSuggest.css";

// Debounce function
function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
}

export default function PlaceSuggest({ setCoordinates }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  const handleInputClick = () => {
    if (inputRef.current) {
      inputRef.current.select(); // Select all text inside the input
    }
  };

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const results = await response.json();
        setSuggestions(results);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]); // Clear suggestions in case of an error
      }
    }, 300), // Debounce delay in milliseconds
    []
  );

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    const lat = suggestion.lat;
    const lon = suggestion.lon;
    setCoordinates({ lat, long: lon });
    setSearchTerm(suggestion.display_name);
    setSuggestions([]); // Clear suggestions after selection
  };

  return (
    <div className="search">
      <div className="searchIcon">
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search City"
        className="input"
        value={searchTerm}
        onChange={handleInputChange}
        onClick={handleInputClick}
        inputRef={inputRef}
      />
      {suggestions.length > 0 && (
        <ul className="suggestionsList">
          {suggestions.map((suggestion, index) => (
            <li
              className="suggestion"
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
