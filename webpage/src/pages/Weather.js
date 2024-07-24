import React, { useState } from 'react';

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const apiKey = 'e377fd55facb2377d09d8783ca1c1d59';

  const getWeather = async (location) => {
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching weather data: ${response.status} - ${errorText}`);
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setWeather(data);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching weather data: ', error);
      setError('Failed to fetch weather data. Please try again.');
      setWeather(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await getWeather(location);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Weather Report</h2>
      <form onSubmit={handleSubmit} className="d-flex justify-content-center mb-4">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="form-control me-2"
          placeholder="Enter location"
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      {error && <p className="text-danger text-center">{error}</p>}
      {weather && weather.main && (
        <div className="text-center">
          <div className="card" style={{ backgroundColor: 'lightblue' }}>
            <div className="card-body">
              <h5 className="card-title">Weather Details for {weather.name}</h5>
              <p className="card-text">Current Temperature: {weather.main.temp}°C</p>
              <p className="card-text">Weather: {weather.weather[0].description}</p>
              <p className="card-text">Humidity: {weather.main.humidity}%</p>
              <p className="card-text">Pressure: {weather.main.pressure} hPa</p>
              <p className="card-text">Wind Speed: {weather.wind.speed} m/s</p>
              <p className="card-text">Visibility: {weather.visibility / 1000} km</p>
              <p className="card-text">Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
              <p className="card-text">Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;