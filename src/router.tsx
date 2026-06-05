import { createBrowserRouter, Navigate } from "react-router-dom";

import RootLayout from "@/layouts/RootLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/Courses";
import Assignments from "@/pages/Assignments";
import Grades from "@/pages/Grades";
import Reminders from "@/pages/Reminders";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";

export const router = createBrowserRouter([
  {
    // RootLayout mounts AuthProvider
    element: <RootLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        // ProtectedRoute for all dashboard routes behind authentication.
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              {
                path: "/",
                element: <Navigate to="/dashboard" replace />,
              },
              { path: "/dashboard", element: <Dashboard /> },
              { path: "/courses", element: <Courses /> },
              { path: "/assignments", element: <Assignments /> },
              { path: "/grades", element: <Grades /> },
              { path: "/reminders", element: <Reminders /> },
              { path: "/notifications", element: <Notifications /> },
              { path: "/settings", element: <Settings /> },
            ],
          },
        ],
      },
    ],
  },
]);