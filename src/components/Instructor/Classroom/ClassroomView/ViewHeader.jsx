import React from "react";

export default function ViewHeader({ subject, classroomName }) {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div
          className="card border-0 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            minHeight: "200px",
          }}
        >
          <div className="card-body text-white d-flex align-items-center justify-content-between">
            <div>
              <h1 className="display-6 fw-bold mb-2">{subject}</h1>
              <p className="fs-5 mb-0">{classroomName}</p>
            </div>
            <div className="d-flex align-items-center">
              <div className="me-3" style={{ opacity: 0.7 }}>
                <i className="fas fa-coffee" style={{ fontSize: "3rem" }}></i>
              </div>
              <div style={{ opacity: 0.7 }}>
                <i
                  className="fas fa-user-circle"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              {/* <button className="btn btn-light btn-sm ms-3">
                <i className="fas fa-edit me-2"></i>
                Customize
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
