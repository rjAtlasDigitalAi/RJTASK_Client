import React, { useState, useEffect } from "react";
import axios from "axios";
import AddBillSectionModal from "./AddBillSectionModal";

export default function BillSectionPage() {
  const [billSections, setBillSections] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Fetch all bill sections
  const fetchBillSections = async () => {
    try {
      const res = await axios.get("https://rjtask-server.vercel.app/api/billsection");
      setBillSections(res.data.bills);
    } catch (err) {
      console.error("Error fetching bill sections:", err);
    }
  };


  console.log(billSections,"billllllllllll");
  

  // Fetch company list for dropdown
  const fetchCompanies = async () => {
    try {
      const res = await axios.get("https://rjtask-server.vercel.app/api/companies");
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchBillSections();
    fetchCompanies();
  }, []);

  return (
    <div className="container p-3">

      {/* Top Button */}
      <div className="d-flex justify-content-between mb-3">
        <h2>Bill Section</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add Bill Section
        </button>
      </div>

      {/* Bill Table */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Company</th>
            <th>Work Description</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Discount</th>
            <th>Narration</th>
          </tr>
        </thead>
        <tbody>
          {billSections.map((b) => (
            <tr key={b._id}>
              <td>{b.companyname}</td>
              <td>{b.workdescription}</td>
              <td>{b.amount}</td>
              <td>{new Date(b.date).toLocaleDateString()}</td>
              <td>{b.discount}</td>
              <td>{b.narration}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Bill Modal */}
      {showModal && (
        <AddBillSectionModal
          companies={companies}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchBillSections();
          }}
        />
      )}

    </div>
  );
}


