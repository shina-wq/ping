import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Login from "#pages/Login.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}