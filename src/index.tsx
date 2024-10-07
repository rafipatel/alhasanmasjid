import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

// Get the root element
const rootElement = document.getElementById("root");

if (rootElement) {
  // Ensure the element exists before creating the root
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("Failed to find the root element to mount the React app.");
}
