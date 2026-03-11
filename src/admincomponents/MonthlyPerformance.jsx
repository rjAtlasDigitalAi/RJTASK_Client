


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";

// import "./MonthlyPerformance.css";

// export default function MonthlyPerformance() {
//   const [data, setData] = useState([]);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:3000/api/tasks/monthly-performance"
//       );

//       setData(res.data.data || []);
//     } catch (err) {
//       console.error("Error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const monthNames = [
//     "",
//     "Jan","Feb","Mar","Apr","May","Jun",
//     "Jul","Aug","Sep","Oct","Nov","Dec",
//   ];

//   return (
//     <div className="monthly-page">

//       <h2 className="monthly-title">📅 Monthly Staff Performance</h2>

//       {/* Chart Section (optional) */}
//       {/* 
//       <div className="chart-box">
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="performance" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//       */}

//       <div className="table-box">
//         <table className="monthly-table">
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>Staff</th>
//               <th>Month</th>
//               <th>Year</th>
//               <th>Total Tasks</th>
//               <th>Completed</th>
//               <th>Performance %</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.length > 0 ? (
//               data.map((item, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>

//                   {/* Prevent blank fields */}
//                   <td>{item.name || "Unknown Staff"}</td>

//                   <td>
//                     {item.month ? monthNames[item.month] : "N/A"}
//                   </td>

//                   <td>{item.year || "-"}</td>

//                   <td>{item.totalTasks || 0}</td>

//                   <td>{item.completedTasks || 0}</td>

//                   <td className="perf">
//                     {item.performance
//                       ? item.performance.toFixed(2) + "%"
//                       : "0%"}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" className="no-data">
//                   No Monthly Performance Data
//                 </td>
//               </tr>
//             )}
//           </tbody>

//         </table>
//       </div>

//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";


import "./MonthlyPerformance.css";

export default function MonthlyPerformance() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/tasks/monthly-performance"
      );

      setData(res.data.data || []);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const monthNames = [
    "",
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  return (
    <div className="monthly-page">

      <h2 className="monthly-title">📅 Monthly Staff Performance</h2>

     

      <div className="table-box">

        <div className="table-wrapper">

          <table className="monthly-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Staff</th>
                <th>Month</th>
                <th>Year</th>
                <th>Total Tasks</th>
                <th>Completed</th>
                <th>Performance %</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>{item.name || "Unknown Staff"}</td>

                    <td>
                      {item.month ? monthNames[item.month] : "N/A"}
                    </td>

                    <td>{item.year || "-"}</td>

                    <td>{item.totalTasks || 0}</td>

                    <td>{item.completedTasks || 0}</td>

                    <td className="perf">
                      {item.performance
                        ? item.performance.toFixed(2) + "%"
                        : "0%"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No Monthly Performance Data
                  </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}