import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const BaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;

export default function EditResume() {
  const { userId,resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch current resume
  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BaseUrl}/api/resume/current/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResume(res.data.data);
      } catch (err) {
        toast.error("Failed to load resume");
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [userId]);

  // Handle field change
  const handleChange = (e, section, index, field) => {
    const value = e.target.value;
    setResume((prev) => {
      const updated = { ...prev };
      if (section === "personal") {
        updated.personal[field] = value;
      } else {
        updated[section][index][field] = value;
      }
      return updated;
    });
  };

  // Save resume
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BaseUrl}/api/resume/update/${resumeId}`,
        {
          personal: resume.personal,
          education: resume.education,
          experience: resume.experience,
          skills: resume.skills,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Resume updated successfully!");
      navigate(`/view-resume/${userId}`);
    } catch (err) {
      toast.error("Error updating resume");
    }
  };

  if (loading) return <p className="text-center mt-5 fw-bold">Loading resume...</p>;
  if (!resume) return <p className="text-center mt-5 text-danger">Resume not found ❌</p>;

  return (
    <div
      className="py-5"
      style={{
        background: "linear-gradient(135deg, #f6d365, #fda085)",
        minHeight: "100vh",
      }}
    >
      {/* Header buttons */}
      <div className="container mb-4 d-flex justify-content-between">
        <button
          className="btn btn-outline-dark d-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Back
        </button>
        <button
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={handleSave}
        >
          <FaSave /> Save Changes
        </button>
      </div>

      {/* Edit Form */}
      <div className="container bg-white shadow-lg rounded-4 p-4">
        <h4 className="fw-bold border-bottom pb-2 mb-4">👤 Personal Info</h4>
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              value={resume.personal?.firstName || ""}
              onChange={(e) => handleChange(e, "personal", null, "firstName")}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              value={resume.personal?.lastName || ""}
              onChange={(e) => handleChange(e, "personal", null, "lastName")}
            />
          </div>
          <div className="col-md-6">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={resume.personal?.email || ""}
              onChange={(e) => handleChange(e, "personal", null, "email")}
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              placeholder="Phone"
              value={resume.personal?.phone || ""}
              onChange={(e) => handleChange(e, "personal", null, "phone")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
