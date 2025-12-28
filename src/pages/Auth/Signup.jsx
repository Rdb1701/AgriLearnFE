import React, { useState } from "react";
import axiosClient from "../../../utils/axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import { FaGoogle } from "react-icons/fa";

export default function Signup() {
  const { setUser, setToken } = useStateContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: ""
  });
  const [errors, setErrors] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setIsLoading(true);
    try {
      const response = await axiosClient.post("/register", formData);
      setUser(response.data.user);
      setToken(response.data.token);
    } catch (error) {
      console.log("Signup Error:", error);
      const responseError = error.response?.data?.errors;
      if (error.response && error.response.status === 422) {
        if (responseError) {
          setErrors(responseError);
        }
      } else {
        setErrors({ message: [error.response?.data?.message || "An error occurred"] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8000/auth/google/instructor/redirect";
  };

  return (
    <div
      className="min-h-screen d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div
              className="card shadow-lg border-0"
              style={{ borderRadius: "20px", overflow: "hidden" }}
            >
              {/* Header */}
              <div
                className="card-header text-center py-4 border-0"
                style={{
                  background: "linear-gradient(45deg, #2d5016, #4a7c59)",
                }}
              >
                <div className="mb-3">
                  <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white shadow-sm"
                    style={{ width: "70px", height: "70px" }}
                  >
                    <img
                      src="/logo.png"
                      alt="AgriLearn Logo"
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                    />
                  </div>
                </div>
                <h2 className="text-white mb-1 fw-bold">Join AgriLearn</h2>
                <p className="text-white-50 mb-0">
                  Create your instructor account
                </p>
              </div>

              <div className="card-body p-4">
                {errors?.message && (
                  <div className="alert alert-danger text-center">
                    {errors.message[0]}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  {/* Name Field */}
                  <div className="mb-3">
                    <label
                      htmlFor="name"
                      className="form-label text-muted fw-semibold"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="me-2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      style={{
                        borderRadius: "12px",
                        border: "2px solid #e8f5e8",
                        backgroundColor: "#f8fdf8",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#4a7c59")}
                      onBlur={(e) => (e.target.style.borderColor = "#e8f5e8")}
                    />
                    {errors?.name && (
                      <div className="text-danger mt-1 small">
                        {errors.name[0]}
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label text-muted fw-semibold"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="me-2"
                      >
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      style={{
                        borderRadius: "12px",
                        border: "2px solid #e8f5e8",
                        backgroundColor: "#f8fdf8",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#4a7c59")}
                      onBlur={(e) => (e.target.style.borderColor = "#e8f5e8")}
                    />
                    {errors?.email && (
                      <div className="text-danger mt-1 small">
                        {errors.email[0]}
                      </div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label
                      htmlFor="password"
                      className="form-label text-muted fw-semibold"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="me-2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="12" cy="16" r="1" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a password"
                        style={{
                          borderRadius: "12px",
                          border: "2px solid #e8f5e8",
                          backgroundColor: "#f8fdf8",
                          paddingRight: "50px",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#4a7c59")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#e8f5e8")}
                      />
                      <button
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y me-2"
                        style={{ border: "none", background: "none" }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6c757d"
                            strokeWidth="2"
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6c757d"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors?.password && (
                      <div className="text-danger mt-1 small">
                        {errors.password[0]}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="password_confirmation"
                      className="form-label text-muted fw-semibold"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="me-2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="12" cy="16" r="1" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      Confirm Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control form-control-lg"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleInputChange}
                        placeholder="Confirm your password"
                        style={{
                          borderRadius: "12px",
                          border: "2px solid #e8f5e8",
                          backgroundColor: "#f8fdf8",
                          paddingRight: "50px",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#4a7c59")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#e8f5e8")}
                      />
                      <button
                        type="button"
                        className="btn position-absolute end-0 top-50 translate-middle-y me-2"
                        style={{ border: "none", background: "none" }}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6c757d"
                            strokeWidth="2"
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#6c757d"
                            strokeWidth="2"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-lg w-100 text-white fw-bold shadow-sm"
                    style={{
                      background: "linear-gradient(45deg, #2d5016, #4a7c59)",
                      borderRadius: "12px",
                      border: "none",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 8px 20px rgba(45, 80, 22, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 10px rgba(45, 80, 22, 0.2)";
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="me-2"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>

                <div className="text-center my-4">
                  <span className="text-muted">or</span>
                </div>

                <div className="mb-3">
                  <button
                    style={{
                      background: "linear-gradient(45deg, #2d5016, #4a7c59)",
                      borderRadius: "12px",
                      border: "none",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow =
                        "0 8px 20px rgba(45, 80, 22, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow =
                        "0 4px 10px rgba(45, 80, 22, 0.2)";
                    }}
                    onClick={handleGoogleSignup}
                    className="btn btn-lg w-100 text-white fw-bold shadow-sm"
                  >
                    <span>
                      <FaGoogle />
                    </span>{" "}
                    Continue with Google
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-muted">Already have an account? </span>
                  <a
                    href="/login"
                    className="text-decoration-none fw-semibold"
                    style={{ color: "#4a7c59" }}
                  >
                    Sign in to AgriLearn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}