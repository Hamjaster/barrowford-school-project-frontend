import type React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";

import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            {/* <Route path="my-learning" element={<MyLearning />} />
            <Route path="my-photos" element={<MyPhotos />} />
            <Route path="my-impact" element={<MyImpact />} />
            <Route path="my-experiences" element={<MyExperiences />} />
            <Route path="what-i-read" element={<WhatIRead />} /> */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
