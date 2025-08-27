import type React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "./store";
import AuthWrapper from "./components/AuthWrapper";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import RoleBasedDashboard from "./components/RoleBasedDashboard";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Unauthorized from "./pages/Unauthorized";

import "./App.css";
import MyImpact from "./pages/student/MyImpact";
import MyCulturalCaptical from "./pages/student/MyCulturalCaptical";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AuthWrapper>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<RoleBasedDashboard />} />
                {/* Future routes for different functionalities */}
                <Route path="create-user" element={<RoleBasedDashboard />} />
                <Route
                  path="reset-passwords"
                  element={<RoleBasedDashboard />}
                />
                <Route path="users" element={<RoleBasedDashboard />} />
                <Route path="my-students" element={<RoleBasedDashboard />} />
                <Route path="my-child" element={<RoleBasedDashboard />} />
                <Route path="my-learning" element={<RoleBasedDashboard />} />
                <Route path="my-photos" element={<RoleBasedDashboard />} />
                <Route path="my-impact" element={<MyImpact />} />
                <Route
                  path="my-cultural-capital"
                  element={<MyCulturalCaptical />}
                />
                <Route path="my-experiences" element={<RoleBasedDashboard />} />
                <Route path="what-i-read" element={<RoleBasedDashboard />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Toast notifications */}
            <Toaster position="top-right" richColors />
          </div>
        </Router>
      </AuthWrapper>
    </Provider>
  );
};

export default App;
