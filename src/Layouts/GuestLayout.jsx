import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function GuestLayout() {
  const { user, setUser, token, setToken } = useStateContext();

  if (token && user.role === "Instructor") {
    return <Navigate to="/instructor/dashboard" />;
  }

  if (token && user.role === "Student") {
    return <Navigate to="/student/class" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
