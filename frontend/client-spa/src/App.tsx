import { BrowserRouter } from "react-router-dom";
import { ClientLayout } from "@/layouts/ClientLayout";
import { Router } from "@/routes/Router";

export function App() {
  return (
    <BrowserRouter>
      <ClientLayout>
        <Router />
      </ClientLayout>
    </BrowserRouter>
  );
}
