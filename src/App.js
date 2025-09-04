import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupAuth from "./Components/userAuth/signup.auth.jsx";
import LoginAuth from "./Components/userAuth/login.auth.jsx";
import Dashboard from "./Components/DashBoard/dashBoard.jsx";
import ResumeCreate from "./Components/ResumeCreator/ResumeCreator.jsx";
import ViewResume from "../src/Components/ResumeCreator/viewResume.jsx";
import UpdateResume from "./Components/ResumeCreator/updateResume.jsx";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignupAuth />} />
        <Route path="/login" element={<LoginAuth />} />
        <Route path="/create-resume" element={<ResumeCreate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-resume/:resumeId" element={<UpdateResume />} />
        <Route path="/view-resume/:resumeId" element={<ViewResume />} />
 
        <Route path="*" element={<h2>404: Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
