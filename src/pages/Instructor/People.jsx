import React, { useEffect, useState } from "react";
import { Users, UserPlus, MoreHorizontal, ArrowUpDown } from "lucide-react";
import NavigationTabs from "../../components/Instructor/Classroom/ClassroomView/NavigationTabs";
import PeopleModal from "../../components/Instructor/Classroom/People/PeopleModal";
import { useParams } from "react-router-dom";
import axiosClient from "../../../utils/axios-client";
import { useStateContext } from "../../contexts/ContextProvider";
import swal from "sweetalert";

export default function People() {
  const [activeTab, setActiveTab] = useState("people");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const { id } = useParams();
  const { user } = useStateContext();
  const [students, setStudents] = useState([]);

  // Mock data matching the image
  const teachers = [
    {
      id: user.id,
      name: user.name,
      avatar: user.name.charAt(0).toUpperCase(),
      color: "#ff6b35", // Orange color
    },
  ];

  const fetchStudents = async () => {
    try {
      const response = await axiosClient.get("/class_enrollment");
      setStudents(response.data);
    //  console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.id));
    }
  };

  const handleSubmit = async (payload) => {
    try {
      const response = await axiosClient.post("/class_enrollment", payload);
      // console.log(response);
      // console.log(response.data.message);
      fetchStudents();
    } catch (error) {
      console.log(error);
      if (error.response) {
        return error.response.data.errors;
      }
    }
  };

  const handleDelete = async (id) => {
    // console.log(id)
    if (confirm("Are you sure you want to delete student from classroom?")) {
      try {
        const response = await axiosClient.delete(`/class_enrollment/${id}`);

        if (response.status === 204) {
          swal("Successfully Deleted", "", "success");
        } else {
          swal("Cannot Delete Student", "", "warning");
        }
      } catch (error) {
        console.log(error);
      } finally {
        fetchStudents();
      }
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <PeopleModal onSubmit={handleSubmit} />

      <div className="min-vh-100 bg-light">
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          paramsId={id}
        />

        <div className="container py-4">
          {/* Teachers Section */}
          <div className="card mb-4">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 fw-normal">Teachers</h5>
              </div>
            </div>

            <div className="card-body">
              {teachers.map((teacher) => (
                <div key={teacher.id} className="d-flex align-items-center">
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3`}
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: teacher.color,
                    }}
                  >
                    {teacher.avatar}
                  </div>
                  <span className="text-dark fw-medium">{teacher.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Students Section */}
          <div className="card">
            <div className="card-header bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0 fw-normal">Students</h5>
                <div className="d-flex align-items-center">
                  <span className="text-muted me-3 small">
                    {students.length} Students
                  </span>
                  <button
                    className="btn btn-sm btn-outline-secondary rounded-circle p-2"
                    data-bs-target="#add_modal"
                    data-bs-toggle="modal"
                  >
                    <UserPlus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Student Controls */}
            {/* <div className="px-4 py-3 bg-light border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="form-check me-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="selectAll"
                      // checked={selectedStudents.length === students.length}
                      onChange={handleSelectAll}
                    />
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Actions
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          Remove students
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <button className="btn btn-sm btn-outline-secondary">
                  <ArrowUpDown size={16} />
                </button>
              </div>
            </div> */}

            {/* Students List */}
            <div className="card-body p-0">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom"
                >
                  <div className="d-flex align-items-center">
                    {/* <div className="form-check me-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`student-${student.id}`}
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentSelect(student.id)}
                      />
                    </div> */}
                    <div
                      className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3`}
                      style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor:
                          "#" +
                          Math.floor(Math.random() * 16777215).toString(16),
                      }}
                    >
                      {student.email
                        ? student.email.charAt(0).toUpperCase()
                        : "?"}{" "}
                    </div>
                    <div className="d-flex align-items-center">
                      <span
                        className={
                          student.status === false
                            ? "text-dark fw-medium opacity-50"
                            : "text-dark fw-medium"
                        }
                      >
                        {student.name === null ? student.email : student.name}
                      </span>
                      {student.status === false && (
                        <span className="badge bg-secondary ms-2 small">
                          (invited)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <a
                          className="dropdown-item"
                          href="#"
                          onClick={() => {
                            handleDelete(student.id);
                          }}
                        >
                          Remove student
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
