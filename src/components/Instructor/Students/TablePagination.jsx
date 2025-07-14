export default function TablePagination({ pagination, onPageChange }) {
  return (
    <div
      className="d-flex justify-content-between align-items-center px-4 py-3"
      style={{
        backgroundColor: "#f8f9fa",
        borderTop: "1px solid #dee2e6",
      }}
    >
      <small className="text-muted fw-medium text-sm">
        Page{" "}
        <span className="fw-bold">{pagination.current_page}</span>{" "}
        of <span className="fw-bold">{pagination.last_page}</span>
      </small>
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-outline-secondary px-3 py-2 text-sm"
          disabled={pagination.current_page === 1}
          onClick={() => onPageChange(pagination.current_page - 1)}
          style={{
            borderColor: "#6c757d",
            color: "#6c757d",
          }}
        >
          Previous
        </button>
        <button
          className="btn btn-sm btn-outline-secondary px-3 py-2 text-sm"
          disabled={pagination.current_page === pagination.last_page}
          onClick={() => onPageChange(pagination.current_page + 1)}
          style={{
            borderColor: "#6c757d",
            color: "#6c757d",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}