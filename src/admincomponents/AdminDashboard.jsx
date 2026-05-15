import React, {useState } from "react";
import "../admincomponents/AdminDashboard.css"; // Assuming you have a CSS file for styles


import ManagerList from "./ManagerList";

// import StaffList from "./StaffListTable.jsx";
import DepartmentList from "./DepartmentListTable.jsx";
import AssistantManagerList from "./AssistantManagerList.jsx";
import CompanyListTable from "./CompanyListTable.jsx";
import StaffListTable from "./StaffListTable.jsx";
import TaskListTable from "./TaskListTable.jsx";
import TaskReports from "./TaskReports.jsx";
import { motion, AnimatePresence } from "framer-motion";
import HierarchyView from "./HierarchyView.jsx";
import CompanyReport from "./CompanyReport.jsx";
import CompanyTaskReport from "./CompanyTaskReport.jsx";
import BillSectionPage from "./Billsection.jsx";
import Billreport from "./Billreport.jsx";
import PaidAddList from "../staffcomponents/PaidAddList.jsx";
import StaffPerformance from "./StaffPerformance.jsx";
// Sidebar items
const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "task", label: "Task" },
  { key: "manager", label: "Manager" },
   { key: "assmanager", label: "Assistent Manager" },
  { key: "staff", label: "Staff" },
  { key: "perfomence", label: "Staff Perfomance" },
   { key: "department", label: "Department" },
    { key: "paidads", label: "Paid Ads" },
   { key: "company", label: "Company" },
   { key: "hierarchy", label: "Hierarchy" },
    // { key: "accounts", label: "Account" },
    {
    key: "accounts",
    label: "Accounts",
    children: [
      { key: "billsection", label: "Bill Section" },
      { key: "billreport", label: "Bill Report" },
    ],
  },
  { key: "reports", label: "Task Reports" },
  { key: "companyreports", label: "Company Reports" },
];

function AdminDashboard() {
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

    <div className="admin-wrap d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <header className="navbar navbar-light bg-white border-bottom sticky-top shadow-sm">
        <div className="container-fluid d-flex justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary d-lg-none"
              aria-label="Toggle sidebar"
              onClick={() => setIsOpen((v) => !v)}
            >
              <span className="navbar-toggler-icon" />
            </button>
            <span className="navbar-brand mb-0 h1 fw-bold text-primary">
              Admin Panel
            </span>
          </div>
          <div className="d-none d-sm-block small text-muted">
            {NAV_ITEMS.find((n) => n.key === active)?.label}
          </div>
        </div>
      </header>

      <div className="d-flex flex-grow-1">
        {/* Sidebar with animation */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop for mobile */}
              <motion.div
                className="backdrop"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.nav
          id="sidebar"
          className={`sidebar bg-light border-end d-flex flex-column`}
          initial={{ x: "-100%" }}
          animate={{ x: isOpen ? "0%" : "-100%" }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 80 }}
        >
          <div className="p-3 h-100 d-flex flex-column">
            <div className="fs-5 fw-semibold mb-3 text-secondary">Menu</div>
            <ul className="nav nav-pills flex-column gap-2">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
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
        </motion.nav>

        {/* Main Content */}
        <main className="content flex-grow-1 p-3 p-md-4 bg-light">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="h4 mb-4 fw-bold text-dark">
                {NAV_ITEMS.find((n) => n.key === active)?.label}
              </h1>

              {active === "dashboard" && (
                <div className="row g-3">
                  <div className="col-md-6 col-xl-4">
                    <motion.div
                      className="card shadow-sm h-100"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="card-body">
                        <div className="card-title text-primary fw-semibold">
                          Overview
                        </div>
                        <p className="mb-0 text-muted">
                          Welcome to your dashboard. Select a section from the
                          sidebar to get started.
                        </p>
                      </div>
                    </motion.div>
                  </div>
                  <div className="col-12">
                    {/* <TaskListTable /> */}
                    <CompanyTaskReport />
                  </div>
                </div>
              )}

              {active === "task" && <TaskListTable />}
              {active === "manager" && <ManagerList />}
              {active === "assmanager" && <AssistantManagerList />}
              {active === "staff" && <StaffListTable />}
              {active === "perfomence" && <StaffPerformance />}
              {active === "department" && <DepartmentList />}
               {active === "paidads" && <PaidAddList />}
              {active === "company" && <CompanyListTable />}
              {active === "hierarchy" && <HierarchyView />}
               {/* SUBMENU SCREENS */}
              {active === "billsection" && <BillSectionPage />}
              {active === "billreport" && <Billreport />}
              {active === "reports" && <TaskReports />}
              {active === "companyreports" && <CompanyReport />}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
     );
}
    export default AdminDashboard;
