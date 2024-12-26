import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div
      className={`flex items-center justify-center min-h-[60vh] ${className}`}
    >
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200/10 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-400 rounded-full animate-spin border-t-transparent"></div>
      </div>
    </div>
  );
};

export default Loader;
