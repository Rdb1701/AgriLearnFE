import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../utils/axios-client";

export default function MaterialView({ classroomInfo }) {
  const { material_id, id } = useParams();
  const [instructional_materials, setInstructionalMaterials] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(`/materials/${material_id}`);
        setInstructionalMaterials(response.data.data);
      } catch (error) {
        console.error("Fetch materials error:", error);
      }
    };
    fetchData();
  }, [material_id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu') && !event.target.closest('.dropdown-toggle')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const BASE_URL =
    (import.meta.env && import.meta.env.VITE_IMAGE_API_BASE_URL) ||
    "http://127.0.0.1:8000/storage/";

  if (!import.meta.env?.VITE_IMAGE_API_BASE_URL) {
    console.warn(
      "VITE_IMAGE_API_BASE_URL is not set. Using fallback:",
      BASE_URL
    );
  }

  // Build a safe absolute file URL from the returned filePath
  const buildFileUrl = (filePath) => {
    if (!filePath) return null;

    // If already an absolute URL, return as-is
    if (/^https?:\/\//i.test(filePath)) return filePath;

    // Normalize: remove any leading "storage/" or leading slashes
    const normalized = String(filePath)
      .replace(/^storage\//i, "")
      .replace(/^\/+/, "");

    // Remove trailing slashes from base
    const base = BASE_URL.replace(/\/+$/, "");
    const url = `${base}/${normalized}`;

    try {
      // encodeURI to keep spaces/special chars safe
      return encodeURI(url);
    } catch (e) {
      return url;
    }
  };

  const getFileExtension = (filePath, fileType) => {
    const firstFilePath = Array.isArray(filePath) ? filePath[0] : filePath;
    const firstFileType = Array.isArray(fileType) ? fileType[0] : fileType;
    if (firstFilePath) {
      return firstFilePath.split(".").pop().toLowerCase();
    }
    return firstFileType?.toLowerCase() || "file";
  };

  const getReadableFileType = (fileType) => {
    const firstFileType = Array.isArray(fileType) ? fileType[0] : fileType;
    const typeMap = {
      pptx: "Microsoft PowerPoint",
      ppt: "Microsoft PowerPoint",
      docx: "Microsoft Word",
      doc: "Microsoft Word",
      xlsx: "Microsoft Excel",
      xls: "Microsoft Excel",
      pdf: "PDF Document",
      txt: "Text Document",
      jpg: "JPEG Image",
      jpeg: "JPEG Image",
      png: "PNG Image",
      gif: "GIF Image",
      mp4: "MP4 Video",
      mp3: "MP3 Audio",
      zip: "ZIP Archive",
      rar: "RAR Archive",
    };
    return (
      typeMap[firstFileType?.toLowerCase()] ||
      `${firstFileType?.toUpperCase()} File`
    );
  };

  const getFileBadge = (title, extension) => {
    const titleUpper = title?.toUpperCase() || "";
    if (titleUpper.includes("SQL")) {
      return { text: "SQL", color: "bg-danger" };
    } else if (extension === "pptx" || extension === "ppt") {
      return { text: "PPT", color: "bg-warning text-dark" };
    } else if (extension === "docx" || extension === "doc") {
      return { text: "DOC", color: "bg-primary" };
    } else if (extension === "xlsx" || extension === "xls") {
      return { text: "XLS", color: "bg-success" };
    } else if (extension === "pdf") {
      return { text: "PDF", color: "bg-danger" };
    }
    return { text: extension?.toUpperCase() || "FILE", color: "bg-secondary" };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
    });
  };

  const handleEdit = () => {
    setShowDropdown(false);
    
    navigate(`/instructor/classwork/${id}/materialsEdit/${material_id}`)
    
  };

  const handleDelete = async () => {
    setShowDropdown(false);
    
    if (window.confirm("Are you sure you want to delete this material? This action cannot be undone.")) {
      try {
        await axiosClient.delete(`/materials/${material_id}`);
       // console.log("Material deleted successfully");
          swal("Success", `Material deleted successfully`, "success");
        // Navigate back or show success message
        window.history.back();
      } catch (error) {
        console.error("Delete error:", error);
        alert("Failed to delete material. Please try again.");
      }
    }
  };

  const materialsList = instructional_materials
    ? [instructional_materials]
    : [];

  const headerMaterial = materialsList[0];

  if (!instructional_materials) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-success mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mb-0">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container p-0">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <div className="d-flex align-items-center">
          <button className="btn p-2 me-2" onClick={() => window.history.back()}>
            <FaArrowLeft style={{ fontSize: "20px" }} />
          </button>

          <div>
            <h5 className="mb-1">
              {headerMaterial?.title || "Instructional Materials"}
            </h5>
            <small className="text-muted">
              {headerMaterial?.uploader_name || "Unknown"} •{" "}
              {headerMaterial?.created_at ? formatDate(headerMaterial.created_at) : ""}
            </small>
          </div>
        </div>
        
        {/* Dropdown Menu */}
        <div className="position-relative">
          <button 
            className="btn btn-light border-0 dropdown-toggle"
            onClick={() => setShowDropdown(!showDropdown)}
            aria-expanded={showDropdown}
          >
            <BsThreeDotsVertical />
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu show position-absolute end-0 mt-1" style={{ zIndex: 1000 }}>
              <button 
                className="dropdown-item d-flex align-items-center"
                onClick={handleEdit}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Edit Material
              </button>
              <button 
                className="dropdown-item d-flex align-items-center text-danger"
                onClick={handleDelete}
              >
                <i className="bi bi-trash3 me-2"></i>
                Delete Material
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {headerMaterial?.description && (
        <div className="p-3 border-bottom">
          <p className="mb-0 text-muted">{headerMaterial.description}</p>
        </div>
      )}

      {/* Materials */}
      <div className="p-3">
        <div className="row g-3">
          {materialsList.map((material) => {
            let filePaths = [];
            let fileTypes = [];

            try {
              filePaths = material.file_path ? JSON.parse(material.file_path) : [];
              fileTypes = material.file_type ? JSON.parse(material.file_type) : [];
            } catch (error) {
              // fallback if already arrays or single strings
              filePaths = Array.isArray(material.file_path)
                ? material.file_path
                : [material.file_path];
              fileTypes = Array.isArray(material.file_type)
                ? material.file_type
                : [material.file_type];
            }

            return filePaths.map((filePath, index) => {
              const fileType = fileTypes[index] || fileTypes[0];
              const extension = getFileExtension(filePath, fileType);
              const badge = getFileBadge(material.title, extension);
              const readableType = getReadableFileType(fileType);

              const fileName = filePath
                ? filePath.split("/").pop().split("\\").pop()
                : `${material.title}.${extension}`;

              const fileUrl = buildFileUrl(filePath);

              // For debugging (remove if noisy)
              // console.log({ filePath, fileUrl });

              return (
                <div key={`${material.id}-${index}`} className="col-md-6">
                  {fileUrl ? (
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card h-100 text-decoration-none text-reset"
                    >
                      <div className="card-body d-flex align-items-center py-3">
                        <div className="me-3">
                          <div
                            className={`text-white px-2 py-1 rounded ${badge.color}`}
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          >
                            {badge.text}
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="card-title mb-1" title={fileName}>
                            {fileName.length > 30 ? `${fileName.substring(0, 30)}...` : fileName}
                          </h6>
                          <small className="text-muted">{readableType}</small>
                          {material.isOffline && (
                            <div className="mt-1">
                              <span className="badge bg-secondary">Offline</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </a>
                  ) : (
                    <div className="card h-100">
                      <div className="card-body d-flex align-items-center py-3">
                        <div className="me-3">
                          <div
                            className={`text-white px-2 py-1 rounded ${badge.color}`}
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          >
                            {badge.text}
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="card-title mb-1">{fileName}</h6>
                          <small className="text-muted">{readableType}</small>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}