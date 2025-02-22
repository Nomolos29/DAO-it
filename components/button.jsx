import React from "react";

export const Button = ({
  variant = "solid",
  size = "md",
  children,
  onClick,
  className = "",
}) => {
  const baseClasses =
    "rounded-lg font-medium transition duration-200 ease-in-out";

  const variants = {
    solid: "bg-blue-500 text-white hover:bg-blue-600",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-50",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
