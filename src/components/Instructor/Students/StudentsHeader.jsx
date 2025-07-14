import { FaUsers, FaPlus } from "react-icons/fa";

export default function StudentsHeader({onEditRef}) {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "#e8f5e8",
                color: "#2d5a2d",
              }}
            >
              <FaUsers size={20} />
            </div>
            <div>
              <h4
                className="mb-1 fw-bold text-sm"
                style={{ color: "#2d5a2d" }}
              >
                Students
              </h4>
              <p className="mb-0 text-muted small">
                Manage student accounts and information
              </p>
            </div>
          </div>
          <button
            className="btn btn-success d-flex align-items-center gap-2 px-4 py-2"
            style={{ backgroundColor: "#4CAF50", borderColor: "#4CAF50" }}
            data-bs-toggle="modal"
            data-bs-target="#add_modal"
            ref={onEditRef}
          >
            <FaPlus size={14} />
            Add Student
          </button>
        </div>
      </div>
    </div>
  );
}