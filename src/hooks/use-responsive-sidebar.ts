import { useState, useEffect } from "react";

export function useResponsiveSidebar() {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const isLarge = window.innerWidth >= 1024; // lg breakpoint
      setIsLargeScreen(isLarge);
      setSidebarOpen(isLarge); // Always open on large screens
    };

    // Check on mount
    checkScreenSize();

    // Listen for resize events
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return {
    isLargeScreen,
    sidebarOpen,
    setSidebarOpen,
  };
}
