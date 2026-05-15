import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './StaffLogin.css';
const StaffLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Update form values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await axios.post('https://rjtask-server.vercel.app/api/auth/login', formData);
      const { token, user } = res.data;

      if (user.status === 'blocked') {
        setMessage('Your account has been blocked by the admin.');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Navigate to the respective dashboard
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/staff/dashboard');
      }

    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setMessage(errorMsg);
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
        <h1>Task Manager</h1>
        <p>Manage your team, tasks, and productivity in one place.</p>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="login-right">
      <div className="form-box">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login as Staff</p>

        {message && <div className="error">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>

  </div>
);
};

export default StaffLogin;