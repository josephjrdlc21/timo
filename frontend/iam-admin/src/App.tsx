import { BrowserRouter } from "react-router-dom";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Router } from "@/routes/Router";

export function App() {
  return (
    <BrowserRouter>
      <AdminLayout>
        <Router />
      </AdminLayout>
    </BrowserRouter>
  );
}
