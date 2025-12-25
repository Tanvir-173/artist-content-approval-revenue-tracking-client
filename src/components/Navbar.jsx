// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, logoutUser } from "../firebase/auth";

const Navbar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="navbar bg-base-200">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            FYTOBYTE
          </Link>
        </div>
        <div className="flex gap-2">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          FYTOBYTE
        </Link>
      </div>
      <div className="flex gap-2">
        <Link to="/artist" className="btn btn-sm">
          Artist
        </Link>
        <Link to="/admin" className="btn btn-sm">
          Admin
        </Link>

        {user ? (
          <>
            <span className="btn btn-sm btn-ghost">{user.email}</span>
            <button onClick={handleLogout} className="btn btn-sm btn-error">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-sm btn-secondary">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
