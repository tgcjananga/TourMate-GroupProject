import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const initialFormData = {
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

      // Log the response to the console
      const responseData = await response.json();
      console.log("Response from the backend:", responseData);

      if (response.ok) {
        console.log("Form Data Submitted Successfully");
        alert("Form is submitted");
        setFormData(initialFormData);
      } else {
        console.error(
          "Failed to submit form data:",
          response.status,
          responseData
        );
        alert(
          `Failed to submit form data: ${response.status} - ${responseData}`
        );
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
      alert("Error submitting form data");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstname">First Name</label>
        <input
          type="text"
          name="firstname"
          value={formData.firstname}
          onChange={handleInputChange}
          required
        />{" "}
        <br />
        <label htmlFor="lastname">Last Name</label>
        <input
          type="text"
          name="lastname"
          value={formData.lastname}
          onChange={handleInputChange}
          required
        />{" "}
        <br />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />{" "}
        <br />
        {/* Ensure all other fields are also controlled */}
        <label htmlFor="gender">Gender:</label>
        <select
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
        </select>{" "}
        <br />
        <label htmlFor="age">Age:</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          required
        />
        <br />
        <label htmlFor="places">Select your preferred places:</label>
        <br />
        <input
          type="checkbox"
          name="forest"
          onChange={handleInputChange}
          checked={formData.places.forest}
        />
        <label htmlFor="forest"> Forest</label>
        <br />
        <input
          type="checkbox"
          name="sea"
          onChange={handleInputChange}
          checked={formData.places.sea}
        />
        <label htmlFor="sea"> Sea</label>
        <br />
        <input
          type="checkbox"
          name="desert"
          onChange={handleInputChange}
          checked={formData.places.desert}
        />
        <label htmlFor="desert"> Desert </label>
        <br />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />{" "}
        <br />
        <label htmlFor="usertype">Are you a local or a foreigner?</label>
        <select
          name="usertype"
          value={formData.usertype}
          onChange={handleInputChange}
        >
          <option value="local">Local</option>
          <option value="foreigner">Foreigner</option>
        </select>{" "}
        <br />
        {formData.usertype === "local" ? (
          <div>
            <label htmlFor="nic">NIC Number:</label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleInputChange}
              required
            />
          </div>
        ) : (
          <div>
            <label htmlFor="passport">Passport Number:</label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleInputChange}
              required
            />
          </div>
        )}{" "}
        <br />
        <button type="submit" value="submit">
          SIGN UP
        </button>
        <p>
          Alredy have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
