// src/firebase/mongodbUser.js
import axios from "axios";
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: "https://artist-content-approval-revenue-tra.vercel.app", // your backend URL
});

export const getUserRole = async (uid) => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) throw new Error("Not authenticated");

    // Get Firebase ID token
    const idToken = await currentUser.getIdToken();

    // Send token in Authorization header
    const res = await axiosSecure.get(`/api/users/${uid}`, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    const user = res.data.user;
    if (user && user.role) return user.role;
    return null;
  } catch (err) {
    console.error("Failed to get user role:", err.message || err);
    return null;
  }
};
