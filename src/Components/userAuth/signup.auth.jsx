import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaPhone, FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;

console.log("BaseUrl:", BaseUrl);


export default function SignupAuth() {
  const [form, setForm] = useState({
    name: "",
    mobileNo: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${BaseUrl}/api/auth/signup`, form);
      alert(res.data.message || "Signup successful");
      navigate("/login");
    } catch (err) {
      alert(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #6a11cb, #2575fc)", // Purple to Blue gradient
      }}
    >
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{
          maxWidth: "450px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.9)", // translucent white
          backdropFilter: "blur(10px)", // glassmorphism effect
        }}
      >
        <h2 className="text-center mb-4 fw-bold text-primary">Create an Account</h2>
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3 input-group">
            <span className="input-group-text bg-primary text-white">
              <FaUser />
            </span>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Mobile */}
          <div className="mb-3 input-group">
            <span className="input-group-text bg-primary text-white">
              <FaPhone />
            </span>
            <input
              type="text"
              name="mobileNo"
              className="form-control"
              placeholder="Mobile Number"
              value={form.mobileNo}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3 input-group">
            <span className="input-group-text bg-primary text-white">
              <FaEnvelope />
            </span>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3 input-group">
            <span className="input-group-text bg-primary text-white">
              <FaLock />
            </span>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-3 input-group">
            <span className="input-group-text bg-primary text-white">
              <FaLock />
            </span>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold"
            disabled={loading}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account?{" "}
          <a href="/login" className="text-decoration-none fw-bold text-primary">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
