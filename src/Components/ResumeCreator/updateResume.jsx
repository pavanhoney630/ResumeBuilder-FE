import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowLeft, FaSave } from "react-icons/fa";

const BaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;

export default function EditResume() {
  const { resumeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const versionNumber = parseInt(queryParams.get("version")); // e.g., 1

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BaseUrl}/api/resume/current/${resumeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.data.data) throw new Error("Resume not found");

        const data = res.data.data;
        const versionData = data.versions.find((v) => v.version === versionNumber);
        if (!versionData) throw new Error("Version not found");

        setResume({ ...data, currentVersion: versionData });
      } catch (err) {
        toast.error(err.message || "Failed to load resume");
        setResume(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [resumeId, versionNumber]);

  const handleChange = (e, section, index, field) => {
    const value = e.target.value;
    setResume((prev) => {
      const updated = { ...prev };
      if (section === "personal") {
        updated.currentVersion.personal[field] = value;
      } else {
        updated.currentVersion[section][index][field] = value;
      }
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${BaseUrl}/api/resume/update/${resumeId}`,
        {
          personal: resume.currentVersion.personal,
          summary: resume.currentVersion.personal.summary,
          education: resume.currentVersion.education,
          experience: resume.currentVersion.experience,
          skills: resume.currentVersion.skills,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Resume updated successfully!");
      navigate(-1);
    } catch (err) {
      toast.error("Error updating resume");
    }
  };

  if (loading) return <p className="text-center mt-5 fw-bold">Loading resume...</p>;
  if (!resume) return <p className="text-center mt-5 text-danger">Resume not found ❌</p>;

  const cv = resume.currentVersion;

  return (
    <div
      className="py-5"
      style={{ background: "linear-gradient(135deg, #f6d365, #fda085)", minHeight: "100vh" }}
    >
      <div className="container mb-4 d-flex justify-content-between">
        <button className="btn btn-outline-dark d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <button className="btn btn-success d-flex align-items-center gap-2" onClick={handleSave}>
          <FaSave /> Save Changes
        </button>
      </div>

      <div className="container bg-white shadow-lg rounded-4 p-4">
        {/* Personal Info */}
        <h4 className="fw-bold border-bottom pb-2 mb-4">👤 Personal Info</h4>
        <div className="row g-3 mb-4">
          {["firstName", "lastName", "email", "phone", "summary"].map((field, idx) => (
            <div className="col-md-6 mb-3" key={idx}>
              <input
                type={field === "email" ? "email" : "text"}
                className="form-control"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={cv.personal?.[field] || ""}
                onChange={(e) => handleChange(e, "personal", null, field)}
              />
            </div>
          ))}
        </div>

        {/* Education */}
        <h4 className="fw-bold border-bottom pb-2 mb-4">🎓 Education</h4>
        {cv.education?.map((edu, idx) => (
          <div className="row g-3 mb-3" key={idx}>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="School"
                value={edu.school || ""}
                onChange={(e) => handleChange(e, "education", idx, "school")}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Degree"
                value={edu.degree || ""}
                onChange={(e) => handleChange(e, "education", idx, "degree")}
              />
            </div>
            <div className="col-md-6">
              <input
                type="date"
                className="form-control"
                placeholder="Start Date"
                value={edu.startDate?.slice(0, 10) || ""}
                onChange={(e) => handleChange(e, "education", idx, "startDate")}
              />
            </div>
            <div className="col-md-6">
              <input
                type="date"
                className="form-control"
                placeholder="End Date"
                value={edu.endDate?.slice(0, 10) || ""}
                onChange={(e) => handleChange(e, "education", idx, "endDate")}
              />
            </div>
          </div>
        ))}

        {/* Experience */}
        <h4 className="fw-bold border-bottom pb-2 mb-4">💼 Experience</h4>
        {cv.experience?.map((exp, idx) => (
          <div className="row g-3 mb-3" key={idx}>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Company"
                value={exp.company || ""}
                onChange={(e) => handleChange(e, "experience", idx, "company")}
              />
            </div>
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={exp.title || ""}
                onChange={(e) => handleChange(e, "experience", idx, "title")}
              />
            </div>
            <div className="col-md-6">
              <input
                type="date"
                className="form-control"
                placeholder="Start Date"
                value={exp.startDate?.slice(0, 10) || ""}
                onChange={(e) => handleChange(e, "experience", idx, "startDate")}
              />
            </div>
            <div className="col-md-6">
              <input
                type="date"
                className="form-control"
                placeholder="End Date"
                value={exp.endDate?.slice(0, 10) || ""}
                onChange={(e) => handleChange(e, "experience", idx, "endDate")}
              />
            </div>
            <div className="col-12">
              <input
                type="text"
                className="form-control"
                placeholder="Description"
                value={exp.description || ""}
                onChange={(e) => handleChange(e, "experience", idx, "description")}
              />
            </div>
          </div>
        ))}

        {/* Skills */}
        <h4 className="fw-bold border-bottom pb-2 mb-4">🛠 Skills</h4>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {cv.skills?.map((skill, idx) => (
            <input
              key={idx}
              type="text"
              className="form-control w-auto"
              value={skill || ""}
              onChange={(e) => {
                const newSkills = [...cv.skills];
                newSkills[idx] = e.target.value;
                setResume((prev) => ({
                  ...prev,
                  currentVersion: { ...prev.currentVersion, skills: newSkills },
                }));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
