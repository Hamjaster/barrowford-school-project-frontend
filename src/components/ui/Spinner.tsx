import React, { useEffect, useRef } from "react";
import { Loader, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export const Spinner: React.FC<SpinnerProps> = ({ size = "md", className }) => {
  const loaderRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    let rotation = 0;
    const spin = () => {
      rotation += 2; // Adjust speed by changing this value (2 degrees per frame)
      if (rotation >= 360) {
        rotation = 0;
      }
      loader.style.transform = `rotate(${rotation}deg)`;
      requestAnimationFrame(spin);
    };

    const animationId = requestAnimationFrame(spin);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2
        ref={loaderRef}
        className={cn(
          "text-current transition-transform duration-75",
          sizeClasses[size]
        )}
      />
    </div>
  );
};

export default Spinner;
