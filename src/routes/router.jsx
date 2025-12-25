import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ArtistDashboard from "../pages/Artist/ArtistDashboard";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <div className="text-center text-2xl">Welcome to FYTOBYTE</div> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      // Artist dashboard route (protected + role-based)
      {
        path: "artist",
        element: (
          <ProtectedRoute>
            <RoleRoute allowedRole="artist">
              <ArtistDashboard />
            </RoleRoute>
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "artist",
      //   element: (
      //     <ProtectedRoute>
      //       <ArtistDashboard />  // remove RoleRoute temporarily
      //     </ProtectedRoute>
      //   ),
      // },


      // Admin dashboard route (protected + role-based)
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <RoleRoute allowedRole="admin">
              <AdminDashboard />
            </RoleRoute>
          </ProtectedRoute>
        ),
      },
      // routes/router.jsx
      // {
      //   path: "admin",
      //   element: (
      //     <ProtectedRoute>
      //       <AdminDashboard />  // remove RoleRoute temporarily
      //     </ProtectedRoute>
      //   ),
      // }

    ],
  },
]);
