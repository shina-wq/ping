import { createBrowserRouter, Navigate } from "react-router-dom";

import RootLayout from "@/layouts/RootLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/course/Courses";
import Assignments from "@/pages/Assignments";
import Grades from "@/pages/Grades";
import Reminders from "@/pages/Reminders";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";

// Course details pages
import CourseLayout from "@/layouts/CourseLayout";
import CourseModules from "@/pages/course/CourseModules";
import CourseAssignments from "@/pages/course/CourseAssignments";
import CourseGrades from "@/pages/course/CourseGrades";
import CourseAnnouncements from "@/pages/course/CourseAnnouncements";

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
              {
                path: "/courses/:courseId",
                element: <CourseLayout />,
                children: [
                  { index: true, element: <Navigate to="modules" replace /> },
                  { path: "modules", element: <CourseModules /> },
                  { path: "assignments", element: <CourseAssignments /> },
                  { path: "grades", element: <CourseGrades /> },
                  { path: "announcements", element: <CourseAnnouncements /> },
                ],
              },
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