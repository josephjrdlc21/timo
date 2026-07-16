import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "@/pages/DashboardPage";
import { RolesPage } from "@/pages/RolesPage";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/roles" element={<RolesPage />} />
    </Routes>
  );
}
