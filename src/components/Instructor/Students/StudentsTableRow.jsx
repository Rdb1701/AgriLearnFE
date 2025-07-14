import { FaEdit, FaTrash } from "react-icons/fa";

export default function StudentsTableRow({ user, onEdit, onDelete }) {
  return (
    <tr
      className="border-bottom"
      style={{
        borderBottomColor: "#f1f5f9 !important",
        transition: "background-color 0.2s ease",
      }}
    >
      <td
        className="py-1 px-4 fw-medium text-sm"
        style={{ color: "#1f2937" }}
      >
        {user.id_number}
      </td>
      <td className="py-1 px-4">
        <div className="d-flex align-items-center gap-3">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle fw-medium"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#e8f5e8",
              color: "#2d5a2d",
              fontSize: "14px",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span
            className="fw-medium text-sm"
            style={{ color: "#1f2937" }}
          >
            {user.name}
          </span>
        </div>
      </td>
      <td className="py-1 px-4 text-muted text-sm">
        {user.email}
      </td>
      <td className="py-1 px-4">
        <span
          className="badge px-3 py-2 text-sm"
          style={{
            backgroundColor: "#e3f2fd",
            color: "#1565c0",
            fontSize: "12px",
            fontWeight: "500",
          }}
        >
          {user.role}
        </span>
      </td>
      <td className="py-1 px-4">
        {user.isActive === false ? (
          <span
            className="badge px-3 py-2 text-sm"
            style={{
              backgroundColor: "#fff3cd",
              color: "#856404",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            Inactive
          </span>
        ) : (
          <span
            className="badge px-3 py-2 text-sm"
            style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            Active
          </span>
        )}
      </td>
      <td className="py-1 px-4">
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#e8f5e8",
              border: "1px solid #c8e6c9",
              color: "#2d5a2d",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#c8e6c9";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#e8f5e8";
            }}
            onClick={() => onEdit(user)}
          >
            <FaEdit size={12} />
          </button>
          <button
            className="btn btn-sm d-flex align-items-center justify-content-center"
            style={{
              width: "36px",
              height: "36px",
              backgroundColor: "#ffebee",
              border: "1px solid #ffcdd2",
              color: "#c62828",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#ffcdd2";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#ffebee";
            }}
            onClick={() => onDelete(user)}
          >
            <FaTrash size={12} />
          </button>
        </div>
      </td>
    </tr>
  );
}