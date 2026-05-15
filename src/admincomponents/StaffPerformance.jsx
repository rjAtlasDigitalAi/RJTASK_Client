


import React, { useEffect, useState } from "react";
import axios from "axios";
import "./StaffPerformance.css";
import MonthlyPerformance from "./MonthlyPerformance";

export default function StaffPerformance() {
  const [staffData, setStaffData] = useState([]);

  const fetchPerformance = async () => {
    try {
      const res = await axios.get(
        "https://rjtask-server.vercel.app/api/tasks/staff-performance"
      );

      setStaffData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching performance:", err);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  return (
    <div className="staff-performance-page">

      <h2 className="staff-title">📊 Staff Performance</h2>

      {/* Table Section */}
      <div className="table-card">

        <div className="table-wrapper">

          <table className="performance-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Staff Name</th>
                <th>Email</th>
                <th>Total Tasks</th>
                <th>Completed</th>
                <th>Performance %</th>
              </tr>
            </thead>

            <tbody>
              {staffData.length > 0 ? (
                staffData.map((staff, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{staff.name || "Unknown Staff"}</td>

                    <td>{staff.email || "No Email"}</td>

                    <td>{staff.totalTasks || 0}</td>

                    <td>{staff.completedTasks || 0}</td>

                    <td className="performance-value">
                      {staff.performance
                        ? staff.performance.toFixed(2) + "%"
                        : "0%"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No Performance Data Available
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

      </div>

      {/* Monthly Performance Chart */}
      <div className="chart-card">
        <MonthlyPerformance />
      </div>

    </div>
  );
}