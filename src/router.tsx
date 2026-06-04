import { createBrowserRouter, Navigate } from "react-router-dom";

import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Courses from "@/pages/Courses";
import Assignments from "@/pages/Assignments";
import Grades from "@/pages/Grades";
import Reminders from "@/pages/Reminders";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "courses",
        element: <Courses />,
      },
      {
        path: "assignments",
        element: <Assignments />,
      },
      {
        path: "grades",
        element: <Grades />,
      },
      {
        path: "reminders",
        element: <Reminders />,
      },
      {
        path: "notifications",
        element: <Notifications />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
