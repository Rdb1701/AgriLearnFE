import React from "react";

export default function NotFound() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="text-center">
        <div className="mb-4">
          <h1 className="display-1 fw-bold text-success">404</h1>
          <h2 className="h4 text-muted mb-4">Oops! Page Not Found</h2>
          <p className="lead text-secondary mb-4">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="mb-4">
          <svg width="200" height="200" viewBox="0 0 200 200" className="text-success">
            <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
            <circle cx="70" cy="80" r="8" fill="currentColor"/>
            <circle cx="130" cy="80" r="8" fill="currentColor"/>
            <path d="M60 130 Q100 160 140 130" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
        
        <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button 
            className="btn btn-success btn-lg"
            onClick={() => window.history.back()}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Go Back
          </button> 
          <button 
            className="btn btn-outline-success btn-lg"
            onClick={() => window.location.href = '/'}
          >
            <i className="bi bi-house me-2"></i>
            Home Page
          </button>
        </div>
      </div>
    </div>
  );
}