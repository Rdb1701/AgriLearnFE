import React, { useEffect, useState } from "react";
import axiosClient from "../../../../utils/axios-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";


export default function ClassroomCard({ classroomData, onEdit }) {
  const navigate = useNavigate();
  const handleArchive = (classroomId) => {
    console.log("Archive classroom with ID:", classroomId);
    // Add  archive logic here

    if (window.confirm("Are you sure you want to archive this classroom?")) {
      // Call archive API
    }
  };

  const handleView = (id) => {
    navigate(`/instructor/classrooms/${id}`);
  };

  return (
    <>
      <div className="container py-4">
        <div className="mb-4">
          <h2 className="text-success fw-bold">My Classes</h2>
          <p className="text-muted">
            Welcome back! Here are your active classrooms.
          </p>
        </div>

        <div className="row g-4">
          {classroomData.map((classroom) => (
            <div key={classroom.id} className="col-12 col-md-6 col-lg-4">
              <div className="card classroom-card">
                <div className="card-header-green">
                  <div className="dropdown">
                    <button
                      className="three-dots-btn dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <BsThreeDotsVertical />
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => onEdit(classroom)}
                        >
                          <i className="bi bi-pencil"></i>
                          Edit
                        </a>
                      </li>
                      <li>
                        <a
                          className="dropdown-item text-danger"
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleArchive(classroom.id);
                          }}
                        >
                          <i className="bi bi-archive"></i>
                          Archive
                        </a>
                      </li>
                    </ul>
                  </div>
                  <h5 className="mb-1 fw-bold">{classroom.class_name}</h5>
                  <p className="mb-0 opacity-75">{classroom.subject}</p>
                </div>

                <div className="card-body">
                  <div className="d-flex align-items-center mb-3">
                    <div className="teacher-avatar me-2">
                      {classroom.instructor_id ? "I" : "T"}
                    </div>
                    <div>
                      <div className="text-muted small">
                        Section Code: {classroom.section_code}
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <button
                      className="btn btn-green"
                      onClick={() => handleView(classroom.id)}
                    >
                      View Class
                    </button>
                    <div>
                      <button className="btn btn-link text-muted p-1">
                        <i className="bi bi-chat-dots"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .classroom-card {
          border: none;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .classroom-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .card-header-green {
          background: linear-gradient(135deg, #28a745, #20c997);
          color: white;
          border: none;
          padding: 1.5rem;
          position: relative;
        }

        .card-header-green::after {
          content: "";
          position: absolute;
          top: -30px;
          right: -30px;
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }

        .dropdown-toggle::after {
          display: none;
        }

        .three-dots-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .three-dots-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          color: white;
        }

        .dropdown-menu {
          border: none;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 0.5rem 0;
        }

        .dropdown-item {
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dropdown-item:hover {
          background: #f8f9fa;
        }

        .dropdown-item.text-danger:hover {
          background: #fff5f5;
          color: #dc3545;
        }

        .teacher-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #495057;
          font-size: 0.875rem;
        }

        .btn-green {
          background: #28a745;
          border: none;
          color: white;
          padding: 0.5rem 1.25rem;
          border-radius: 20px;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .btn-green:hover {
          background: #218838;
          color: white;
          transform: translateY(-1px);
        }
      `}</style>
    </>
  );
}
