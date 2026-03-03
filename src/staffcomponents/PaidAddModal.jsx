// import React, { useState, useEffect } from "react";
// import "./PaidAddModal.css";

// function PaidAddModal({ isOpen, onClose, onSave }) {
//   const [form, setForm] = useState({
//     companyName: "",
//     date: "",
//     amountPaid: "",
//     type: "",
//     platform: "",
//     totalMessages: "",
//     newMessages: "",
//   });

//   useEffect(() => {
//     if (isOpen) {
//       setForm({
//         companyName: "",
//         date: "",
//         amountPaid: "",
//         type: "",
//         platform: "",
//         totalMessages: "",
//         newMessages: "",
//       });
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//   }, [isOpen]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!form.companyName || !form.date || !form.amountPaid) {
//       alert("Please fill required fields");
//       return;
//     }

//     onSave({ ...form, id: Date.now() });
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Add Paid Ad</h2>

//         <form className="modal-form" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="companyName"
//             placeholder="Company Name"
//             value={form.companyName}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="date"
//             name="date"
//             value={form.date}
//             onChange={handleChange}
//             required
//           />

//           <input
//             type="number"
//             name="amountPaid"
//             placeholder="Amount Paid"
//             value={form.amountPaid}
//             onChange={handleChange}
//             required
//           />

//           <select name="type" value={form.type} onChange={handleChange} required>
//             <option value="">Select Type</option>
//             <option value="reach">Reach</option>
//             <option value="lead">Lead</option>
//           </select>

//           <select
//             name="platform"
//             value={form.platform}
//             onChange={handleChange}
//             required
//           >
//             <option value="">Select Platform</option>
//             <option value="facebook">Facebook</option>
//             <option value="instagram">Instagram</option>
//           </select>

//           <input
//             type="number"
//             name="totalMessages"
//             placeholder="Total Messages"
//             value={form.totalMessages}
//             onChange={handleChange}
//           />

//           <input
//             type="number"
//             name="newMessages"
//             placeholder="New Messages"
//             value={form.newMessages}
//             onChange={handleChange}
//           />

//           <div className="modal-actions">
//             <button type="submit" className="save-btn">
//               Save
//             </button>
//             <button type="button" className="cancel-btn" onClick={onClose}>
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default PaidAddModal;


import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PaidAddModal.css";

function PaidAddModal({ isOpen, onClose, onSave }) {
  const [form, setForm] = useState({
    companyName: "",
    date: "",
    amountPaid: "",
    type: "",
    platform: "",
    totalMessages: "",
    newMessages: "",
  });

  useEffect(() => {
    if (isOpen) {
      setForm({
        companyName: "",
        date: "",
        amountPaid: "",
        type: "",
        platform: "",
        totalMessages: "",
        newMessages: "",
      });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.companyName || !form.date || !form.amountPaid) {
      alert("Please fill required fields");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/paid-ads", form);

      onSave(res.data); // send saved data to list
      onClose();
    } catch (error) {
      console.error(error);
      alert("Error saving data");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Paid Ad</h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="amountPaid"
            placeholder="Amount Paid"
            value={form.amountPaid}
            onChange={handleChange}
            required
          />

          <select name="type" value={form.type} onChange={handleChange} required>
            <option value="">Select Type</option>
            <option value="reach">Reach</option>
            <option value="lead">Lead</option>
          </select>

          <select
            name="platform"
            value={form.platform}
            onChange={handleChange}
            required
          >
            <option value="">Select Platform</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
          </select>

          <input
            type="number"
            name="totalMessages"
            placeholder="Total Messages"
            value={form.totalMessages}
            onChange={handleChange}
          />

          <input
            type="number"
            name="newMessages"
            placeholder="New Messages"
            value={form.newMessages}
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Save
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

export default PaidAddModal;