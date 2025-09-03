import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupAuth from "./Components/userAuth/signup.auth.jsx";
import LoginAuth from "./Components/userAuth/login.auth.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupAuth />} />
        <Route path="/login" element={<LoginAuth />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
