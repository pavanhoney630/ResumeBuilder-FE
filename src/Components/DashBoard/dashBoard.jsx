import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaDownload, FaTrash, FaPlus } from "react-icons/fa";

const BaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  // Fetch all resume versions
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        console.log("Fetching resumes for userId:", userId);

        const res = await axios.get(
          `${BaseUrl}/api/resume/versions/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("API response:", res.data);

        const resumesData = res.data.ResumeVersions || [];

        // Add resumeId for navigation
        const allVersions = resumesData.map((version) => ({
          ...version,
          resumeId: version.resumeId || version._id,
        }));

        console.log("All versions:", allVersions);

        setResumes(allVersions);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load resumes");
        setResumes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [userId]);

  const handleDelete = async (resumeId, version) => {
    if (!window.confirm(`Are you sure you want to delete version ${version}?`))
      return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${BaseUrl}/api/resume/delete/${resumeId}/${version}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update state: remove only the deleted version
      setResumes((prevResumes) =>
        prevResumes.filter(
          (r) => !(r.resumeId === resumeId && r.version === version)
        )
      );

      toast.success(`Version ${version} deleted successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Error deleting resume version");
    }
  };

  const handleDownload = async (resumeId, version) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BaseUrl}/api/resume/download/${resumeId}/${version}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob", // important for binary file
        }
      );

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `resume_v${version}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to download PDF");
      console.error(err);
    }
  };

  return (
    <div
      className="py-5"
      style={{
        background: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="fw-bold text-white">📑 My Resume Dashboard</h2>
          <button
            className="btn btn-lg btn-light shadow fw-bold d-flex align-items-center gap-2"
            onClick={() => navigate("/create-resume")}
          >
            <FaPlus /> Create Resume
          </button>
        </div>

        {loading ? (
          <p className="text-center fw-bold text-white">Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <div className="text-center text-white">
            <p className="fw-bold">No resumes found.</p>
            <button
              className="btn btn-outline-light"
              onClick={() => navigate("/create-resume")}
            >
              <FaPlus /> Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {resumes.map((resume, index) => (
              <div className="col-md-6 col-lg-4" key={resume._id}>
                <div
                  className="card shadow-lg border-0 rounded-4 h-100"
                  style={{
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold text-dark">
                      {resume.personal?.firstName} {resume.personal?.lastName}
                    </h5>
                    <p className="card-text text-muted small">
                      📧 {resume.personal?.email} <br />
                      📞 {resume.personal?.phone}
                    </p>
                    <p className="badge bg-primary-subtle text-dark mb-2">
                      Version {resume.version}
                    </p>
                    <p className="text-muted small">
                      Created: {new Date(resume.createdAt).toLocaleDateString()}
                    </p>

                    {/* Skills */}
                    <div className="mb-3">
                      {resume.skills?.slice(0, 3).map((skill, i) => (
                        <span key={i} className="badge bg-info text-dark me-1">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto d-flex flex-wrap gap-2">
                      {/* View Resume */}
                      <button
                        className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                        onClick={() =>
                          navigate(
                            `/view-resume/${resume.resumeId}?version=${resume.version}`
                          )
                        }
                      >
                        <FaEye /> View
                      </button>

                      {/* Edit Resume */}
                      <button
                        className="btn btn-sm btn-outline-success d-flex align-items-center gap-1"
                        onClick={() =>
                          navigate(
                            `/edit-resume/${resume.resumeId}?version=${resume.version}`
                          )
                        }
                      >
                        <FaEdit /> Edit
                      </button>

                      {/* Download PDF */}
                      <button
                        className="btn btn-sm btn-outline-warning d-flex align-items-center gap-1"
                        onClick={() =>
                          handleDownload(resume.resumeId, resume.version)
                        }
                      >
                        <FaDownload /> PDF
                      </button>

                      {/* Delete Resume Version */}
                      <button
                        className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                        onClick={() =>
                          handleDelete(resume.resumeId, resume.version)
                        }
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
