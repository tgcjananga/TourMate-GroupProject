import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const initialFormData = {
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    gender: '',
    age: '',
    places: {
      forest: false,
      sea: false,
      desert: false
    },
    userType: 'local',
    identifier: '',
    password: ''
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        places: { ...prev.places, [name]: checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async(event) => {  //async for send backend asynchronus operations
    event.preventDefault();
//-----------------Send to Backend here-----------------------------------------
  try {
  const response = await fetch('YOUR_BACKEND_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  if (response.ok) {
    console.log('Form Data Submitted Successfully');
    alert('Form is submitted');
    setFormData(initialFormData);
  } else {
    console.error('Failed to submit form data');
    alert('Failed to submit form data');
  }
  } catch (error) {
  console.error('Error submitting form data:', error);
  alert('Error submitting form data');
  }
//-------------------------------------------------------------------------------
    //console.log('Form Data Submitted:', formData);
    //alert("Form is submitted");
    //setFormData(initialFormData);  // Reset the form data to initial
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required /> <br />

        <label htmlFor="lastName">Last Name</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required /> <br />

        <label htmlFor="email">Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required /> <br />

        {/* Ensure all other fields are also controlled */}
        <label htmlFor="gender">Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleInputChange} required>
          <option value="">Select your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select> <br />

        <label htmlFor="age">Age:</label>
        <input type="number" name="age" value={formData.age} onChange={handleInputChange} required /><br />

        <label htmlFor="places">Select your preferred places:</label><br />
        <input type="checkbox" name="forest" onChange={handleInputChange} checked={formData.places.forest} />
        <label htmlFor="forest"> Forest</label><br />
        <input type="checkbox" name="sea" onChange={handleInputChange} checked={formData.places.sea} />
        <label htmlFor="sea"> Sea</label><br />
        <input type="checkbox" name="desert" onChange={handleInputChange} checked={formData.places.desert} />
        <label htmlFor="desert"> Desert </label><br />

        <label htmlFor="password">Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleInputChange} required /> <br />

        <label htmlFor="userType">Are you a local or a foreigner?</label>
        <select name="userType" value={formData.userType} onChange={handleInputChange}>
          <option value="local">Local</option>
          <option value="foreigner">Foreigner</option>
        </select> <br />

        {formData.userType === 'local' ? (
          <div>
            <label htmlFor="nic">NIC Number:</label>
            <input type="text" name="identifier" value={formData.identifier} onChange={handleInputChange} required/>
          </div>
        ) : (
          <div>
            <label htmlFor="passport">Passport Number:</label>
            <input type="text" name="identifier" value={formData.identifier} onChange={handleInputChange} required />
          </div>
        )} <br />

        <button type="submit" value="submit">SIGN UP</button>

        <p>Don't have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  );
}
