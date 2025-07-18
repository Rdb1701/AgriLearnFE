import React from "react";
import { FaPlus } from "react-icons/fa";

export default function ClassroomHeader({ onEditRef }) {
  return (
    <div className="">
      <button
        className="btn btn-success d-flex align-items-center gap-2 px-4 py-2"
        style={{
          backgroundColor: "#4CAF50",
          borderColor: "#4CAF50",
          float: "right",
        }}
        data-bs-toggle="modal"
        data-bs-target="#add_modal"
        ref={onEditRef}
      >
        <FaPlus size={14} />
        Add Class
      </button>
      <br />
      <br />
      <br />
    </div>
  );
}
