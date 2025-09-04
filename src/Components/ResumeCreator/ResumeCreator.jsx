import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;

export default function ResumeCreate() {
  const [form, setForm] = useState({
    personal: { firstName: "", lastName: "", email: "", phone: "" },
    education: [{ school: "", degree: "", startDate: "", endDate: "" }],
    experience: [{ company: "", title: "", startDate: "", endDate: "" }],
    skills: [""],
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // handle change for nested objects
  const handlePersonalChange = (e) => {
    setForm({
      ...form,
      personal: { ...form.personal, [e.target.name]: e.target.value },
    });
  };

  const handleEducationChange = (index, e) => {
    const updated = [...form.education];
    updated[index][e.target.name] = e.target.value;
    setForm({ ...form, education: updated });
  };

  const handleExperienceChange = (index, e) => {
    const updated = [...form.experience];
    updated[index][e.target.name] = e.target.value;
    setForm({ ...form, experience: updated });
  };

  const handleSkillChange = (index, e) => {
    const updated = [...form.skills];
    updated[index] = e.target.value;
    setForm({ ...form, skills: updated });
  };

  // Add new rows
  const addEducation = () =>
    setForm({
      ...form,
      education: [
        ...form.education,
        { school: "", degree: "", startDate: "", endDate: "" },
      ],
    });

  const addExperience = () =>
    setForm({
      ...form,
      experience: [
        ...form.experience,
        { company: "", title: "", startDate: "", endDate: "" },
      ],
    });

  const addSkill = () => setForm({ ...form, skills: [...form.skills, ""] });

  // Remove rows
  const removeEducation = (index) => {
    const updated = form.education.filter((_, i) => i !== index);
    setForm({ ...form, education: updated });
  };

  const removeExperience = (index) => {
    const updated = form.experience.filter((_, i) => i !== index);
    setForm({ ...form, experience: updated });
  };

  const removeSkill = (index) => {
    const updated = form.skills.filter((_, i) => i !== index);
    setForm({ ...form, skills: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BaseUrl}/api/resume/create`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Response:", res.data);
      toast.success("Resume saved successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error saving resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center py-5"
      style={{
        background:
          "linear-gradient(120deg, #f6d365, #fda085, #5ee7df, #b490ca)",
        minHeight: "100vh",
      }}
    >
      <div
        className="card shadow-lg p-4 rounded-4 w-100"
        style={{ maxWidth: "850px", background: "rgba(255, 255, 255, 0.97)" }}
      >
        <h2 className="text-center fw-bold text-primary mb-4">
          📄 Create Resume
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <h5 className="text-secondary mb-3">Personal Information</h5>
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <input
                className="form-control"
                name="firstName"
                placeholder="First Name"
                value={form.personal.firstName}
                onChange={handlePersonalChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                name="lastName"
                placeholder="Last Name"
                value={form.personal.lastName}
                onChange={handlePersonalChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="email"
                name="email"
                placeholder="Email"
                value={form.personal.email}
                onChange={handlePersonalChange}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                name="phone"
                placeholder="Phone"
                value={form.personal.phone}
                onChange={handlePersonalChange}
                required
              />
            </div>
          </div>

          {/* Education */}
          <h5 className="text-secondary mb-3">Education</h5>
          {form.education.map((edu, i) => (
            <div className="row g-3 mb-3 align-items-center" key={i}>
              <div className="col-md-3">
                <input
                  className="form-control"
                  name="school"
                  placeholder="School"
                  value={edu.school}
                  onChange={(e) => handleEducationChange(i, e)}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  className="form-control"
                  name="degree"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(i, e)}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  className="form-control"
                  name="startDate"
                  type={edu.startDate ? "date" : "text"}
                  placeholder="Start Date"
                  value={edu.startDate}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  onChange={(e) => handleEducationChange(i, e)}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  className="form-control"
                  name="endDate"
                  type={edu.endDate ? "date" : "text"}
                  placeholder="End Date"
                  value={edu.endDate}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  onChange={(e) => handleEducationChange(i, e)}
                />
              </div>
              <div className="col-md-2 text-end">
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeEducation(i)}
                  disabled={form.education.length === 1}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary btn-sm mb-4"
            onClick={addEducation}
          >
            ➕ Add Education
          </button>

          {/* Experience */}
          <h5 className="text-secondary mb-3">Experience</h5>
          {form.experience.map((exp, i) => (
            <div className="row g-3 mb-3 align-items-center" key={i}>
              <div className="col-md-3">
                <input
                  className="form-control"
                  name="company"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(i, e)}
                  required
                />
              </div>
              <div className="col-md-3">
                <input
                  className="form-control"
                  name="title"
                  placeholder="Job Title"
                  value={exp.title}
                  onChange={(e) => handleExperienceChange(i, e)}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  className="form-control"
                  name="startDate"
                  type={exp.startDate ? "date" : "text"}
                  placeholder="Start Date"
                  value={exp.startDate}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  onChange={(e) => handleExperienceChange(i, e)}
                  required
                />
              </div>
              <div className="col-md-2">
                <input
                  className="form-control"
                  name="endDate"
                  type={exp.endDate ? "date" : "text"}
                  placeholder="End Date"
                  value={exp.endDate}
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    if (!e.target.value) e.target.type = "text";
                  }}
                  onChange={(e) => handleExperienceChange(i, e)}
                />
              </div>
              <div className="col-md-2 text-end">
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => removeExperience(i)}
                  disabled={form.experience.length === 1}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-success btn-sm mb-4"
            onClick={addExperience}
          >
            ➕ Add Experience
          </button>

          {/* Skills */}
          <h5 className="text-secondary mb-3">Skills</h5>
          {form.skills.map((skill, i) => (
            <div className="input-group mb-3" key={i}>
              <input
                className="form-control"
                placeholder="Skill"
                value={skill}
                onChange={(e) => handleSkillChange(i, e)}
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeSkill(i)}
                disabled={form.skills.length === 1}
              >
                ❌
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-warning btn-sm mb-4"
            onClick={addSkill}
          >
            ➕ Add Skill
          </button>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold shadow-sm"
            disabled={loading}
          >
            {loading ? "Saving..." : "💾 Save Resume"}
          </button>
        </form>
      </div>
    </div>
  );
}
