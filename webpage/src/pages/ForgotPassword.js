import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP, Step 3: Reset Password
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmitEmail = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`http://localhost:1200/forgotPassword/verifyMail/${email}`, {
        method: 'POST',
      });

      if (response.ok) {
        setStep(2); // Move to step 2 (Enter OTP)
      } else {
        setErrorMessage('Failed to send OTP');
      }
    } catch (error) {
      setErrorMessage('Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOTP = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`http://localhost:1200/forgotPassword/verifyOtp/${otp}/${email}`, {
        method: 'POST',
      });

      if (response.ok) {
        console.log("otp is",otp);
        setStep(3); // Move to step 3 (Reset Password)
      } else {
        setErrorMessage('OTP verification failed');
      }
    } catch (error) {
      setErrorMessage('Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`http://localhost:1200/forgotPassword/changePassword/${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword, repeatPassword: confirmPassword }),
      });

      if (response.ok) {
        navigate('/Login'); // Redirect to login after password reset
      } else {
        setErrorMessage('Password reset failed');
      }
    } catch (error) {
      setErrorMessage('Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      
      {step === 1 && (
        <form onSubmit={handleSubmitEmail} className="w-50 mx-auto">
          <div className="form-group">
            <label htmlFor="email">Enter your email to receive OTP:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmitOTP} className="w-50 mx-auto">
          <div className="form-group">
            <label htmlFor="otp">Enter OTP sent to your email:</label>
            <input
              type="text"
              className="form-control"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmitResetPassword} className="w-50 mx-auto">
          <div className="form-group">
            <label htmlFor="newPassword">Enter new password:</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm new password:</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {newPassword !== confirmPassword && (
              <div className="text-danger">Passwords do not match!</div>
            )}
          </div>
          <button type="submit" className="btn btn-primary mt-3" disabled={loading || newPassword !== confirmPassword}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <div className="text-center mt-3">
        <Link to="/Login" className="btn btn-link">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
