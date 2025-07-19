import React, { useEffect, useRef, useState } from "react";
import TextInput from "../../TextInput";
import axiosClient from "../../../../utils/axios-client";
import swal from "sweetalert";
import { useStateContext } from "../../../contexts/ContextProvider";

// Helper function to generate section code
const generateSectionCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export default function ClassroomModal({ onSubmit, closeRef, edittingUser }) {
  const { user } = useStateContext();
  
  // Initialize with a generated section code
  const [data, setData] = useState(() => ({
    id: "",
    class_name: "",
    subject: "",
    instructor_id: user.id,
    section_code: generateSectionCode(),
  }));
  
  const [errors, setErrors] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null);

    const responseErrors = await onSubmit(data);

    if (responseErrors) {
      setErrors(responseErrors);
    } else {
      // Reset form after successful submissionq
      setData({
        id: "",
        class_name: "",
        subject: "",
        instructor_id: user.id,
      });
    }
  };

  //Is Editing or has ID
  useEffect(() => {
    if (edittingUser) {
      setData({
        id: edittingUser.id || "",
        class_name: edittingUser.class_name || "",
        subject: edittingUser.subject || "",
        instructor_id: user.id,
        section_code: edittingUser.section_code || generateSectionCode(),
      });
    } else {
      // Only reset if we're not editing - to prevents unnecessary re-renders
      setData(prevData => ({
        id: "",
        class_name: "",
        subject: "",
        instructor_id: user.id,
        section_code: prevData.section_code || generateSectionCode(),
      }));
    }
  }, [edittingUser, user.id]);

  //handling close in clearing the inputs
  const handleClose = () => {
    setData({
      id: "",
      class_name: "",
      subject: "",
      instructor_id: user.id,
      section_code: generateSectionCode(),
    });
  };

  return (
    <div>
      <div
        className="modal fade"
        id="add_modal"
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
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h4 className="modal-title" style={styles.modalTitle}>
                  {data.id ? "Edit class" : "Create class"}
                </h4>
              </div>
              <button
                onClick={handleClose}
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="close"
                ref={closeRef}
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

            <div>
              <div className="modal-body" style={styles.modalBody}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Class name (required)</label>
                  <input
                    type="text"
                    name="class_name"
                    onChange={handleChange}
                    value={data.class_name}
                    className="form-control"
                    style={styles.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#137333";
                      e.target.style.boxShadow =
                        "0 0 0 2px rgba(19, 115, 51, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#dadce0";
                      e.target.style.boxShadow = "none";
                    }}
                    placeholder="Enter class name"
                  />
                  {errors?.class_name && (
                    <div style={styles.errorMessage}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ marginRight: "4px" }}
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      {errors.class_name[0]}
                    </div>
                  )}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    onChange={handleChange}
                    value={data.subject}
                    className="form-control"
                    style={styles.input}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#137333";
                      e.target.style.boxShadow =
                        "0 0 0 2px rgba(19, 115, 51, 0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#dadce0";
                      e.target.style.boxShadow = "none";
                    }}
                    placeholder="Enter subject"
                  />
                  {errors?.subject && (
                    <div style={styles.errorMessage}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ marginRight: "4px" }}
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                      {errors.subject[0]}
                    </div>
                  )}
                </div>

                <div style={styles.infoBox}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ marginRight: "8px" }}
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>
                    <strong>Section Code:</strong> {data.section_code}
                  </span>
                </div>
              </div>

              <div className="modal-footer" style={styles.modalFooter}>
                <button
                  type="submit"
                  className="btn"
                  onClick={handleSubmit}
                  style={styles.submitButton}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#0f5132")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#137333")
                  }
                >
                  {data.id ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
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
    margin: "1rem", // Add margin for mobile
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
  infoBox: {
    backgroundColor: "#e6f4ea",
    border: "1px solid #a8dab5",
    borderRadius: "4px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#0d652d",
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
  cancelButton: {
    background: "none",
    border: "none",
    color: "#137333",
    fontSize: "14px",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    minWidth: "60px",
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