// Dependencies //
import React from "react";
import ReactDOM from "react-dom/client";
// Pages & Components //
import App from "./App";
// Tailwind CSS Entry Point //
import "./tailwind.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
