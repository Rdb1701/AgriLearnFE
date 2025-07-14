import React from "react";

export default function TextInput({ label, onChange, ...props }) {
  return (
    <div className="md-form">
      <label data-error="wrong" data-success="right">
        {label} <span className="text-danger">*</span>
      </label>
      <input {...props} className="form-control validate" onChange={onChange} />
    </div>
  );
}
