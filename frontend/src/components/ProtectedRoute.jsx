import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRole }) => {
  const role = localStorage.getItem("role");

  if (!role) {
    // jika belum login
    return <Navigate to="/" replace />;
  }

  if (role !== allowedRole) {
    // jika login tapi role-nya salah
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
