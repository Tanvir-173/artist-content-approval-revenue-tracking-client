// src/layouts/RootLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="p-4">
        <Outlet />
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default RootLayout;
