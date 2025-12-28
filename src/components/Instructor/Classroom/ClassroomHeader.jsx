import React from "react";
import { FaPlus } from "react-icons/fa";
import { useStateContext } from "../../../contexts/ContextProvider";
import { FcInvite } from "react-icons/fc";

export default function ClassroomHeader({ onEditRef }) {
  const { user } = useStateContext();
  return (
    <>
      <div className="">
        <button
          className="btn btn-success d-flex align-items-center gap-2 px-4 py-2"
          style={{
            backgroundColor: "#4CAF50",
            borderColor: "#4CAF50",
            float: "right",
          }}
          data-bs-toggle="modal"
          data-bs-target={
            user.role === "Instructor" ? "#add_modal" : "#invite_modal"
          }
          ref={onEditRef}
        >
          <FaPlus size={14} />
         {
            user.role === "Instructor" ? "Add Class" : "Invite Code"
          }
        </button>
        <br />
        <br />
        <br />
      </div>
    </>
  );
}
