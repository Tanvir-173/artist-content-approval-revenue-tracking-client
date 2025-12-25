// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, logoutUser } from "../firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { getUserRole } from "../firebase/firestore";

const Navbar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user?.uid) {
      // fetch role from backend
      getUserRole(user.uid)
        .then((r) => setRole(r))
        .catch(() => setRole(null));
    } else {
      setRole(null);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed");
    }
  };

  const handleAdminClick = () => {
    if (!user) {
      toast.error("You must be logged in as admin");
    } else if (role !== "admin") {
      toast.error("You are not an admin!");
    } else {
      navigate("/admin");
    }
  };

  const handleArtistClick = () => {
    if (!user) {
      toast.error("You must be logged in as artist");
    } else if (role !== "artist") {
      toast.error("You are not an artist!");
    } else {
      navigate("/artist");
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
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="navbar bg-base-200 px-4">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            FYTOBYTE
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-2 items-center">
          <button className="btn btn-sm" onClick={handleArtistClick}>
            Artist
          </button>
          <button className="btn btn-sm" onClick={handleAdminClick}>
            Admin
          </button>

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

        {/* Mobile Menu */}
        <div className="md:hidden">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <button className="w-full text-left" onClick={handleArtistClick}>
                  Artist
                </button>
              </li>
              <li>
                <button className="w-full text-left" onClick={handleAdminClick}>
                  Admin
                </button>
              </li>

              {user ? (
                <>
                  <li>
                    <span>{user.email}</span>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="btn btn-error btn-sm w-full"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
