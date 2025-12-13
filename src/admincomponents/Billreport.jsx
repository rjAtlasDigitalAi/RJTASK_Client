import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Billreport() {
  const [bills, setBills] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // Filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  // Fetch Bill Section Data
  const loadData = async () => {
    try {
      const res = await axios.get("https://rjtaskmanagment-server.onrender.com/api/billsection");
      setBills(res.data.bills);
      setFiltered(res.data.bills);
    } catch (error) {
      console.error("Failed to fetch bills:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  // Apply Filters
  useEffect(() => {
    let data = [...bills];

    // Date Filter
    if (fromDate) {
      data = data.filter((b) => new Date(b.date) >= new Date(fromDate));
    }
    if (toDate) {
      data = data.filter((b) => new Date(b.date) <= new Date(toDate));
    }

    // Search Filter
    if (search.trim()) {
      const query = search.toLowerCase();
      data = data.filter(
        (b) =>
          b.companyname.toLowerCase().includes(query) ||
          b.workdescription.toLowerCase().includes(query) ||
          b.narration.toLowerCase().includes(query)
      );
    }

    setFiltered(data);
  }, [fromDate, toDate, search, bills]);


  console.log(bills,"billldaaaaaate");
  
  return (
    <div className="container mt-3">

      {/* FILTER SECTION */}
      <div className="card shadow-sm p-3 mb-3">
        <h5 className="fw-bold mb-3">Filter Bill Reports</h5>

        <div className="row g-3">

          {/* From Date */}
          <div className="col-12 col-md-4">
            <label className="form-label">From Date</label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          {/* To Date */}
          <div className="col-12 col-md-4">
            <label className="form-label">To Date</label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          {/* Search Box */}
          <div className="col-12 col-md-4">
            <label className="form-label">Search</label>
            <input
              type="text"
              className="form-control"
              placeholder="Search company, work, narration..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* BILL TABLE */}
      <div className="card shadow-sm p-3">
        <h5 className="fw-bold mb-3">Bill Report</h5>

        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Company</th>
                <th>Work</th>
                <th>Amount</th>
                <th>Discount</th>
                <th>Date</th>
                <th>Narration</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No records found
                  </td>
                </tr>
              ) : (
                filtered.map((bill) => (
                  <tr key={bill._id}>
                    <td>{bill.companyname}</td>
                    <td>{bill.workdescription}</td>
                    <td>₹{bill.amount}</td>
                    <td>₹{bill.discount}</td>
                    <td>{new Date(bill.date).toLocaleDateString()}</td>
                    <td>{bill.narration}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
