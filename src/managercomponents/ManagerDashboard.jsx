

import React, { useState } from "react";
import "../admincomponents/AdminDashboard.css"; // Assuming you have a CSS file for styles
import ManagerAssignList from "./ManagerAssignList";
import ManagerTaskAssignList from "./ManagerTaskAssignList";
import ManagerReports from "./ManagerReports";
import CompanyTaskReport from "../admincomponents/CompanyTaskReport";
import Billreport from "../admincomponents/Billreport";
import BillSectionPage from "../admincomponents/Billsection";
import TaskReports from "../admincomponents/TaskReports";
import PaidAddList from "../staffcomponents/PaidAddList";
import StaffPerformance from "../admincomponents/StaffPerformance";

// Sidebar items
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "task", label: "Task" },
   { key: "perfomance", label: "Staff Perfomance" },
   { key: "paidads", label: "Paid Ads" },
  { key: "overallcompanytask", label: "OverAll Company Task" },
     // { key: "accounts", label: "Account" },
    {
    key: "accounts",
    label: "Accounts",
    children: [
      { key: "billsection", label: "Bill Section" },
      { key: "billreport", label: "Bill Report" },
    ],
  },
  { key: "report", label: "Report" },
  { key: "overallreport", label: "OverAllReport"},
];

function ManagerDashboard() {
  const [active, setActive] = useState("dashboard");
  const [isOpen, setIsOpen] = useState(false);

   const [openSubmenu, setOpenSubmenu] = useState(null);
  
    const handleSelect = (key, hasChildren) => {
      if (hasChildren) {
        setOpenSubmenu(openSubmenu === key ? null : key);
        return;
      }
      setActive(key);
      setIsOpen(false);
      setOpenSubmenu(null);
    };


  return (
    <div className="admin-wrap">
      {/* Top bar */}
      <header className="navbar navbar-light bg-white border-bottom sticky-top">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary d-lg-none"
              aria-label="Toggle sidebar"
              aria-controls="sidebar"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((v) => !v)}
            >
              <span className="navbar-toggler-icon" />
            </button>
            <span className="navbar-brand mb-0 h1">Manager</span>
          </div>
          <div className="d-none d-sm-block small text-muted">
            {NAV_ITEMS.find((n) => n.key === active)?.label}
          </div>
        </div>
      </header>

      <div className="d-flex min-vh-100">
        {/* Sidebar */}
        <nav
          id="sidebar"
          className={`sidebar bg-light border-end ${isOpen ? "open" : ""}`}
          aria-label="Sidebar"
        >
          <div className="p-3 d-flex flex-column h-100">
            <div className="fs-5 fw-semibold mb-3 text-secondary">Menu</div>
            <ul className="nav nav-pills flex-column gap-1">
              {NAV_ITEMS.map((item) => (
                <li className="nav-item" key={item.key}>
                  {/* <li key={item.key}></li> */}
                  <button
                    className={`nav-link w-100 text-start ${
                      active === item.key ? "active fw-bold" : ""
                    }`}
                    onClick={() =>
                      handleSelect(item.key, !!item.children)
                    }
                  >
                    {item.label}
                  </button>
                  {/* SUBMENU */}
                   {item.children && openSubmenu === item.key && (
                    <ul className="nav flex-column ps-3 mt-2">
                      {item.children.map((sub) => (
                        <li key={sub.key}>
                          <button
                            className={`nav-link w-100 text-start ${
                              active === sub.key ? "active fw-bold" : ""
                            }`}
                            onClick={() => handleSelect(sub.key)}
                          >
                            ➤ {sub.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-auto small text-muted">
              <hr />
              <div>v1.0</div>
            </div>
          </div>
        </nav>

        {/* Clickable backdrop for mobile */}
        {isOpen && <div className="backdrop" onClick={() => setIsOpen(false)} />}

        {/* Main content */}
        <main className="content flex-grow-1">
          <div className="container-fluid py-4">
            <h1 className="h3 mb-3">
              {NAV_ITEMS.find((n) => n.key === active)?.label}
            </h1>

            {/* Sections */}
            {active === "dashboard" && (
              <div className="row g-3">
                
                <div className="col-12 col-xl-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="card-title">Overview</div>
                      <p className="mb-0">
                        Welcome to your dashboard. Pick a section from the left
                        to get started.
                      </p>
                    </div>
                  </div>
                </div>
                 {/* Charts */}
      <div className="row g-3">
        <ManagerAssignList />
       </div>
        </div>
            )}

             {active === "task" && (
           <ManagerTaskAssignList />
            )}

             {active === "perfomance" && (
           <StaffPerformance />
            )}

             {active === "overallcompanytask" && (
           <CompanyTaskReport />
            )}
            
             {active === "paidads" && (
           <PaidAddList />
            )}
          {/* SUBMENU SCREENS */}
            {active === "billsection" && <BillSectionPage />}
            {active === "billreport" && <Billreport />}

            {active === "report" && (
             <ManagerReports />
            )}
              {active === "overallreport" && (
             <TaskReports />
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}

// ✅ Exporting component
export default ManagerDashboard;


