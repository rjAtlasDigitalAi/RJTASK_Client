// import React, { useState } from "react";
// import axios from "axios";

// export default function AddBillSectionModal({ companies, onClose, onSave }) {
//   const [form, setForm] = useState({
//     companyname: "",
//     workdescription: "",
//     amount: "",
//     date: "",
//     discount: "",
//     narration: "",
//   });

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async () => {
//     try {
//       await axios.post("http://localhost:3000/api/billsection", form);
//       onSave();
//     } catch (err) {
//       console.error("Error adding bill section:", err);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-box">
//         <h4>Add Bill Section</h4>

//         {/* Company Dropdown */}
//         <select
//           className="form-control mb-2"
//           name="companyname"
//           value={form.companyname}
//           onChange={handleChange}
//         >
//           <option value="">Select Company</option>
//           {companies.map((c) => (
//             <option key={c._id} value={c.name}>
//               {c.name}
//             </option>
//           ))}
//         </select>

//         <input
//           type="text"
//           name="workdescription"
//           placeholder="Work Description"
//           className="form-control mb-2"
//           value={form.workdescription}
//           onChange={handleChange}
//         />

//         <input
//           type="number"
//           name="amount"
//           placeholder="Amount"
//           className="form-control mb-2"
//           value={form.amount}
//           onChange={handleChange}
//         />

//         <input
//           type="date"
//           name="date"
//           className="form-control mb-2"
//           value={form.date}
//           onChange={handleChange}
//         />

//         <input
//           type="number"
//           name="discount"
//           placeholder="Discount"
//           className="form-control mb-2"
//           value={form.discount}
//           onChange={handleChange}
//         />

//         <textarea
//           name="narration"
//           placeholder="Narration"
//           className="form-control mb-2"
//           value={form.narration}
//           onChange={handleChange}
//         />

//         <div className="d-flex justify-content-end mt-3">
//           <button className="btn btn-secondary me-2" onClick={onClose}>
//             Cancel
//           </button>
//           <button className="btn btn-success" onClick={handleSubmit}>
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import axios from "axios";
import "./AddBillSectionModal.css";

export default function AddBillSectionModal({ companies, onClose, onSave }) {
  const [form, setForm] = useState({
    companyname: "",
    workdescription: "",
    amount: "",
    date: "",
    discount: "",
    narration: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.post("https://rjtaskmanagment-server.onrender.com/api/billsection", form);
      onSave();
      onClose();
    } catch (err) {
      console.error("Error adding bill section:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <h4 className="mb-3">Add Bill Section</h4>

        {/* Company Dropdown */}
        <select
          className="form-control mb-2"
          name="companyname"
          value={form.companyname}
          onChange={handleChange}
        >
          <option value="">Select Company</option>
          {companies.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="workdescription"
          placeholder="Work Description"
          className="form-control mb-2"
          value={form.workdescription}
          onChange={handleChange}
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          className="form-control mb-2"
          value={form.amount}
          onChange={handleChange}
        />

        <input
          type="date"
          name="date"
          className="form-control mb-2"
          value={form.date}
          onChange={handleChange}
        />

        <input
          type="number"
          name="discount"
          placeholder="Discount"
          className="form-control mb-2"
          value={form.discount}
          onChange={handleChange}
        />

        <textarea
          name="narration"
          placeholder="Narration"
          className="form-control mb-2"
          value={form.narration}
          onChange={handleChange}
        />

        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary me-2" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-success" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
