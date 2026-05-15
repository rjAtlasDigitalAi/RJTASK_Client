
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AddStaffModal.css";

export default function AddStaffModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    assistantManager: "",
    contactNumber: "",
    password: "",
  });

  const [assistantManagers, setAssistantManagers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch assistant managers when modal opens
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      const res = await axios.post(
        "https://rjtask-server.vercel.app/api/auth/signup",
        formData
      );

      setMessage(res.data.message || "staff successful!");
      if (res.data.success) {
        if (onCreated) onCreated(); // ✅ Refresh parent staff list
        setTimeout(() => {
          onClose(); // Close modal after success
        }, 800);
      }
      setFormData({
        name: "",
        email: "",
        password: "",
        assistantManager: "",
        contactNumber: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <h2>Add New Staff</h2>
        {message && <div className="alert-message">{message}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
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
            {assistantManagers?.map((am) => (
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

          <div className="modal-actions">
            <button className="save-btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              className="cancel-btn"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
