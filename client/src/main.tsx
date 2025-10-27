import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root")!;
const isDevelopment = import.meta.env.DEV;

if (isDevelopment) {
  // Development: Pure CSR via Vite dev server
  createRoot(rootElement).render(<App />);
} else {
  // Production: Hydrate SSR-rendered markup
  hydrateRoot(rootElement, <App />);
}
