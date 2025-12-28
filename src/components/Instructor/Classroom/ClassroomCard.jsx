import React, { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../../contexts/ContextProvider";
import axiosClient from "../../../../utils/axios-client";
import swal from 'sweetalert';


export default function ClassroomCard({ classroomData, onEdit, isLoading, fetchClassroom, description, fetchDataa }) {
  const navigate = useNavigate();
  const { user } = useStateContext();

  const [invitations, setInvitations] = useState([]); // invitations from API
  const [acceptedClasses, setAcceptedClasses] = useState([]); // track accepted


  useEffect(() => {
    if (user.role === "Student") {
      axiosClient
        .get("/getEnrollmentStatus")
        .then(({ data }) => {
          setInvitations(data);
        })
        .catch((err) => {
          console.error("Failed to load invitations:", err);
        });
    }
  }, [user.role]);


  const handleArchive = async (classroomId) => {
    if (window.confirm("Are you sure you want to archive this classroom?")) {
      console.log("Archive classroom with ID:", classroomId);

      try {
        const response = await axiosClient.put(`/archive/classroom/${classroomId}`)

        swal('', 'Successfully Archived the Subject', 'success');

        fetchClassroom()
      } catch (error) {
        console.log(error)
      }
    }

  };

  const handleView = (id) => {
    navigate(`/instructor/classrooms/${id}`);
  };

  const handleViewStudent = (id) => {
    navigate(`/student/classrooms/${id}`);
  };

  //accept enrollment
  const handleAccept = async (id) => {
    const willAccept = await swal({
      title: "Are you sure?",
      text: "Do you want to accept this subject?",
      icon: "warning",
      buttons: ["Cancel", "Yes, accept it!"],
      dangerMode: false,
    });

    if (willAccept) {
      try {
        const response = await axiosClient.put(`/acceptEnrollment/${id}`);

        console.log("Accepted classroom:", id);

        // Update state so the button switches to "View"
        setAcceptedClasses((prev) => [...prev, id]);

        await swal("Subject accepted!", {
          icon: "success",
        });
      } catch (error) {
        console.error("Failed to accept classroom:", error);

        await swal("Failed to accept enrollment.", {
          icon: "error",
        });
      }
    }
  };

  //reject enrollment
  const handleReject = async (id) => {
    const willReject = await swal({
      title: "Are you sure?",
      text: "Do you want to reject this subject? This action cannot be undone.",
      icon: "warning",
      buttons: ["Cancel", "Yes, reject it!"],
      dangerMode: true,
    });

    if (willReject) {
      try {
        const response = await axiosClient.delete(`/rejectEnrollment/${id}`);

        console.log("Rejected classroom:", id);

        // Optionally update state (e.g., remove from acceptedClasses)
        setAcceptedClasses((prev) => prev.filter(classId => classId !== id));

       fetchDataa();
        await swal("Subject rejected!", {
          icon: "success",
        });
      } catch (error) {
        console.error("Failed to reject classroom:", error);

        await swal("Failed to reject enrollment.", {
          icon: "error",
        });
      }
    }
  };

  // check if this classroom is invited (status = false)
  const isInvited = (classroomId) => {
    const invite = invitations.find(
      (inv) => inv.classroom_id === classroomId
    );
    return invite ? invite.status === 0 : false;
  };

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h2 className="text-success fw-bold">{description}</h2>
      </div>

      <div className="row g-4">
        {classroomData.length > 0 ? (
          classroomData.map((classroom) => {
            const invited = isInvited(classroom.id);
            const alreadyAccepted = acceptedClasses.includes(classroom.id);

            return (
              <div key={classroom.id} className="col-12 col-md-6 col-lg-4">
                <div className="card classroom-card">
                  <div className="card-header-green">
                    {user.role === "Instructor" && classroom.status &&  (
                      
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
                              <i className="bi bi-pencil"></i> Edit
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
                              <i className="bi bi-archive"></i> Archive
                            </a>
                          </li>
                        </ul>
                      </div>
                    )}
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
                      {invited && !alreadyAccepted && user.role === "Student" ? (
                        <div>
                          <button
                            className="btn btn-warning me-2"
                            onClick={() => handleAccept(classroom.id)}
                          >
                            Accept
                          </button>
                          
                          <button
                            className="btn btn-danger"
                            onClick={() => handleReject(classroom.id)}
                          >
                            Reject
                          </button>
                        </div>

                      ) : (
                        <button
                          className="btn btn-green"
                          disabled={invited && !alreadyAccepted}
                          onClick={
                            user.role === "Instructor"
                              ? () => handleView(classroom.id)
                              : () => handleViewStudent(classroom.id)
                          }
                        >
                          View Class
                        </button>
                      )}

                      <div>
                        <button className="btn btn-link text-muted p-1">
                          <i className="bi bi-chat-dots"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center">
            {isLoading ? (
              <div className="text-center py-4">
                <div
                  className="spinner-border text-success mb-3"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mb-0">Loading Classroom...</p>
              </div>
            ) : (
              <span className="text-danger">No Data Available</span>
            )}
          </div>
        )}
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
    </div>
  );
}
