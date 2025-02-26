import React from "react";

interface HomeCardProps {
  children: React.ReactNode;
  className: string
}



const HomeCard: React.FC<HomeCardProps> = ({ children, className }) => {
  return (
    <div
      className={`w-full md:w-1/4 p-6 border rounded-lg shadow-md bg-white text-gray-600 ${className}`}
    >
      {children}
    </div>
  );
};

export default HomeCard;
