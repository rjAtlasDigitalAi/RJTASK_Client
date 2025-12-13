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
      const res = await axios.get("https://rjtaskmanagment-server.onrender.com/api/billsection");
      setBillSections(res.data.bills);
    } catch (err) {
      console.error("Error fetching bill sections:", err);
    }
  };


  console.log(billSections,"billllllllllll");
  

  // Fetch company list for dropdown
  const fetchCompanies = async () => {
    try {
      const res = await axios.get("https://rjtaskmanagment-server.onrender.com/api/companies");
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



// // AddBillSectionModal.jsx
// import React, { useState } from "react";

// export default function AddBillSectionModal({ close, onSave }) {
//   const [form, setForm] = useState({
//     company: "",
//     work: "",
//     amount: "",
//     date: "",
//     discount: "",
//     narration: ""
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const submitHandler = (e) => {
//     e.preventDefault();
//     onSave(form);
//     close();
//   };

//   return (
//     <div className="modal-backdrop" style={{
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       background: "rgba(0,0,0,0.5)",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center"
//     }}>

//       <div className="card p-4" style={{ width: "400px" }}>
//         <h5 className="mb-3">Add Bill Section</h5>
//         <form onSubmit={submitHandler} className="d-flex flex-column gap-3">
//           <input name="company" className="form-control" placeholder="Company Name" onChange={handleChange} required />
//           <input name="work" className="form-control" placeholder="Work Description" onChange={handleChange} required />
//           <input name="amount" type="number" className="form-control" placeholder="Amount" onChange={handleChange} required />
//           <input name="date" type="date" className="form-control" onChange={handleChange} required />
//           <input name="discount" type="number" className="form-control" placeholder="Discount" onChange={handleChange} />
//           <textarea name="narration" className="form-control" placeholder="Narration" onChange={handleChange}></textarea>

//           <div className="d-flex justify-content-end gap-2 mt-2">
//             <button type="button" className="btn btn-secondary" onClick={close}>Cancel</button>
//             <button className="btn btn-success" type="submit">Save</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
