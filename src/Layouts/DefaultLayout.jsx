"use client";

import { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { SiGoogleclassroom } from "react-icons/si";
import { FaHome, FaUsers } from "react-icons/fa";

export default function DefaultLayout() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, setUser, token, setToken } = useStateContext();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FaHome />,
      route: "/instructor/dashboard",
    },
    {
      id: "classroom",
      label: "Classroom Management",
      icon: <SiGoogleclassroom />,
      route: "/instructor/classrooms",
    },
    {
      id: "user",
      label: "User Management",
      icon: <FaUsers />,
      route: "/instructor/students",
    },
  ];

  const handleItemClick = (itemId, route) => {
    setActiveItem(itemId);
    navigate(route);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="d-flex">
      {/* Mobile Menu Toggle Button */}
      <button
        className="d-md-none position-fixed top-0 start-0 m-3 btn btn-success"
        style={{ zIndex: 1051 }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <span className="navbar-toggler-icon">☰</span>
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="position-fixed w-100 h-100 d-md-none"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 1049,
            top: 0,
            left: 0,
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`position-fixed h-100 d-flex flex-column ${
          isMobileMenuOpen ? "d-block" : "d-none d-md-block"
        }`}
        style={{
          width: "280px",
          backgroundColor: "#2d5a2d",
          backgroundImage: "linear-gradient(135deg, #2d5a2d 0%, #1a4a1a 100%)",
          zIndex: 1050,
          top: 0,
          left: 0,
          boxShadow: "2px 0 15px rgba(0,0,0,0.1)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Header */}
        <div className="p-4 border-bottom border-success">
          <div className="d-flex align-items-center">
            <div
              className="rounded-circle me-3 d-flex align-items-center justify-content-center"
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "#4CAF50",
                color: "white",
                fontSize: "1.2rem",
              }}
            >
              🌱
            </div>
            <h5 className="mb-0 text-white fw-bold">AgriLearn</h5>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow-1 overflow-auto py-3">
          <div className="px-3">
            {menuItems.map((item) => (
              <div key={item.id} className="mb-2">
                <button
                  className={`btn w-100 d-flex align-items-center text-start p-1 rounded-3 ${
                    activeItem === item.id
                      ? "btn-success"
                      : "btn-outline-success text-white"
                  }`}
                  style={{
                    backgroundColor:
                      activeItem === item.id ? "#4CAF50" : "transparent",
                    borderColor: activeItem === item.id ? "#4CAF50" : "#4CAF50",
                    transition: "all 0.3s ease",
                  }}
                  onClick={() => handleItemClick(item.id, item.route)}
                  onMouseEnter={(e) => {
                    if (activeItem !== item.id) {
                      e.target.style.backgroundColor = "rgba(76, 175, 80, 0.1)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeItem !== item.id) {
                      e.target.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span className="me-3" style={{ fontSize: "1.1rem" }}>
                    {item.icon}
                  </span>
                  <span className="fw-medium">{item.label}</span>
                </button>
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-3 border-top border-success">
          <div className="d-flex align-items-center text-white">
            <div
              className="rounded-circle me-3 d-flex align-items-center justify-content-center"
              style={{
                width: "35px",
                height: "35px",
                backgroundColor: "#4CAF50",
                fontSize: "1rem",
              }}
            >
              👤
            </div>
            <div>
              <div className="fw-medium" style={{ fontSize: "0.9rem" }}>
                {user.name}
              </div>
              <div className="text-success" style={{ fontSize: "0.8rem" }}>
                {user.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: "0" }}>
        {/* Desktop margin */}
        <div className="d-none d-md-block" style={{ marginLeft: "280px" }}>
          <div className="p-3 p-md-4">
            <Outlet />
          </div>
        </div>
        
        {/* Mobile content (no margin) */}
        <div className="d-md-none">
          <div style={{ height: "60px" }} />
          <div className="p-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}