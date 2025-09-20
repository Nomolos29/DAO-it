import React from 'react'

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({children, className = ""}) => {
  return (
    <div className={`w-full p-3 md:p-4 shadow-md bg-white rounded-lg ${className}`}>
        {children}
    </div>
  )
}

export default Card