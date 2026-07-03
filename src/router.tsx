import { createBrowserRouter, Navigate } from "react-router-dom";

import RootLayout from "@/layouts/RootLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import RequireRole from "@/components/RequireRole";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Courses from "@/pages/courses/Courses";
import Assignments from "@/pages/assignments/Assignments";
import Grades from "@/pages/Grades";
import Notifications from "@/pages/Notifications";
import Settings from "@/pages/Settings";
import Students from "@/pages/Students";

// Course details pages
import CourseLayout from "@/layouts/CourseLayout";
import CourseModules from "@/pages/courses/CourseModules";
import CourseAssignments from "@/pages/courses/CourseAssignments";
import CourseGrades from "@/pages/courses/CourseGrades";
import CourseAnnouncements from "@/pages/courses/CourseAnnouncements";
import CourseModuleDetail from "@/pages/courses/CourseModuleDetail";

// Assignment Detail
import AssignmentDetail from "./pages/assignments/assignment-detail";

import RouteErrorBoundary from "@/components/route-error-boundary";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
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
              { path: "/assignments/:assignmentId", element: <AssignmentDetail /> },
              { path: "/grades", element: <Grades /> },
              { path: "/notifications", element: <Notifications /> },
              { path: "/settings", element: <Settings /> },
              {
                element: <RequireRole allow={["teacher", "admin"]} />,
                children: [{ path: "/students", element: <Students /> }],
              },
            ],
          },
        ],
      },
    ],
  },
]);