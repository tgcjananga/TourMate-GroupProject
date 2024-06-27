import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Signup() {
  const initialFormData = {
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    gender: "",
    age: "",
    places: {
      forest: false,
      sea: false,
      desert: false,
    },
    usertype: "local",
    identifier: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        places: { ...prev.places, [name]: checked },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Convert the places object to a list of strings
    const selectedPlaces = Object.keys(formData.places).filter(
      (place) => formData.places[place]
    );

    const formDataWithPlacesList = {
      ...formData,
      places: selectedPlaces,
    };

    // Log form data to the console
    console.log("Form Data to be submitted:", formDataWithPlacesList);

    try {
      const response = await fetch("http://localhost:1200/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithPlacesList),
      });

      // Log the raw response
      console.log("Raw response:", response);

      // Check if response is not empty
      if (response.ok) {
        const responseData = await response.json();
        console.log("Response from the backend:", responseData);

        if (responseData) {
          console.log("Form Data Submitted Successfully");
          alert("Form is submitted");
          setFormData(initialFormData);
        } else {
          console.error("Failed to submit form data:", response.status, responseData);
          alert(`Failed to submit form data: ${response.status} - ${responseData}`);
        }
      } else {
        console.error("Failed to submit form data:", response.status);
        alert(`Failed to submit form data: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("Error submitting form data");
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            className="form-control"
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            className="form-control"
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            className="form-control"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select your gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            className="form-control"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Select your preferred places:</label>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="forest"
              onChange={handleInputChange}
              checked={formData.places.forest}
            />
            <label className="form-check-label" htmlFor="forest">Forest</label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="sea"
              onChange={handleInputChange}
              checked={formData.places.sea}
            />
            <label className="form-check-label" htmlFor="sea">Sea</label>
          </div>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="desert"
              onChange={handleInputChange}
              checked={formData.places.desert}
            />
            <label className="form-check-label" htmlFor="desert">Desert</label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="usertype">Are you a local or a foreigner?</label>
          <select
            className="form-control"
            name="usertype"
            value={formData.usertype}
            onChange={handleInputChange}
          >
            <option value="local">Local</option>
            <option value="foreigner">Foreigner</option>
          </select>
        </div>
        {formData.usertype === "local" ? (
          <div className="form-group">
            <label htmlFor="nic">NIC Number</label>
            <input
              type="text"
              className="form-control"
              name="identifier"
              value={formData.identifier}
              onChange={handleInputChange}
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="passport">Passport Number</label>
            <input
              type="text"
              className="form-control"
              name="identifier"
              value={formData.identifier}
              onChange={handleInputChange}
              required
            />
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          SIGN UP
        </button>
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
