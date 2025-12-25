// src/routes/RoleRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../firebase/auth";
import { getUserRole } from "../firebase/firestore";

const RoleRoute = ({ allowedRole, children }) => {
  const { user, loading } = useAuth();
  const [role, setRole] = useState(null);

  // useEffect(() => {
  //   if (user) {
  //     getUserRole(user.uid).then(setRole);
  //   }
  // }, [user]);
  useEffect(() => {
    if (user) {
      console.log("Fetching role for user:", user.uid);
      getUserRole(user.uid)
        .then(role => {
          console.log("User role:", role);
          setRole(role);
        })
        .catch(err => console.error("Failed to get role:", err));
    }
  }, [user]);


  if (loading || (user && role === null)) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role !== allowedRole) return <Navigate to="/" replace />;

  return children;
};

export default RoleRoute;
