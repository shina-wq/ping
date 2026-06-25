import { createBrowserRouter, Navigate } from "react-router-dom";

import RootLayout from "@/layouts/RootLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/courses/Courses";
import Assignments from "@/pages/assignments/Assignments";
import Grades from "@/pages/Grades";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";

// Course details pages
import CourseLayout from "@/layouts/CourseLayout";
import CourseModules from "@/pages/courses/CourseModules";
import CourseAssignments from "@/pages/courses/CourseAssignments";
import CourseGrades from "@/pages/courses/CourseGrades";
import CourseAnnouncements from "@/pages/courses/CourseAnnouncements";
import CourseModuleDetail from "@/pages/courses/CourseModuleDetail";

// Assignment Detail
import AssignmentDetail from "./pages/assignments/assignment-detail";

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
                  { path: "modules/:moduleId", element: <CourseModuleDetail /> },
                  { path: "assignments", element: <CourseAssignments /> },
                  { path: "grades", element: <CourseGrades /> },
                  { path: "announcements", element: <CourseAnnouncements /> },
                ],
              },
              { path: "/assignments", element: <Assignments /> },
              {path: "/assignments/:assignmentId", element: <AssignmentDetail />},
              { path: "/grades", element: <Grades /> },
              { path: "/notifications", element: <Notifications /> },
              { path: "/settings", element: <Settings /> },
            ],
          },
        ],
      },
    ],
  },
]);