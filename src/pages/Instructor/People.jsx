import React, { useState } from "react";
import { Users, UserPlus, MoreHorizontal, ArrowUpDown } from "lucide-react";
import NavigationTabs from "../../components/Instructor/Classroom/ClassroomView/NavigationTabs";
import { useParams } from "react-router-dom";

export default function People() {
  const [activeTab, setActiveTab] = useState("people");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const { id } = useParams();
  

  // Mock data matching the image
  const teachers = [
    {
      id: 1,
      name: "Ronald Besinga",
      avatar: "R",
      color: "#ff6b35", // Orange color
    },
  ];

  const students = [
    {
      id: 1,
      name: "Jeffrey Amora",
      avatar: "J",
      color: "#8b5cf6", // Purple color
    },
    {
      id: 2,
      name: "Noah Bacus",
      avatar: "N",
      color: "#9ca3af", // Gray color
      status: "invited",
    },
  ];

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

  return (
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
                <span className="text-muted me-3 small">33 students</span>
                <button className="btn btn-sm btn-outline-secondary rounded-circle p-2">
                  <UserPlus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Student Controls */}
          <div className="px-4 py-3 bg-light border-bottom">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="form-check me-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="selectAll"
                    checked={selectedStudents.length === students.length}
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
          </div>

          {/* Students List */}
          <div className="card-body p-0">
            {students.map((student) => (
              <div
                key={student.id}
                className="d-flex align-items-center justify-content-between px-4 py-3 border-bottom"
              >
                <div className="d-flex align-items-center">
                  <div className="form-check me-3">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`student-${student.id}`}
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentSelect(student.id)}
                    />
                  </div>
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3`}
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: student.color,
                    }}
                  >
                    {student.avatar}
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-dark fw-medium">{student.name}</span>
                    {student.status === "invited" && (
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
                      <a className="dropdown-item" href="#">
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
  );
}
