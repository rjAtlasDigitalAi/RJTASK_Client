

import React, { useEffect, useState } from "react";
import axios from "axios";
import AsstManagerTaskAssignModal from "./AsstManagerTaskAssignList";
import EditAsstManagerTaskAssignModal from "./EditAsstManagerTaskAssignModal";

function AsstManagerTaskAssignList() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [availableNames, setAvailableNames] = useState([]);

  const [sortOrder, setSortOrder] = useState("newest"); // ✅ sorting state

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    try {
      const loggedManager = JSON.parse(localStorage.getItem("assistantManager"));
      if (!loggedManager) {
        console.error("No logged-in manager found");
        return;
      }

      const res = await axios.get(
        "https://rjtask-server.vercel.app/api/tasks/tasks"
      );

      const filteredTasks = res.data.filter(
        (task) => task.assignedBy === loggedManager.id
      );

      setTasks(filteredTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (roleFilter) {
      const names = tasks
        .filter((t) => t.role?.toLowerCase() === roleFilter.toLowerCase())
        .map((t) => (t.assignedTo ? t.assignedTo.name : "Myself"));

      setAvailableNames([...new Set(names)]);
      setNameFilter("");
    } else {
      setAvailableNames([]);
      setNameFilter("");
    }
  }, [roleFilter, tasks]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(
        `https://rjtask-server.vercel.app/api/tasks/${id}`
      );
      fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task");
    }
  };

  // ---------------------------
  // ✅ FILTER + SORTING COMBINED
  // ---------------------------

  let filteredTasks = tasks.filter((t) => {
    const matchesName = searchName
      ? t.taskName?.toLowerCase().includes(searchName.toLowerCase()) ||
        t.company?.name?.toLowerCase().includes(searchName.toLowerCase())
      : true;

    const matchesDate = searchDate
      ? new Date(t.scheduledTime).toISOString().split("T")[0] === searchDate
      : true;

    const matchesRole = roleFilter
      ? t.role?.toLowerCase() === roleFilter.toLowerCase()
      : true;

    const matchesSubName = nameFilter
      ? (t.assignedTo ? t.assignedTo.name : "Myself") === nameFilter
      : true;

    return matchesName && matchesDate && matchesRole && matchesSubName;
  });

  // -----------------------------
  // ✅ DATE SORTING LOGIC
  // -----------------------------
  filteredTasks.sort((a, b) => {
    const dateA = new Date(a.scheduledTime);
    const dateB = new Date(b.scheduledTime);

    return sortOrder === "newest"
      ? dateB - dateA // latest first
      : dateA - dateB; // oldest first
  });

  return (
    <div className="task-list-container">
      <h1>Task List</h1>

      <div className="task-list-header">
        <div
          className="filters"
          style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}
        >
          {/* Text Search */}
          <input
            type="text"
            placeholder="Search a Task"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="form-control w-50"
          />

          {/* Date Filter */}
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="form-control w-50"
          />

          {/* Role Filter */}
          <select
            className="form-select"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="myself">Myself</option>
            <option value="staff">Staff</option>
          </select>

          {/* Sub Name Filter */}
          {availableNames.length > 0 && (
            <select
              className="form-select"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            >
              <option value="">All Names</option>
              {availableNames.map((name, i) => (
                <option key={i} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}

          {/* 🔽 Sorting Dropdown */}
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* Clear Filters */}
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setSearchName("");
              setSearchDate("");
              setRoleFilter("");
              setNameFilter("");
              setSortOrder("newest");
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      <button
        className="add-task-btn mb-2"
        style={{ float: "right" }}
        onClick={() => setIsModalOpen(true)}
      >
        + Add Task
      </button>

      <div className="table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Description</th>
              <th>Scheduled Time</th>
              <th>Role</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Company</th>
              <th>Repeat</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((t) => (
                <tr key={t._id}>
                  <td>{t.taskName}</td>
                  <td>{t.description || "—"}</td>
                  <td style={{ color: "red" }}>
                    {new Date(t.scheduledTime).toLocaleString()}
                  </td>
                  <td>{t.role}</td>
                  <td>{t.assignedTo ? t.assignedTo.name : "Myself"}</td>

                  <td
                    className={
                      t.status === "pending"
                        ? "status-pending"
                        : t.status === "in-progress"
                        ? "status-inprogress"
                        : t.status === "completed"
                        ? "status-completed"
                        : ""
                    }
                  >
                    {t.status}
                  </td>

                  <td>{t.company?.name}</td>
                  <td>{t.repeat}</td>

                  <td>
                    <button
                      className="edit-btn w-75 mb-1"
                      onClick={() => {
                        setSelectedTask(t);
                        setIsEditModalOpen(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn w-75"
                      onClick={() => handleDelete(t._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AsstManagerTaskAssignModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchTasks}
      />

      {isEditModalOpen && (
        <EditAsstManagerTaskAssignModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={fetchTasks}
          taskData={selectedTask}
        />
      )}
    </div>
  );
}

export default AsstManagerTaskAssignList;
