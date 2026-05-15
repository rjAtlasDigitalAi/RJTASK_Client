
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./AssistantManagerReportList.css";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function AssistantManagerReport() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔎 Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const assistantManager = JSON.parse(
    localStorage.getItem("assistantManager")
  );

  // ✅ FIXED: wrapped with useCallback
  const fetchManagerTasks = useCallback(async () => {
    if (!assistantManager?.id) return;

    try {
      const res = await axios.get(
        `https://rjtask-server.vercel.app/api/tasks/user/${assistantManager.id}`
      );
      setTasks(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching manager tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [assistantManager]);

  // ✅ FIXED: dependency added correctly
  useEffect(() => {
    fetchManagerTasks();
  }, [fetchManagerTasks]);

  // 🔎 Apply filters
  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        const matchesName = task.taskName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

        const matchesDate = dateFilter
          ? new Date(task.createdAt).toISOString().split("T")[0] === dateFilter
          : true;

        return matchesName && matchesDate;
      })
    : [];

  // 📄 Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Assistant Manager Task Report", 14, 10);

    const tableData = filteredTasks.map((task, i) => [
      i + 1,
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
      head: [
        [
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
        ],
      ],
      body: tableData,
      startY: 20,
    });

    doc.save("assistant_manager_report.pdf");
  };

  // 📊 Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredTasks.map((task, i) => ({
        "#": i + 1,
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

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    XLSX.writeFile(workbook, "assistant_manager_report.xlsx");
  };

  if (loading) {
    return <p className="text-center mt-4">Loading tasks...</p>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        📋 Asst Manager Task Report
      </h1>

      {/* 🔎 Filters */}
      <div className="filter-container mb-4 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="🔍 Search by task"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control w-50"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="form-control w-50"
        />

        {(searchTerm || dateFilter) && (
          <button
            className="btn btn-danger"
            onClick={() => {
              setSearchTerm("");
              setDateFilter("");
            }}
          >
            ❌ Clear
          </button>
        )}
      </div>

      {/* 📤 Export Buttons */}
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
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-[700px] md:min-w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                {[
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
                ].map((head) => (
                  <th key={head} className="border px-3 py-2 text-left">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, index) => (
                <tr key={task._id} className="hover:bg-gray-50">
                  <td>{index + 1}</td>
                  <td>{task.taskName}</td>
                  <td>{task.description || "—"}</td>
                  <td className="capitalize">{task.role}</td>
                  <td>{task.assignedTo?.name || "N/A"}</td>
                  <td>{task.assignedBy || "N/A"}</td>
                  <td>{task.repeat}</td>
                  <td
                    className={`font-semibold ${
                      task.status === "completed"
                        ? "text-green-600"
                        : task.status === "pending"
                        ? "text-yellow-600"
                        : task.status === "in-progress"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {task.status}
                  </td>
                  <td>
                    {new Date(task.scheduledTime).toLocaleString()}
                  </td>
                  <td>{new Date(task.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
