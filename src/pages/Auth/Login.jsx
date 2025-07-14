import React, { useState } from "react";
import axiosClient from "../../../utils/axios-client";
import { useStateContext } from "../../contexts/ContextProvider";

export default function Login() {
  const { setUser, setToken } = useStateContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);
    try {
      const response = await axiosClient.post("/login", formData);
      console.log(response.data);
      setUser(response.data.user);
      setToken(response.data.token);
    } catch (error) {
      console.log("Login Error:", error);
      const responseError = error.response.data.errors;
      if (error.response && error.response.status === 422) {
        if (responseError) {
          setErrors(responseError);
        } else {
          // console.log([error.response.data.message]);
          // setErrors([error.response.data.message]);
        }
      } else {
        console.log({ message: [error.response.data.message] });
        setErrors({ message: [error.response.data.message] });
      }
    }
  };


  return (
    <div
      className="min-h-screen d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
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
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2d5016"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7v10c0 5.55 3.84 10 9 12 5.16-2 9-6.45 9-12V7l-10-5z" />
                      <path d="M8 11l2 2 4-4" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-white mb-1 fw-bold">AgriLearn</h2>
                <p className="text-white-50 mb-0">
                  Welcome back to your agricultural journey
                </p>
              </div>
              {/* Form Body */}
              <div className="card-body p-4">
               {errors?.message && (
                <div className="alert alert-danger text-center">{errors.message[0]}</div>
              )}
                <form onSubmit={handleSubmit}>
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
                  <div className="mb-4">
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
                        placeholder="Enter your password"
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
                      {errors?.password && (
                        <div className="text-danger mt-1 small">
                          {errors.email[0]}
                        </div>
                      )}
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
                  </div>

                  {/* Login Button */}
                  <button
                    type="submit"
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
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <polyline points="10,17 15,12 10,7" />
                      <line x1="15" y1="12" x2="3" y2="12" />
                    </svg>
                    Sign In to AgriLearn
                  </button>
                </form>
         
                <div className="text-center my-4">
                  <span className="text-muted">or</span>
                </div>

                <div className="text-center">
                  <span className="text-muted">Don't have an account? </span>
                  <a
                    href="#"
                    className="text-decoration-none fw-semibold"
                    style={{ color: "#4a7c59" }}
                  >
                    Join AgriLearn today
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
