
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export default function CompanyReport() {
  const [tasks, setTasks] = useState([]);
  const [companyReport, setCompanyReport] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ Generate Company Report (memoized)
  const generateCompanyReport = useCallback(
    (tasksData) => {
      const report = {};

      tasksData.forEach((task) => {
        const taskDate = new Date(task.createdAt)
          .toISOString()
          .split("T")[0];

        if (startDate && taskDate < startDate) return;
        if (endDate && taskDate > endDate) return;

        const companyName = task.company?.name || "Unknown";

        if (!report[companyName]) {
          report[companyName] = {
            total: 0,
            pending: 0,
            completed: 0,
            inprogress: 0,
          };
        }

        report[companyName].total += 1;

        const status = task.status?.toLowerCase();
        if (status === "pending") report[companyName].pending += 1;
        else if (status === "completed") report[companyName].completed += 1;
        else if (status === "in-progress")
          report[companyName].inprogress += 1;
      });

      setCompanyReport(Object.entries(report));
    },
    [startDate, endDate]
  );

  // ✅ Fetch tasks (memoized)
  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://rjtask-server.vercel.app/api/tasks/tasks"
      );
      setTasks(res.data);
      generateCompanyReport(res.data);
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
    }
  }, [generateCompanyReport]);

  // ✅ Fetch once on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ✅ Re-generate report on filters change
  useEffect(() => {
    generateCompanyReport(tasks);
  }, [tasks, startDate, endDate, generateCompanyReport]);

  // ✅ Search filter
  const filteredReport = companyReport.filter(([company]) =>
    company.toLowerCase().includes(search.toLowerCase())
  );

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("🏢 Company Report", 14, 10);

    const tableData = filteredReport.map(([company, data], index) => [
      index + 1,
      company,
      data.total,
      data.pending,
      data.completed,
      data.inprogress,
    ]);

    autoTable(doc, {
      head: [["#", "Company", "Total", "Pending", "Completed", "In Progress"]],
      body: tableData,
      startY: 20,
    });

    doc.save("company_report.pdf");
  };

  // ✅ Export Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredReport.map(([company, data], index) => ({
        "#": index + 1,
        Company: company,
        Total: data.total,
        Pending: data.pending,
        Completed: data.completed,
        "In Progress": data.inprogress,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Company Report");
    XLSX.writeFile(workbook, "Company_Report.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">
        🏢 Company Report
      </h1>

      <div className="mb-4 flex justify-between gap-4">
        <div>
          <input
            type="text"
            className="form-control w-50 mb-2"
            placeholder="🔍 Search Company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <label>From:</label>
          <input
            type="date"
            className="form-control w-50 mb-2"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <label>To:</label>
          <input
            type="date"
            className="form-control w-50 mb-2"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setSearch("");
            }}
          >
            Clear Filters
          </button>
        </div>

        <div className="flex gap-2">
          <button className="btn btn-danger" onClick={exportPDF}>
            📄 Export PDF
          </button>
          <button className="btn btn-success" onClick={exportExcel}>
            📊 Export Excel
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Company</th>
              <th>Total</th>
              <th>Pending</th>
              <th>Completed</th>
              <th>In Progress</th>
            </tr>
          </thead>
          <tbody>
            {filteredReport.length ? (
              filteredReport.map(([company, data], index) => (
                <tr key={company}>
                  <td>{index + 1}</td>
                  <td>{company}</td>
                  <td>{data.total}</td>
                  <td className="text-warning fw-bold">{data.pending}</td>
                  <td className="text-success fw-bold">{data.completed}</td>
                  <td className="text-info fw-bold">{data.inprogress}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


