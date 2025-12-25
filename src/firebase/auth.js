// src/firebase/auth.js

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./firebase.init";

// Login function
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// Logout function
export const logoutUser = () => {
  return signOut(auth);
};

// Hook to track logged-in user
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
