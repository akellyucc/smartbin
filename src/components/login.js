import React, { useState } from 'react';
import axios from 'axios';
import '../styles/login.css'; // Import the custom CSS for styling

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous error message
    setError('');

    try {
      // Make an API request to login
      const response = await axios.post('http://localhost:3001/api/login', {
        email,
        password,
      });

      // Check if the login is successful
      if (response.data.token) {
        // Save the user data and token to localStorage
        const { user, token } = response.data;

        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

        // Call the onLogin callback with the user data
        onLogin(user);

        // Optionally, redirect to the dashboard or another protected route
        window.location.href = '/dashboard'; // Adjust this as needed
      }
    } catch (error) {
      // If the login fails, display the error message
      setError('Invalid credentials');
    }
  };

  return (
    <section id="login" className="py-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} id="login-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        <div className="form-group">
          <button type="submit">Login</button>
        </div>
        <p className="forgot-password">
          <a href="forgot-password.html">Forgot Password?</a>
        </p>
      </form>
      <p className="signup-link">
        Don't have an account? <a href="signup.html">Sign Up</a>
      </p>
    </section>
  );
};

export default Login;
