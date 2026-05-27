/**
 * src/App.jsx
 * LitCentral v13 + JAMNet — Routed App Entry
 */

import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import JAMSPage from "./pages/JAMSPage";
import "./App.css";

function Home() {
  return (
    <div className="app">
      <Dashboard />
      <div style={{ textAlign: "center", padding: "24px" }}>
        <Link
          to="/jams"
          style={{
            display: "inline-block",
            padding: "12px 22px",
            background: "linear-gradient(90deg,#d4a72c,#19c0a8,#9a5cd6)",
            color: "#0b0d12",
            fontWeight: 800,
            borderRadius: 8,
            textDecoration: "none",
            fontFamily: "monospace",
            letterSpacing: "0.15em",
            fontSize: 12,
          }}
        >
          → OPEN JAMNet · STAKEHOLDER INTELLIGENCE
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jams" element={<JAMSPage />} />
      </Routes>
    </BrowserRouter>
  );
}
