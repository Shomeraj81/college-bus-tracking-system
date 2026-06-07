import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Landingpage from './pages/Landing_page.jsx'
import StudentDashboard from "./pages/StudentDashboard_page.jsx";
import AdminDashboard from "./pages/AdminDashboard_page.jsx";

function App() {


  return (
    <>
       
      <Routes>
          <Route path="/" element={<Landingpage />} />
        <Route
          path="/student-dashboard"
          element={<StudentDashboard />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

      </Routes>
    </>
  )
}

export default App
