import React, { useState } from 'react';
import axios from 'axios';
import './StaffLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post('https://rjtask-server.vercel.app/api/auth/admin-login', formData);
      console.log(res, "ressss");

      const { token, user } = res.data;

      if (user.role !== 'admin') {
        setMessage('Access denied. You are not an admin.');
        setLoading(false);
        return;
      }

      if (user.status === 'blocked') {
        setMessage('Your account is blocked.');
        setLoading(false);
        return;
      }

      // Save token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to admin panel
      window.location.href = '/admin';

    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="login-container">

    {/* LEFT SIDE */}
    <div
      className="login-left"
      style={{
        backgroundImage: "url('/rjLOGO2.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative"
      }}
    >
      <div className="overlay">
        <h1>Admin Panel</h1>
        <p>Control users, monitor tasks, and manage the entire system securely.</p>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="login-right">
      <div className="form-box">
        <h2>Admin Login</h2>

        {message && <div className="error">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Admin email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Login as Admin"}
          </button>
        </form>
      </div>
    </div>

  </div>
);
};

export default AdminLogin;