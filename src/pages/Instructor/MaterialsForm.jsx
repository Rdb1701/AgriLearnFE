import React, { useRef, useState } from "react";
import {
  FaArrowLeft,
  FaFileAlt,
  FaPaperPlane,
  FaTimes,
  FaUpload,
} from "react-icons/fa";

export default function MatrialsForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignTo, setAssignTo] = useState("All students");
  const [topic, setTopic] = useState("No topic");
  const inputRef = useRef();

  return (
    <>
      <style>{formStyles}</style>
      <div className="form-container">
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col-12 col-lg-8">
              <div className="main-card">
                <div className="header-section d-flex align-items-center">
                  <button
                    className="btn p-2 me-2"
                    onClick={() => window.history.back()}
                  >
                    <FaArrowLeft />
                  </button>
                  <div className="me-2">
                    <FaFileAlt />
                  </div>
                  <h6 className="mb-0 text-muted">Material</h6>
                  <div className="ms-auto d-flex align-items-center">
                    <button
                      className="cancel-btn"
                      onClick={() => window.history.back()}
                    >
                      Cancel
                    </button>
                    <button className="btn btn-success btn-md">
                      <FaPaperPlane /> Post
                    </button>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-4">
                  <div className="mb-4">
                    <input
                      type="text"
                      className="form-control title-input w-100"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label text-muted">
                      Description (optional)
                    </label>
                    <textarea
                      className="form-control"
                      value={description}
                      ref={inputRef}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="attach-section">
                    <h6 className="mb-3 text-dark">Attach</h6>
                    <div className="row g-3">
                      <div className="col-6 col-md-2">
                        <button className="attach-btn w-100">
                          <div className="attach-icon d-flex align-items-center justify-content-center">
                            <FaUpload />
                          </div>
                          <small>Upload</small>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-12 col-lg-4 mt-4 mt-lg-0">
              <div className="sidebar">
                <div className="sidebar-section">
                  <label className="form-label fw-semibold mb-2">For</label>
                  <select className="dropdown-custom w-100">
                    <option>BSAIS 3 BSAIS 3</option>
                  </select>
                </div>
                <div className="sidebar-section">
                  <label className="form-label fw-semibold mb-2">
                    Assign to
                  </label>
                  <button className="dropdown-custom w-100 text-start d-flex align-items-center justify-content-between">
                    <span>
                      <i className="fas fa-users text-primary me-2"></i>
                      All students
                    </span>
                    <i className="fas fa-chevron-down text-muted"></i>
                  </button>
                </div>
                <div className="sidebar-section">
                  <label className="form-label fw-semibold mb-2">Topic</label>
                  <select className="dropdown-custom w-100">
                    <option>No topic</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const formStyles = `
    .form-container { background: #f8f9fa; min-height: 100vh; }
    .main-card { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header-section { background: white; border-bottom: 1px solid #e9ecef; padding: 1rem 1.5rem; border-radius: 8px 8px 0 0; }
    .title-input { border: none; border-bottom: 2px solid #e9ecef; background: transparent; font-size: 1.1rem; padding: 0.5rem 0; }
    .title-input:focus { outline: none; border-bottom-color: #4285f4; }
    .title-input.error { border-bottom-color: #dc3545; }
    .description-area { min-height: 120px; border: none; resize: none; }
    .description-area:focus { outline: none; box-shadow: none; }
    .toolbar-btn { border: none; background: none; color: #5f6368; padding: 0.5rem; margin-right: 0.25rem; border-radius: 4px; }
    .toolbar-btn:hover { background: #f1f3f4; }
    .attach-section { background: #f8f9fa; border-radius: 8px; padding: 1.5rem; margin: 1.5rem 0; }
    .attach-btn { background: white; border: 1px solid #dadce0; border-radius: 4px; padding: 1rem; text-align: center; color: #5f6368; transition: all 0.2s; }
    .attach-btn:hover { box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .attach-icon { width: 48px; height: 48px; margin: 0 auto 0.5rem; }
    .sidebar { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .sidebar-section { padding: 1rem 1.5rem; border-bottom: 1px solid #e9ecef; }
    .sidebar-section:last-child { border-bottom: none; }
    .post-btn:hover { background: #1557b0; }
    .cancel-btn { background: none; border: none; color: #5f6368; padding: 0.5rem 1rem; margin-right: 0.5rem; }
    .cancel-btn:hover { background: #f1f3f4; border-radius: 4px; }
    .dropdown-custom { border: 1px solid #dadce0; border-radius: 4px; padding: 0.5rem 1rem; background: white; }
    .dropdown-custom:focus { outline: none; border-color: #4285f4; }
  `;
