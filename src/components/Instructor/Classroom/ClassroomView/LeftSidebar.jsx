import React, { useState, useEffect } from "react";
import ClassCode from "./ClassCode";
import UpcomingSection from "./UpcomingSection";
import { IoGameController } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../../../contexts/ContextProvider";
import { Power } from "lucide-react";
import axiosClient from "../../../../../utils/axios-client";

export default function LeftSidebar({ class_code, paramsId }) {
  const navigate = useNavigate();
  const { user } = useStateContext();
  const [isSimulationOn, setIsSimulationOn] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSimulationStatus = async () => {
      try {
        const response = await axiosClient.get(`/classroom/${paramsId}/is-simulation-on`);
        setIsSimulationOn(response.data.is_simulation_on);
      } catch (error) {
        console.error("Error fetching simulation status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSimulationStatus();
  }, [paramsId]);

  const handleSimulationClick = () => {
    navigate(`/student/classroom/${paramsId}/simulation/`);
  };

  const handleToggleSimulation = async () => {
    setIsToggling(true);
    try {
      const response = await axiosClient.post(`/classroom/${paramsId}/toggle-simulation`);
      setIsSimulationOn(response.data.is_simulation_on);
    } catch (error) {
      console.error("Error toggling simulation status:", error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="col-lg-3">
      <ClassCode class_code={class_code} />
      <UpcomingSection />
      
      {/* Instructor: Toggle Simulation Button */}
      {user.role === "Instructor" && (
        <div className="card mt-3 border-0 shadow-sm" style={{ borderRadius: "12px" }}>
          <div className="card-body p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div>
                  <div className="fw-medium" style={{ fontSize: "14px" }}>
                    2D Simulation
                  </div>
                  <small className={isSimulationOn ? "text-success" : "text-danger"}>
                    {isLoading ? "Loading..." : isSimulationOn ? "Enabled" : "Disabled"}
                  </small>
                </div>
              </div>
              <button
                className={`btn btn-sm ${isSimulationOn ? "btn-success" : "btn-outline-secondary"}`}
                onClick={handleToggleSimulation}
                disabled={isToggling || isLoading}
                style={{
                  width: "44px",
                  height: "28px",
                  borderRadius: "14px",
                  padding: 0,
                  position: "relative",
                  transition: "all 0.3s ease",
                }}
                title={isSimulationOn ? "Turn Off" : "Turn On"}
              >
                {isToggling ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    style={{ width: "14px", height: "14px" }}
                  ></span>
                ) : (
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: isSimulationOn ? "24px" : "6px",
                      transform: "translateY(-50%)",
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      transition: "left 0.3s ease",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                    }}
                  ></span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student: Open Simulation Button */}
      {user.role === "Student" && (
        <button
          className={`btn w-100 d-flex align-items-center text-start p-3 rounded-3 mt-3 ${isSimulationOn ? "btn-light border" : "btn-secondary"}`}
          style={{
            transition: "all 0.3s ease",
            opacity: isSimulationOn ? 1 : 0.7,
          }}
          onMouseEnter={(e) => {
            if (isSimulationOn) {
              e.target.style.backgroundColor = "rgba(208, 210, 208, 0.1)";
            }
          }}
          onClick={handleSimulationClick}
          disabled={!isSimulationOn || isLoading}
          title={!isSimulationOn ? "Simulation is currently disabled by instructor" : "Open 2D Simulation"}
        >
          <span className={`me-3 ${isSimulationOn ? "text-dark" : "text-white"}`} style={{ fontSize: "1.1rem" }}>
            <IoGameController />
          </span>
          <div>
            <span className={`fw-medium ${isSimulationOn ? "text-dark" : "text-white"}`}>2D Simulation</span>
            {!isSimulationOn && !isLoading && (
              <div style={{ fontSize: "11px" }} className="text-white-50">
                Disabled by instructor
              </div>
            )}
          </div>
        </button>
      )}
    </div>
  );
}
