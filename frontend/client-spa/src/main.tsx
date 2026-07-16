import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@timo/brand";
import { App } from "@/App";
import { QueryProvider } from "@/providers/QueryProvider";
import "@/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <App />
      </QueryProvider>
    </ThemeProvider>
  </StrictMode>,
);
