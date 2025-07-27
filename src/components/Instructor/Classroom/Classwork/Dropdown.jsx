import { useState, react } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";

export default function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleMaterials = () => {
    navigate(`/instructor/classwork/${id}/materials`)
    
  };

  return (
    <>
      <style>{dropdownStyles}</style>
      <div className="dropdown">
        <button
          className="btn btn-success rounded-pill px-4 py-2 fw-medium shadow-sm create-btn dropdown-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <i className="fas fa-plus me-2"></i>
          Create
        </button>

        {isOpen && (
          <div className="dropdown-menu show position-absolute end-0 mt-1">
            <button
              className="dropdown-item py-2 px-3"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-file-alt me-2 text-success"></i>
              Add Assignment
            </button>
            <button
              className="dropdown-item py-2 px-3"
              onClick={() => setIsOpen(false)}
            >
              <i className="fas fa-question-circle me-2 text-success"></i>
              Add Quiz
            </button>
            <button
              className="dropdown-item py-2 px-3"
              onClick={handleMaterials}
            >
              <i className="fas fa-folder me-2 text-success"></i>
              Add Materials
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const dropdownStyles = `
    .create-btn { background-color: #198754 !important; border: none !important; transition: all 0.3s ease; }
    .create-btn:hover { background-color: #157347 !important; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(25, 135, 84, 0.4) !important; }
    .dropdown-menu { box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: none; }
    .dropdown-item:hover { background-color: #f8f9fa; color: #198754; }
  `;
