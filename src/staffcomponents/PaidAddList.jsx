


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import PaidAddModal from "./PaidAddModal";
// import "./PaidAddList.css";

// function PaidAddList() {
//   const [ads, setAds] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     fetchAds();
//   }, []);

//   const fetchAds = async () => {
//     try {
//       const res = await axios.get("https://rj-task-managment-server.vercel.app/api/paid-ads");
//       setAds(res.data);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleSave = (newAd) => {
//     setAds([...ads, newAd]);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`https://rj-task-managment-server.vercel.app/api/paid-ads/${id}`);
//       setAds(ads.filter((ad) => ad._id !== id));
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="paid-container">
//       <h1>Paid Ads List</h1>

//       <div style={{ display: "flex", justifyContent: "flex-end" }}>
//         <button className="add-btn" onClick={() => setIsModalOpen(true)}>
//           + Add Paid Ad
//         </button>
//       </div>

//       <div className="table-wrapper">
//         <table className="paid-table">
//           <thead>
//             <tr>
//               <th>Company</th>
//               <th>Date</th>
//               <th>Amount</th>
//               <th>Type</th>
//               <th>Platform</th>
//               <th>Total Msg</th>
//               <th>New Msg</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {ads.length > 0 ? (
//               ads.map((ad) => (
//                 <tr key={ad._id}>
//                   <td>{ad.companyName}</td>
//                   <td>{ad.date?.substring(0, 10)}</td>
//                   <td>₹{ad.amountPaid}</td>
//                   <td>{ad.type}</td>
//                   <td>{ad.platform}</td>
//                   <td>{ad.totalMessages}</td>
//                   <td>{ad.newMessages}</td>
//                   <td>
//                     <button
//                       className="delete-btn"
//                       onClick={() => handleDelete(ad._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" style={{ textAlign: "center" }}>
//                   No records found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       <PaidAddModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleSave}
//       />
//     </div>
//   );
// }

// export default PaidAddList;



import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

import autoTable from "jspdf-autotable";
import PaidAddModal from "./PaidAddModal";
import "./PaidAddList.css";

function PaidAddList() {
  const [ads, setAds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  // ✅ Fetch Ads
  const fetchAds = async () => {
    try {
      const res = await axios.get(
        "https://rj-task-managment-server.vercel.app/api/paid-ads"
      );
      setAds(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ After Save
  const handleSave = (newAd) => {
    setAds((prev) => [...prev, newAd]);
  };

  // ✅ Delete Ad
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://rj-task-managment-server.vercel.app/api/paid-ads/${id}`
      );
      setAds(ads.filter((ad) => ad._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // ✅ Excel Export
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      ads.map((ad) => ({
        Company: ad.companyName,
        Date: ad.date?.substring(0, 10),
        Amount: ad.amountPaid,
        Type: ad.type,
        Platform: ad.platform,
        "Total Messages": ad.totalMessages,
        "New Messages": ad.newMessages,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Paid Ads");
    XLSX.writeFile(workbook, "PaidAds.xlsx");
  };

  // ✅ PDF Export
  const exportToPDF = () => {
  const doc = new jsPDF();

  const tableColumn = [
    "Company",
    "Date",
    "Amount",
    "Type",
    "Platform",
    "Total Msg",
    "New Msg",
  ];

  const tableRows = [];

  ads.forEach((ad) => {
    tableRows.push([
      ad.companyName,
      ad.date?.substring(0, 10),
      `₹${ad.amountPaid}`,
      ad.type,
      ad.platform,
      ad.totalMessages,
      ad.newMessages,
    ]);
  });

  doc.text("Paid Ads Report", 14, 15);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

  doc.save("PaidAds.pdf");
};

  return (
    <div className="paid-container">
      <h1>Paid Ads List</h1>

      {/* Top Buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <button className="export-btn" onClick={exportToExcel}>
            Export Excel
          </button>

          <button
            className="export-btn"
            onClick={exportToPDF}
            style={{ marginLeft: "10px" }}
          >
            Export PDF
          </button>
        </div>

        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          + Add Paid Ad
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="paid-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Platform</th>
              <th>Total Msg</th>
              <th>New Msg</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {ads.length > 0 ? (
              ads.map((ad) => (
                <tr key={ad._id}>
                  <td>{ad.companyName}</td>
                  <td>{ad.date?.substring(0, 10)}</td>
                  <td>₹{ad.amountPaid}</td>
                  <td>{ad.type}</td>
                  <td>{ad.platform}</td>
                  <td>{ad.totalMessages}</td>
                  <td>{ad.newMessages}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(ad._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <PaidAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default PaidAddList;