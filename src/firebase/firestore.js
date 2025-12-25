// src/firebase/mongodbUser.js
import axios from "axios";

// Create a base axios instance (optional)
const axiosSecure = axios.create({
  baseURL: "http://localhost:3000", // your backend URL
});

// Get user role by uid from MongoDB
export const getUserRole = async (uid) => {
  try {
    const res = await axiosSecure.get(`/api/users/${uid}`);
    const user = res.data.user;
    if (user && user.role) return user.role;
    return null;
  } catch (err) {
    console.error("Failed to get user role:", err.message || err);
    return null;
  }
};
