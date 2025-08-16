import React, { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaFileAlt,
  FaPaperPlane,
  FaTimes,
  FaUpload,
  FaFile,
  FaImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaTrash,
  FaDownload,
} from "react-icons/fa";
import axiosClient from "../../../utils/axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../contexts/ContextProvider";
import swal from "sweetalert";

export default function MaterialsEditForm() {
  const { user } = useStateContext();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]); // New files to upload
  const [existingFiles, setExistingFiles] = useState([]); // Existing files from server
  const [filesToDelete, setFilesToDelete] = useState([]); // Files marked for deletion
  const [section, setSection] = useState();
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef();
  const { id, material_id } = useParams(); // classroom id and material id
  const uploadRef = useRef();
  const navigate = useNavigate();

  const BASE_URL =
    (import.meta.env && import.meta.env.VITE_IMAGE_API_BASE_URL) ||
    "http://127.0.0.1:8000/storage/";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch classroom info
        const classroomResponse = await axiosClient.get(`/classroom/${id}`);
        setSection(classroomResponse.data.data.class_name);

        // Fetch material data
        const materialResponse = await axiosClient.get(`/materials/${material_id}`);
        const materialData = materialResponse.data.data;
        
        setTitle(materialData.title || "");
        setDescription(materialData.description || "");
        
        // Parse existing files
        let filePaths = [];
        let fileTypes = [];
        
        try {
          filePaths = materialData.file_path ? JSON.parse(materialData.file_path) : [];
          fileTypes = materialData.file_type ? JSON.parse(materialData.file_type) : [];
        } catch (error) {
          filePaths = Array.isArray(materialData.file_path) 
            ? materialData.file_path 
            : [materialData.file_path];
          fileTypes = Array.isArray(materialData.file_type) 
            ? materialData.file_type 
            : [materialData.file_type];
        }

        // Create existing files structure
        const existingFilesData = filePaths.map((filePath, index) => ({
          id: `existing_${index}`,
          name: filePath ? filePath.split("/").pop().split("\\").pop() : `file_${index}`,
          path: filePath,
          type: fileTypes[index] || fileTypes[0] || '',
          url: buildFileUrl(filePath)
        }));

        setExistingFiles(existingFilesData);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
        setLoading(false);
        swal("Error", "Failed to load material data", "error");
      }
    };

    fetchData();
  }, [id, material_id]);

  const buildFileUrl = (filePath) => {
    if (!filePath) return null;
    if (/^https?:\/\//i.test(filePath)) return filePath;
    
    const normalized = String(filePath)
      .replace(/^storage\//i, "")
      .replace(/^\/+/, "");
    
    const base = BASE_URL.replace(/\/+$/, "");
    const url = `${base}/${normalized}`;
    
    try {
      return encodeURI(url);
    } catch (e) {
      return url;
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FaFilePdf className="file-icon pdf" />;
      case "doc":
      case "docx":
        return <FaFileWord className="file-icon doc" />;
      case "xls":
      case "xlsx":
        return <FaFileExcel className="file-icon excel" />;
      case "ppt":
      case "pptx":
        return <FaFilePowerpoint className="file-icon ppt" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FaImage className="file-icon image" />;
      default:
        return <FaFile className="file-icon default" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleClickUpload = () => {
    uploadRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const removeNewFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const markExistingFileForDeletion = (fileId) => {
    const fileToDelete = existingFiles.find(file => file.id === fileId);
    if (fileToDelete) {
      setFilesToDelete(prev => [...prev, fileToDelete]);
      setExistingFiles(prev => prev.filter(file => file.id !== fileId));
    }
  };

  const restoreFileFromDeletion = (fileId) => {
    const fileToRestore = filesToDelete.find(file => file.id === fileId);
    if (fileToRestore) {
      setFilesToDelete(prev => prev.filter(file => file.id !== fileId));
      setExistingFiles(prev => [...prev, fileToRestore]);
    }
  };

  const downloadFile = (fileUrl, fileName) => {
    if (fileUrl) {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("classroom_id", id);
    formData.append("uploaded_by", user.id);
    formData.append("_method", "PUT"); // method spoofing

    // Add new files
    files.forEach((file) => {
      formData.append("new_files[]", file);
    });

    // Add files marked for deletion
    filesToDelete.forEach((file) => {
      formData.append("delete_files[]", file.path);
    });

    try {
      const response = await axiosClient.post(`/materials/${material_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      swal("Success", `${response.data.message}`, "success");
      navigate(`/instructor/classrooms/${id}`);
    } catch (error) {
      console.error("Update error:", error);

      if (error.response) {
        setErrors(error.response.data.errors);
        console.log(error.response.data.errors);
      } else {
        swal("Error", "Failed to update material", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Loading material...</p>
      </div>
    );
  }

  const totalFiles = existingFiles.length + files.length;

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
                  <h6 className="mb-0 text-muted">Edit Material</h6>
                  <div className="ms-auto d-flex align-items-center">
                    <button
                      className="cancel-btn"
                      onClick={() => window.history.back()}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-success btn-md"
                      onClick={handleSubmit}
                    >
                      <FaPaperPlane /> Update
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <input
                      type="text"
                      className="form-control title-input w-100"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    {errors?.title && (
                      <span className="text-danger">{errors.title[0]}</span>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label text-muted">
                      Description (optional)
                    </label>
                    <textarea
                      className="form-control description-area"
                      value={description}
                      ref={inputRef}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Add description..."
                    ></textarea>
                  </div>

                  {/* File Upload Section */}
                  <div className="file-upload-section">
                    <div
                      className={`upload-zone ${isDragging ? "dragging" : ""} ${
                        totalFiles > 0 ? "has-files" : ""
                      }`}
                      onDragEnter={handleDragEnter}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        ref={uploadRef}
                        onChange={(e) => handleFileChange(e)}
                        hidden
                        multiple
                      />

                      {totalFiles === 0 ? (
                        <div
                          className="upload-prompt"
                          onClick={handleClickUpload}
                        >
                          <div className="upload-icon-container">
                            <FaUpload className="upload-icon" />
                          </div>
                          <p className="upload-text">
                            Drag and drop files here or{" "}
                            <span className="upload-link">choose files</span>
                          </p>
                          <p className="upload-subtext">
                            You can upload multiple files at once
                          </p>
                        </div>
                      ) : (
                        <div className="files-container">
                          <div className="files-header">
                            <span className="files-count">
                              {totalFiles} file{totalFiles > 1 ? "s" : ""}{" "}
                              {existingFiles.length > 0 && files.length > 0 && 
                                `(${existingFiles.length} existing, ${files.length} new)`
                              }
                            </span>
                            <button
                              className="add-more-btn"
                              onClick={handleClickUpload}
                            >
                              <FaUpload className="me-1" /> Add more
                            </button>
                          </div>

                          <div className="files-list">
                            {/* Existing Files */}
                            {existingFiles.map((file) => (
                              <div key={file.id} className="file-item existing-file">
                                <div className="file-info">
                                  {getFileIcon(file.name)}
                                  <div className="file-details">
                                    <div className="file-name">
                                      {file.name}
                                      <span className="file-badge existing">Existing</span>
                                    </div>
                                    <div className="file-size">Current file</div>
                                  </div>
                                </div>
                                <div className="file-actions">
                                  <button
                                    className="action-btn download-btn"
                                    onClick={() => downloadFile(file.url, file.name)}
                                    title="Download file"
                                  >
                                    <FaDownload />
                                  </button>
                                  <button
                                    className="action-btn remove-file-btn"
                                    onClick={() => markExistingFileForDeletion(file.id)}
                                    title="Remove file"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {/* New Files */}
                            {files.map((file, index) => (
                              <div key={`new_${index}`} className="file-item new-file">
                                <div className="file-info">
                                  {getFileIcon(file.name)}
                                  <div className="file-details">
                                    <div className="file-name">
                                      {file.name}
                                      <span className="file-badge new">New</span>
                                    </div>
                                    <div className="file-size">
                                      {formatFileSize(file.size)}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  className="remove-file-btn"
                                  onClick={() => removeNewFile(index)}
                                  title="Remove file"
                                >
                                  <FaTimes />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Files marked for deletion */}
                          {filesToDelete.length > 0 && (
                            <div className="deleted-files-section">
                              <div className="deleted-files-header">
                                <span className="text-danger">
                                  Files to be deleted ({filesToDelete.length})
                                </span>
                              </div>
                              <div className="deleted-files-list">
                                {filesToDelete.map((file) => (
                                  <div key={file.id} className="file-item deleted-file">
                                    <div className="file-info">
                                      {getFileIcon(file.name)}
                                      <div className="file-details">
                                        <div className="file-name strikethrough">
                                          {file.name}
                                        </div>
                                        <div className="file-size text-danger">Will be deleted</div>
                                      </div>
                                    </div>
                                    <button
                                      className="restore-btn"
                                      onClick={() => restoreFileFromDeletion(file.id)}
                                      title="Restore file"
                                    >
                                      Undo
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors?.new_files && (
                      <span className="text-danger">{errors.new_files[0]}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4 mt-4 mt-lg-0">
              <div className="sidebar">
                <div className="sidebar-section">
                  <label className="form-label fw-semibold mb-2">For</label>
                  <button className="dropdown-custom w-100 text-start d-flex align-items-center justify-content-between">
                    <span>
                      <i className="fas fa-users text-primary me-2"></i>
                      {section}
                    </span>
                    <i className="fas fa-chevron-down text-muted"></i>
                  </button>
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
    .description-area { min-height: 100px; border: 1px solid #e9ecef; border-radius: 4px; padding: 12px; resize: vertical; }
    .description-area:focus { outline: none; box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2); border-color: #4285f4; }
    
    /* File Upload Styles */
    .file-upload-section { margin: 1.5rem 0; }
    .upload-zone { 
        border: 2px dashed #dadce0; 
        border-radius: 8px; 
        background: #fafbfc; 
        transition: all 0.3s ease;
        cursor: pointer;
    }
    .upload-zone.dragging { 
        border-color: #4285f4; 
        background: #f1f7ff; 
        border-style: solid;
    }
    .upload-zone.has-files {
        border-style: solid;
        border-color: #e1e4e8;
        background: white;
        cursor: default;
    }
    
    .upload-prompt { 
        padding: 40px 20px; 
        text-align: center; 
    }
    .upload-icon-container {
        width: 64px;
        height: 64px;
        background: #137333;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
    }
    .upload-icon { 
        color: white; 
        font-size: 24px; 
    }
    .upload-text { 
        font-size: 16px; 
        color: #5f6368; 
        margin-bottom: 8px; 
    }
    .upload-link { 
        color: #137333; 
        text-decoration: underline; 
        cursor: pointer; 
    }
    .upload-subtext { 
        font-size: 14px; 
        color: #80868b; 
        margin: 0; 
    }
    
    .files-container { 
        padding: 20px; 
    }
    .files-header { 
        display: flex; 
        justify-content: space-between; 
        align-items: center; 
        margin-bottom: 16px; 
        padding-bottom: 12px;
        border-bottom: 1px solid #e8eaed;
    }
    .files-count { 
        font-weight: 500; 
        color: #3c4043; 
    }
    .add-more-btn { 
        background: none; 
        border: 1px solid #4285f4; 
        color: #4285f4; 
        padding: 8px 16px; 
        border-radius: 4px; 
        font-size: 14px;
        display: flex;
        align-items: center;
        transition: all 0.2s;
    }
    .add-more-btn:hover { 
        background: #f1f7ff; 
    }
    
    .files-list { 
        display: flex; 
        flex-direction: column; 
        gap: 8px; 
    }
    .file-item { 
        display: flex; 
        align-items: center; 
        justify-content: space-between; 
        padding: 12px 16px; 
        background: #f8f9fa; 
        border-radius: 8px; 
        border: 1px solid #e8eaed;
        transition: all 0.2s;
    }
    .file-item:hover { 
        background: #f1f3f4; 
        border-color: #dadce0;
    }
    .file-item.existing-file {
        border-left: 4px solid #4285f4;
    }
    .file-item.new-file {
        border-left: 4px solid #137333;
    }
    .file-item.deleted-file {
        background: #fce8e6;
        border-left: 4px solid #d93025;
        opacity: 0.7;
    }
    
    .file-info { 
        display: flex; 
        align-items: center; 
        flex: 1; 
    }
    .file-icon { 
        font-size: 24px; 
        margin-right: 12px; 
    }
    .file-icon.pdf { color: #d93025; }
    .file-icon.doc { color: #4285f4; }
    .file-icon.excel { color: #137333; }
    .file-icon.ppt { color: #d93025; }
    .file-icon.image { color: #fbbc04; }
    .file-icon.default { color: #5f6368; }
    
    .file-details { 
        flex: 1; 
    }
    .file-name { 
        font-weight: 500; 
        color: #3c4043; 
        font-size: 14px; 
        word-break: break-all;
        line-height: 1.4;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .file-name.strikethrough {
        text-decoration: line-through;
    }
    .file-size { 
        color: #5f6368; 
        font-size: 12px; 
        margin-top: 2px;
    }
    .file-badge {
        font-size: 10px;
        padding: 2px 6px;
        border-radius: 10px;
        font-weight: 600;
        text-transform: uppercase;
    }
    .file-badge.existing {
        background: #e8f0fe;
        color: #1967d2;
    }
    .file-badge.new {
        background: #e6f4ea;
        color: #137333;
    }
    
    .file-actions {
        display: flex;
        gap: 8px;
    }
    .action-btn {
        background: none;
        border: none;
        color: #5f6368;
        padding: 8px;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }
    .action-btn:hover {
        background: #f1f3f4;
    }
    .download-btn:hover {
        color: #4285f4;
    }
    .remove-file-btn { 
        background: none; 
        border: none; 
        color: #5f6368; 
        padding: 8px; 
        border-radius: 50%; 
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }
    .remove-file-btn:hover { 
        background: #f1f3f4; 
        color: #d93025; 
    }
    
    .deleted-files-section {
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid #e8eaed;
    }
    .deleted-files-header {
        margin-bottom: 12px;
        font-size: 14px;
        font-weight: 500;
    }
    .deleted-files-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .restore-btn {
        background: none;
        border: 1px solid #4285f4;
        color: #4285f4;
        padding: 4px 12px;
        border-radius: 4px;
        font-size: 12px;
        transition: all 0.2s;
    }
    .restore-btn:hover {
        background: #f1f7ff;
    }
    
    /* Existing styles */
    .sidebar { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .sidebar-section { padding: 1rem 1.5rem; border-bottom: 1px solid #e9ecef; }
    .sidebar-section:last-child { border-bottom: none; }
    .post-btn:hover { background: #1557b0; }
    .cancel-btn { background: none; border: none; color: #5f6368; padding: 0.5rem 1rem; margin-right: 0.5rem; }
    .cancel-btn:hover { background: #f1f3f4; border-radius: 4px; }
    .dropdown-custom { border: 1px solid #dadce0; border-radius: 4px; padding: 0.5rem 1rem; background: white; }
    .dropdown-custom:focus { outline: none; border-color: #4285f4; }
`;