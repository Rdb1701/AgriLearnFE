import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function GuestLayout() {

  const {user,setUser, token, setToken} = useStateContext();

  if(token){
    return <Navigate to="/instructor/dashboard"/>
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}
