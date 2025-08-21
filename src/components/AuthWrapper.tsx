import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initializeAuth } from "../store/slices/authSlice";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage on app start
    dispatch(initializeAuth());
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthWrapper;
