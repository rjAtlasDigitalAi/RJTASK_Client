

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManagerReports.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function ManagerReport() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // ✅ Make manager stable
  const [manager] = useState(() =>
    JSON.parse(localStorage.getItem("manager"))
  );

  // ✅ Fetch manager tasks (no ESLint warning)
  useEffect(() => {
    if (!manager?.id) return;

    const fetchManagerTasks = async () => {
      try {
        const res = await axios.get(
          `https://rjtask-server.vercel.app/api/tasks/user/${manager.id}`
        );
        setTasks(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("❌ Error fetching manager tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchManagerTasks();
  }, [manager?.id]);

  // ✅ Filter tasks
  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        const matchesName = task.taskName
          ?.toLowerCase()
          .includes(searchName.toLowerCase());

        const matchesDate = searchDate
          ? new Date(task.createdAt).toISOString().split("T")[0] === searchDate
          : true;

        return matchesName && matchesDate;
      })
    : [];

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Manager Task Report", 14, 10);

    const tableColumn = [
      "#",
      "Task Name",
      "Description",
      "Role",
      "Assigned To",
      "Assigned By",
      "Repeat",
      "Status",
      "Scheduled Time",
      "Created At",
    ];

    const tableRows = filteredTasks.map((task, index) => [
      index + 1,
      task.taskName,
      task.description || "—",
      task.role,
      task.assignedTo?.name || "N/A",
      task.assignedBy || "N/A",
      task.repeat,
      task.status,
      new Date(task.scheduledTime).toLocaleString(),
      new Date(task.createdAt).toLocaleString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fontSize: 8 },
    });

    doc.save("manager-task-report.pdf");
  };

  // ✅ Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredTasks.map((task, index) => ({
        "#": index + 1,
        "Task Name": task.taskName,
        Description: task.description || "—",
        Role: task.role,
        "Assigned To": task.assignedTo?.name || "N/A",
        "Assigned By": task.assignedBy || "N/A",
        Repeat: task.repeat,
        Status: task.status,
        "Scheduled Time": new Date(task.scheduledTime).toLocaleString(),
        "Created At": new Date(task.createdAt).toLocaleString(),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Manager Tasks");
    XLSX.writeFile(wb, "manager-task-report.xlsx");
  };

  if (loading) {
    return <p className="text-center mt-4">Loading tasks...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        📋 Manager Personal Task Report
      </h1>

      {/* Filters */}
      <div className="filters mb-4 flex gap-4 justify-center">
        <input
          type="text"
          placeholder="Search by Task..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="form-control w-50"
        />

        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="form-control w-50"
        />
      </div>

      {/* Export Buttons */}
      <div className="flex justify-center mb-4">
        <button onClick={exportPDF} className="btn btn-primary me-3">
          📄 Export PDF
        </button>
        <button onClick={exportExcel} className="btn btn-success">
          📊 Export Excel
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500">
          No tasks found for this manager.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 shadow-lg rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th>#</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Role</th>
                <th>Assigned To</th>
                <th>Assigned By</th>
                <th>Repeat</th>
                <th>Status</th>
                <th>Scheduled Time</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td>{task.taskName}</td>
                  <td>{task.description}</td>
                  <td className="capitalize">{task.role}</td>
                  <td>{task.assignedTo?.name || "N/A"}</td>
                  <td>{task.assignedBy || "N/A"}</td>
                  <td>{task.repeat}</td>
                  <td className="font-semibold">{task.status}</td>
                  <td>
                    {new Date(task.scheduledTime).toLocaleString()}
                  </td>
                  <td>
                    {new Date(task.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
