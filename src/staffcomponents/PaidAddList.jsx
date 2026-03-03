// import React, { useState } from "react";
// import PaidAddModal from "./PaidAddModal";
// import "./PaidAddList.css";

// function PaidAddList() {
//   const [ads, setAds] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handleSave = (newAd) => {
//     setAds([...ads, newAd]);
//   };

//   const handleDelete = (id) => {
//     setAds(ads.filter((ad) => ad.id !== id));
//   };

//   return (
//     <div className="paid-container">
//       <h1>Paid Ads List</h1>

//       <div style={{ display: "flex", justifyContent: "flex-end" }}>
//         <button
//           className="add-btn"
//           onClick={() => setIsModalOpen(true)}
//         >
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
//                 <tr key={ad.id}>
//                   <td>{ad.companyName}</td>
//                   <td>{ad.date}</td>
//                   <td>₹{ad.amountPaid}</td>
//                   <td>{ad.type}</td>
//                   <td>{ad.platform}</td>
//                   <td>{ad.totalMessages}</td>
//                   <td>{ad.newMessages}</td>
//                   <td>
//                     <button
//                       className="delete-btn"
//                       onClick={() => handleDelete(ad.id)}
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
import PaidAddModal from "./PaidAddModal";
import "./PaidAddList.css";

function PaidAddList() {
  const [ads, setAds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/paid-ads");
      setAds(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = (newAd) => {
    setAds([...ads, newAd]);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/paid-ads/${id}`);
      setAds(ads.filter((ad) => ad._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="paid-container">
      <h1>Paid Ads List</h1>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="add-btn" onClick={() => setIsModalOpen(true)}>
          + Add Paid Ad
        </button>
      </div>

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

      <PaidAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

export default PaidAddList;