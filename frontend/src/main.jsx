import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./index.css";

import Home from "./pages/Home.jsx";
import Interview from "./pages/Interview.jsx";
import History from "./pages/History.jsx";
import Settings from "./pages/Settings.jsx";

function Nav() {
  return (
    <nav className="flex gap-4 p-4 shadow">
      <Link to="/">Home</Link>
      <Link to="/interview">Interview</Link>
      <Link to="/history">History</Link>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<App />);
