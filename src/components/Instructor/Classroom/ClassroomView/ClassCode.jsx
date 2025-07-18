import React, { useState } from "react";

export default function ClassCode({class_code}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("hesqqoin");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card mb-3 border-0 shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <h6 className="mb-0">Class code</h6>
          <div className="dropdown ms-auto">
            <button
              className="btn btn-sm btn-light"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i className="fas fa-ellipsis-v"></i>
            </button>
          </div>
        </div>
        <div className="d-flex align-items-center">
          <span className="text-success fw-bold fs-5">{class_code}</span>
          <button
            className={`btn btn-sm ms-2 ${
              copied ? "btn-success" : "btn-light"
            }`}
            onClick={handleCopy}
          >
            <i className={`fas ${copied ? "fa-check" : "fa-copy"}`}></i>
          </button>
        </div>
      </div>
    </div>
  );
}
