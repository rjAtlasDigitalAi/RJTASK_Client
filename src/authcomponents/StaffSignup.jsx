import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import './StaffSignup.css';
const StaffSignup = (isOpen) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    assistantManager: '',
    contactNumber: '',
    password: '',
  });
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [assistantManagers, setAssistantManagers] = useState([]);
  useEffect(() => {
    if (isOpen) {
      axios
        .get("https://rjtask-server.vercel.app/api/assistant-managers")
        .then((res) => setAssistantManagers(res.data))
        .catch((err) =>
          console.error("Error fetching assistant managers:", err)
        );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await axios.post('https://rjtask-server.vercel.app/api/auth/signup', formData);
      setMessage(res.data.message || 'Signup successful!');
       if (res.data.success) {
        // ✅ Redirect after short delay or immediately
        navigate("/");
      }
      setFormData({ name: '', email: '', password: '',assistantManager: '',contactNumber: '', });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Signup failed');
    }
  };


  console.log(message,"messaggeeeeeeeeeeeeeeeee");
  
  return (

<div className="admin-login-container">
      <div className="admin-login-card">
        <h2 className="admin-login-title">Sign Up</h2>

        {message && <div className="alert alert-info">{message}</div>}

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <select
            name="assistantManager"
            value={formData.assistantManager}
            onChange={handleChange}
            required
          >
            <option value="">Select Assistant Manager</option>
            {assistantManagers.map((am) => (
              <option key={am._id} value={am._id}>
                {am.name}
              </option>
            ))}
          </select>

          <input
            name="contactNumber"
            type="text"
            placeholder="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="admin-login-btn" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default StaffSignup;