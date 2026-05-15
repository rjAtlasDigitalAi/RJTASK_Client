

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManagerTaskAssignModal.css";

function ManagerTaskAssignModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    taskName: "",
    description: "",
    scheduledTime: "",
    role: "",
    assignedTo: "",
    assignedBy: "",
    status: "pending",
    repeat: "once",
    company: { id: "", name: "" },
  });

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ stable logged user
  const [loggedUser] = useState(() =>
    JSON.parse(localStorage.getItem("manager"))
  );

  /* -------------------- Set Assigned By -------------------- */
  useEffect(() => {
    if (loggedUser?.id) {
      setForm((prev) => ({
        ...prev,
        assignedBy: loggedUser.id,
      }));
    }
  }, [loggedUser?.id]);

  /* -------------------- Fetch Companies -------------------- */
  useEffect(() => {
    if (!isOpen) return;

    const fetchCompanies = async () => {
      try {
        const res = await axios.get(
          "https://rjtask-server.vercel.app/api/companies"
        );
        setCompanies(res.data || []);
      } catch (err) {
        console.error("Error fetching companies:", err);
      }
    };

    fetchCompanies();
  }, [isOpen]);

  /* -------------------- Fetch Users by Role -------------------- */
  useEffect(() => {
    if (!form.role) return;

    if (form.role === "myself" && loggedUser?.id) {
      setForm((prev) => ({
        ...prev,
        assignedTo: loggedUser.id,
      }));
      setUsers([]);
      return;
    }

    let endpoint = "";
    if (form.role === "assistantmanager") endpoint = "/api/assistant-managers";
    if (form.role === "staff") endpoint = "/api/auth";

    if (!endpoint) return;

    axios
      .get(`https://rjtask-server.vercel.app${endpoint}`)
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error("Error fetching users:", err));
  }, [form.role, loggedUser?.id]);

  /* -------------------- Handle Change -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "company") {
      const selectedCompany = companies.find((c) => c._id === value);
      if (!selectedCompany) return;

      setForm((prev) => ({
        ...prev,
        company: {
          id: selectedCompany._id,
          name: selectedCompany.name,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "https://rjtask-server.vercel.app/api/tasks",
        form
      );

      setForm({
        taskName: "",
        description: "",
        scheduledTime: "",
        role: "",
        assignedTo: "",
        assignedBy: loggedUser?.id || "",
        status: "pending",
        repeat: "once",
        company: { id: "", name: "" },
      });

      onCreated?.();
      onClose();
    } catch (err) {
      console.error("Error assigning task:", err);
      alert("Failed to assign task");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Assign Task</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="taskName"
            placeholder="Task Name"
            value={form.taskName}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Task Description"
            value={form.description}
            onChange={handleChange}
          />

          <input
            type="datetime-local"
            name="scheduledTime"
            value={form.scheduledTime}
            onChange={handleChange}
            required
          />

          <select
            name="company"
            value={form.company.id}
            onChange={handleChange}
            required
          >
            <option value="">Select Company</option>
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="myself">Myself</option>
            <option value="assistantmanager">Assistant Manager</option>
            <option value="staff">Staff</option>
          </select>

          {form.role && form.role !== "myself" && (
            <select
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              required
            >
              <option value="">Select {form.role}</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          )}

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select name="repeat" value={form.repeat} onChange={handleChange}>
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          <input
            type="text"
            value={loggedUser?.role || ""}
            readOnly
            className="readonly-field"
            placeholder="Assigned By"
          />

          <div className="modal-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Assigning..." : "Assign Task"}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ManagerTaskAssignModal;
