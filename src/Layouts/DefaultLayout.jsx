import { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";
import { SiGoogleclassroom } from "react-icons/si";
import { FaArrowLeft, FaHome, FaUsers } from "react-icons/fa";
import { IoGameController } from "react-icons/io5";
import { IoArchiveSharp } from "react-icons/io5";
import { MdQuiz } from "react-icons/md";
import axiosClient from "../../utils/axios-client";
import swal from "sweetalert";

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
      id: "archives",
      label: "Archives",
      icon: <IoArchiveSharp />,
      route: "/instructor/archive",
    },
    // {
    //   id: "user",
    //   label: "User Management",
    //   icon: <FaUsers />,
    //   route: "/instructor/students",
    // },
  ];

  const menuItemsStudent = [
    {
      id: "studentDashboard",
      label: "Class",
      icon: <SiGoogleclassroom />,
      route: "/student/class",
    },
    // {
    //   id: "Simulation",
    //   label: "2D Graphical Simulation",
    //   icon: <IoGameController />,
    //   route: "/student/class",
    // },
    // {
    //   id: "Interactive_quiz",
    //   label: "Interactive Quiz",
    //   icon: <MdQuiz />,
    //   route: "/student/class",
    // },
  ];

  const handleItemClick = (itemId, route) => {
    setActiveItem(itemId);
    navigate(route);
    setIsMobileMenuOpen(false);
  };

  const onLogout = async () => {
    const confirm = await swal({
      title: "Are you sure you want to logout?",
      text: "",
      icon: "warning",
      buttons: ["Cancel", "Logout"],
      dangerMode: true,
    });

    if (!confirm) return;

    try {
      await axiosClient.post("/logout");

      setUser({});
      setToken(null);
    } catch (error) {
      console.log(error);
    }
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
        className={`position-fixed h-100 d-flex flex-column ${isMobileMenuOpen ? "d-block" : "d-none d-md-block"
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
            <div className="me-3">
              <img
                src="/logo.png"
                alt="AgriLearn Logo"
                style={{
                  width: "40px",  
                  height: "40px",
                }}
              />
            </div>
            <h5 className="mb-0 text-white fw-bold">AgriLearn</h5>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-grow-1 overflow-auto py-3">
          <div className="px-3">
            {(user.role === "Instructor" ? menuItems : menuItemsStudent).map(
              (item) => (
                <div key={item.id} className="mb-2">
                  <button
                    className={`btn w-100 d-flex align-items-center text-start p-3 rounded-3 ${activeItem === item.id
                        ? "btn-success"
                        : "btn-outline-success text-white"
                      }`}
                    style={{
                      backgroundColor:
                        activeItem === item.id ? "#4CAF50" : "transparent",
                      borderColor:
                        activeItem === item.id ? "#4CAF50" : "#4CAF50",
                      transition: "all 0.3s ease",
                    }}
                    onClick={() => handleItemClick(item.id, item.route)}
                    onMouseEnter={(e) => {
                      if (activeItem !== item.id) {
                        e.target.style.backgroundColor =
                          "rgba(76, 175, 80, 0.1)";
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
              )
            )}
          </div>
        </nav>


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
              <div className="text-success" style={{ fontSize: "0.8rem" }}>
                <a
                  href="#"
                  onClick={onLogout}
                  style={{ textDecoration: "none", color: "green" }}
                >
                  logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1" style={{ marginLeft: "0" }}>
        <div className="d-none d-md-block" style={{ marginLeft: "280px" }}>
          <div className="p-3 p-md-4">
            <Outlet />
          </div>
        </div>


        {/* Mobile content */}
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
