import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupAuth from "./Components/userAuth/signup.auth.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupAuth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
