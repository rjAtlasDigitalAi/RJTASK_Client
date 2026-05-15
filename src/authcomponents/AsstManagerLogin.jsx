
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './StaffLogin.css';
import taskimage1 from '../utils/Taskmanagment1.png';
export default function AsstManagerLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("https://rjtask-server.vercel.app/api/assistant-managers/login", form);
      localStorage.setItem("assistantManagerToken", res.data.token);
      localStorage.setItem("assistantManager", JSON.stringify(res.data.assistantManager));
      navigate("/asstmanager/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
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
        <h1>Assistant Manager</h1>
        <p>Manage team operations and ensure smooth workflow execution.</p>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="login-right">
      <div className="form-box">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login as Assistant Manager</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>

  </div>
);
}
