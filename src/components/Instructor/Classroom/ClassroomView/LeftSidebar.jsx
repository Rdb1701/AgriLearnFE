import React from "react";
import ClassCode from "./ClassCode";
import UpcomingSection from "./UpcomingSection";
import { IoGameController } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function LeftSidebar({ class_code, paramsId }) {
  const navigate = useNavigate();

  const handleSimulationClick = () => {
    navigate(`/student/classroom/${paramsId}/simulation/`);
  }

  return (
    <div className="col-lg-3">
      <ClassCode class_code={class_code} />
      <UpcomingSection />
      <button
        className={`btn w-100 d-flex align-items-center text-start p-3 rounded-3 mt-3 btn-light text-white border`}
        style={{
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "rgba(208, 210, 208, 0.1)";
        }}
        onClick={handleSimulationClick}
      >
        <span className="me-3 text-dark" style={{ fontSize: "1.1rem" }}>
          <IoGameController />
        </span>
        <span className="fw-medium text-dark">2D Simulation</span>
      </button>
    </div>
  );
}
