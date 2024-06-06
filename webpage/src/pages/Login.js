import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Logtest() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // For navigation after successful login

    const handleSubmit = async (event) => {  //async for handle asynchronus operation
        event.preventDefault();/*
// --------- authentication logic--------------------------------------------
// Send login request to backend
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      // Login successful, navigate to dashboard
      navigate('/dashboard');
    } else {
      // Login failed, handle error (e.g., show error message)
      console.error('Login failed');
    }
//--------------------------------------------------------------------------*/

        console.log("Logging in with:", email, password);
         navigate('/Home'); 
         //above two line should be comment when connect backend
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>EMAIL</label><br />
                <input type='email' value={email} onChange={e => setEmail(e.target.value)} required /><br />

                <label>PASSWORD</label><br />
                <input type='password' value={password} onChange={e => setPassword(e.target.value)} required /><br />

                <button type='submit'>LOG IN</button><br />
                <label>Don't have an account</label> 
            </form>      

            <Link to="/Signup">SIGN UP</Link>
        </div>
    );
}
