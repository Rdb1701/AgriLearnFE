import { FaSpinner, FaUsers } from "react-icons/fa";
import StudentsTableRow from "./StudentsTableRow";
import TablePagination from "./TablePagination";


export default function StudentsTable({ 
  data, 
  isLoading, 
  pagination, 
  onEdit, 
  onDelete, 
  onPageChange 
}) {
  return (
    <div className="row">
      <div className="col-12">
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom py-3">
            <h5
              className="card-title mb-0 fw-semibold text-sm"
              style={{ color: "#2d5a2d" }}
            >
              Student Directory
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ backgroundColor: "#f8f9fa" }}>
                  <tr>
                    <th
                      className="border-0 py-3 px-4 fw-semibold text-sm"
                      style={{ color: "#2d5a2d" }}
                    >
                      ID Number
                    </th>
                    <th
                      className="border-0 py-3 px-4 fw-semibold text-sm"
                      style={{ color: "#2d5a2d" }}
                    >
                      Name
                    </th>
                    <th
                      className="border-0 py-3 px-4 fw-semibold text-sm"
                      style={{ color: "#2d5a2d" }}
                    >
                      Email
                    </th>
                    <th
                      className="border-0 py-3 px-4 fw-semibold text-sm"
                      style={{ color: "#2d5a2d" }}
                    >
                      Role
                    </th>
                    <th
                      className="border-0 py-3 px-4 fw-semibold text-sm"
                      style={{ color: "#2d5a2d" }}
                    >
                      Status
                    </th>
                    <th
                      className="border-0 py-3 px-4 fw-semibold text-sm"
                      style={{ color: "#2d5a2d" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center gap-3">
                          <FaSpinner
                            className="fa-spin"
                            size={28}
                            style={{ color: "#4CAF50" }}
                          />
                          <span className="text-muted fw-medium text-sm">
                            Loading students...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : data.length > 0 ? (
                    data.map((user) => (
                      <StudentsTableRow
                        key={user.id}
                        user={user}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-5">
                        <div className="d-flex flex-column align-items-center gap-3">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                              width: "64px",
                              height: "64px",
                              backgroundColor: "#f5f5f5",
                              color: "#9e9e9e",
                            }}
                          >
                            <FaUsers size={28} />
                          </div>
                          <div>
                            <p className="mb-1 fw-medium text-muted">
                              No students found
                            </p>
                            <p className="mb-0 small text-muted">
                              Get started by adding your first student
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {!isLoading && data.length > 0 && (
              <TablePagination
                pagination={pagination}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}