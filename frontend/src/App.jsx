import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Signin from "./assets/Signin";
import Signup from "./assets/Signup";
import Landing from "./assets/Landing";
import Dashboard from "./assets/Dashboard";
import History from "./assets/History";
import ErrorBoundary from "./assets/ErrorBoundary";
import Chatbot from "./assets/Chatbot";
import "./App.css";
import "./index.css";
import Admin from "./assets/Admin";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
