import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaDownload,
  FaBriefcase,
  FaGraduationCap,
  FaTools,
  FaProjectDiagram,
  FaUser,
} from "react-icons/fa";

const BaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;

export default function ViewResume() {
  const { userId } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading)
    return <p className="text-center mt-5 fw-bold">Loading resume...</p>;
  if (!resume)
    return (
      <p className="text-center mt-5 text-danger">Resume not found ❌</p>
    );

  return (
    <div
      className="py-5"
      style={{
        background: "linear-gradient(135deg, #89f7fe, #66a6ff)",
        minHeight: "100vh",
      }}
    >
      {/* Action Buttons Above Container */}
      <div className="container mb-4 d-flex justify-content-between">
        <button
          className="btn btn-outline-light shadow-sm d-flex align-items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft /> Back
        </button>
        <button
          className="btn btn-dark shadow-sm d-flex align-items-center gap-2"
          onClick={() =>
            window.open(
              `${BaseUrl}/api/resume/download/${resume._id}/${resume.version}`,
              "_blank"
            )
          }
        >
          <FaDownload /> Download PDF
        </button>
      </div>

      {/* Resume Layout */}
      <div className="container shadow-lg rounded-4 overflow-hidden">
        <div className="row g-0">
          {/* Sidebar (Purple) */}
          <div
            className="col-md-4 p-4 text-white"
            style={{
              background: "linear-gradient(160deg, #667eea, #764ba2)",
            }}
          >
            <div className="text-center mb-4">
              <FaUser size={60} className="mb-3" />
              <h3 className="fw-bold">
                {resume.personal?.firstName} {resume.personal?.lastName}
              </h3>
              <p className="mb-1">{resume.personal?.email}</p>
              <p className="mb-1">{resume.personal?.phone}</p>
              <p>{resume.personal?.address}</p>
            </div>

            {/* Skills */}
            {resume.skills?.length > 0 && (
              <div className="mt-4">
                <h5 className="fw-bold text-uppercase mb-2 border-bottom pb-1">
                  <FaTools /> Skills
                </h5>
                <div className="d-flex flex-wrap gap-2">
                  {resume.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="badge bg-light text-dark shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content (White) */}
          <div className="col-md-8 p-5 bg-white">
            {/* Summary */}
            {resume.summary && (
              <section className="mb-4">
                <h4 className="fw-bold border-bottom pb-2 text-secondary">
                  💡 Summary
                </h4>
                <p className="mt-2">{resume.summary}</p>
              </section>
            )}

            {/* Experience */}
            {resume.experience?.length > 0 && (
              <section className="mb-4">
                <h4 className="fw-bold border-bottom pb-2 text-secondary">
                  <FaBriefcase /> Experience
                </h4>
                {resume.experience.map((exp, i) => (
                  <div key={i} className="mb-3">
                    <h5 className="fw-bold">{exp.title}</h5>
                    <p className="mb-1 text-muted">
                      {exp.company} |{" "}
                      {new Date(exp.startDate).toLocaleDateString()} -{" "}
                      {exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString()
                        : "Present"}
                    </p>
                    <p>{exp.description}</p>
                  </div>
                ))}
              </section>
            )}

            {/* Education */}
            {resume.education?.length > 0 && (
              <section className="mb-4">
                <h4 className="fw-bold border-bottom pb-2 text-secondary">
                  <FaGraduationCap /> Education
                </h4>
                {resume.education.map((edu, i) => (
                  <div key={i} className="mb-3">
                    <h5 className="fw-bold">{edu.degree}</h5>
                    <p className="mb-1 text-muted">
                      {edu.school} |{" "}
                      {new Date(edu.startDate).toLocaleDateString()} -{" "}
                      {new Date(edu.endDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {/* Projects */}
            {resume.projects?.length > 0 && (
              <section className="mb-4">
                <h4 className="fw-bold border-bottom pb-2 text-secondary">
                  <FaProjectDiagram /> Projects
                </h4>
                {resume.projects.map((proj, i) => (
                  <div key={i} className="mb-3">
                    <h5 className="fw-bold">{proj.title}</h5>
                    <p className="mb-1 text-muted">
                      {proj.technologies?.join(", ")}
                    </p>
                    <p>{proj.description}</p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
