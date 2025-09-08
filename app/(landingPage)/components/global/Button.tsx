import Link from 'next/link'
import React from 'react'

interface ButtonProps {
    text?: string;
    href?: string;
    onClick?: () => void;
    fullWidth?: boolean;
    className?: string; // <-- add this
}

const Button = ({ text, onClick, href, fullWidth, className }: ButtonProps) => {
  return (
    <div className="flex gap-4" onClick={onClick}>
      <Link href={href || "/app"}>
        <button
          type="button"
          className={`
            bg-[#1D54E1] hover:bg-[#1D54E1]/60 
            text-white text-md py-3 rounded-xl 
            ${fullWidth ? 'w-full' : 'w-full sm:w-[200px]'} 
            h-[54px] 
            px-4 py-2 sm:px-6 sm:py-3 
            ${className}   
          `}
        >
          {text || "Launch App"}
        </button>
      </Link>
    </div>
  )
}

export default Button
