import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function TaskModal({ onSubmit, editingTask, tasks, onClose }) {
  const { id } = useParams();

  const [data, setData] = useState({
    id: "",
    task_id: "",
    amount: 1,
    reward: 0,
    is_active: true,
  });

  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (editingTask) {
      setData({
        id: editingTask.id || "",
        task_id: editingTask.task_id || "",
        amount: editingTask.amount || 1,
        reward: editingTask.reward || 0,
        is_active: editingTask.is_active ?? true,
      });
    } else {
      setData({
        id: "",
        task_id: "",
        amount: 1,
        reward: 0,
        is_active: true,
      });
    }
    setErrors(null);
  }, [editingTask]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    const responseErrors = await onSubmit(data);

    if (responseErrors) {
      setErrors(responseErrors);
    } else {
      // Close modal on success
      document.querySelector('[data-bs-dismiss="modal"]')?.click();
      setData({
        id: "",
        task_id: "",
        amount: 1,
        reward: 0,
        is_active: true,
      });
    }
  };

  const handleClose = () => {
    setData({
      id: "",
      task_id: "",
      amount: 1,
      reward: 0,
      is_active: true,
    });
    setErrors(null);
    if (onClose) onClose();
  };

  return (
    <div
      className="modal fade"
      id="task_modal"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content" style={styles.modalContent}>
          <div className="modal-header" style={styles.modalHeader}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={styles.headerIcon}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h4 className="modal-title" style={styles.modalTitle}>
                {editingTask ? "Edit Task" : "Add Task"}
              </h4>
            </div>
            <button
              onClick={handleClose}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="close"
              style={styles.closeButton}
              onMouseEnter={(e) =>
                (e.target.style.backgroundColor = "rgba(255, 255, 255, 0.1)")
              }
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body" style={styles.modalBody}>
              {/* Task Selection */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Task</label>
                <select
                  name="task_id"
                  value={data.task_id}
                  onChange={handleChange}
                  className="form-select"
                  style={styles.input}
                  disabled={!!editingTask}
                >
                  <option value="">Select a task...</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.name}
                    </option>
                  ))}
                </select>
                {errors?.task_id && (
                  <div style={styles.errorMessage}>{errors.task_id[0]}</div>
                )}
              </div>

              {/* Amount */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Amount Required</label>
                <input
                  type="number"
                  name="amount"
                  value={data.amount}
                  onChange={handleChange}
                  className="form-control"
                  style={styles.input}
                  min="1"
                  placeholder="Enter amount"
                />
                <small style={{ color: "#5f6368", fontSize: "12px" }}>
                  How many times the student needs to complete this task
                </small>
                {errors?.amount && (
                  <div style={styles.errorMessage}>{errors.amount[0]}</div>
                )}
              </div>

              {/* Reward */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Reward Points</label>
                <input
                  type="number"
                  name="reward"
                  value={data.reward}
                  onChange={handleChange}
                  className="form-control"
                  style={styles.input}
                  min="0"
                  placeholder="Enter reward points"
                />
                <small style={{ color: "#5f6368", fontSize: "12px" }}>
                  Points awarded to student upon completion
                </small>
                {errors?.reward && (
                  <div style={styles.errorMessage}>{errors.reward[0]}</div>
                )}
              </div>

              {/* Is Active */}
              <div style={styles.inputGroup}>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="is_active"
                    id="is_active"
                    checked={data.is_active}
                    onChange={handleChange}
                    style={{ cursor: "pointer" }}
                  />
                  <label
                    className="form-check-label"
                    htmlFor="is_active"
                    style={{ cursor: "pointer", color: "#5f6368" }}
                  >
                    Active (visible to students)
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer" style={styles.modalFooter}>
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-dismiss="modal"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn"
                style={styles.submitButton}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#0f5132")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#137333")
                }
              >
                {editingTask ? "Update" : "Add Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalContent: {
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    overflow: "hidden",
    margin: "1rem",
    maxHeight: "90vh",
  },
  modalHeader: {
    backgroundColor: "#137333",
    color: "white",
    padding: "16px 20px",
    borderBottom: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  headerIcon: {
    width: "28px",
    height: "28px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
    flexShrink: 0,
  },
  modalTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "500",
    color: "white",
  },
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s",
    flexShrink: 0,
  },
  modalBody: {
    padding: "20px",
    backgroundColor: "#fafafa",
    maxHeight: "calc(90vh - 140px)",
    overflowY: "auto",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#5f6368",
  },
  input: {
    border: "1px solid #dadce0",
    borderRadius: "4px",
    padding: "12px 16px",
    fontSize: "16px",
    backgroundColor: "white",
    transition: "border-color 0.2s, box-shadow 0.2s",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  errorMessage: {
    color: "#d93025",
    fontSize: "12px",
    marginTop: "4px",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  modalFooter: {
    backgroundColor: "white",
    borderTop: "1px solid #e0e0e0",
    padding: "16px 20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    flexWrap: "wrap",
  },
  submitButton: {
    backgroundColor: "#137333",
    color: "white",
    border: "none",
    fontSize: "14px",
    fontWeight: "500",
    padding: "8px 24px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
    minWidth: "60px",
  },
};
