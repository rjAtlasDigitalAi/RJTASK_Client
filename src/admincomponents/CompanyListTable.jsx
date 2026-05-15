


import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CompanyListTable.css";
import AddCompanyModalForm from "./AddCompanyModalForm";
import EditCompanyModalForm from "./EditCompanyModalForm";

export default function CompanyListTable() {
  const [companies, setCompanies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchTerm, setSearchTerm] = useState(""); // ✅ search term state
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const fetchCompanies = async () => {
    try {
      const res = await axios.get("https://rjtask-server.vercel.app/api/companies");
      setCompanies(res.data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

   // ✅ Filter companies based on search term
  const filteredCompanies = companies.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete a company
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      await axios.delete(`https://rjtask-server.vercel.app/api/companies/${id}`);
      fetchCompanies();
    } catch (err) {
      console.error("Error deleting company:", err);
    }
  };

  // // Placeholder for edit action
  // const handleEdit = (company) => {
  //   alert(`Edit feature coming soon for ${company.name}`);
  // };

   // ✅ Open edit modal
  const handleEdit = (company) => {
    setSelectedCompany(company);
    setIsEditModalOpen(true);
  };

  return (
    <div className="company-list-container">
      <h1>Company List</h1>
       {/* ✅ Search Input */}
        <input
          type="text"
          placeholder="Search ..."
          className="form-control w-75 mb-3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      <div className="company-list-header">
        

       
        <button className="add-company-btn" onClick={() => setIsModalOpen(true)}>
          + Add Company
        </button>
      </div>
    <div className="table-wrapper">
      <table className="company-table">
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        
        <tbody>
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>
                   <button
                      className="edit-btn"
                      onClick={() => handleEdit(c)}
                    >
                      ✏️ Edit
                    </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                No companies found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* Add Company Modal */}
      <AddCompanyModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchCompanies}
      />
       {/* Edit Company Modal */}
      {selectedCompany && (
        <EditCompanyModalForm
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCompany(null);
          }}
          company={selectedCompany}
          onUpdated={fetchCompanies}
        />
      )}

      
    </div>
  );
}

