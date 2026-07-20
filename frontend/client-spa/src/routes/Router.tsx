import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { PreviewPage } from "@/pages/preview/PreviewPage";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/preview" element={<PreviewPage />} />
    </Routes>
  );
}
