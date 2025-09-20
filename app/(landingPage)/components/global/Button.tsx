import Link from 'next/link'
import React from 'react'

interface ButtonProps {
    text?: string;
    href?: string;
    onClick?: () => void;
}

const Button = ({text, onClick, href}: ButtonProps) => {
  return (
    <div className="flex gap-4" onClick={onClick}>
        <Link href={href || "/app"}>
            <button type="button" className="bg-[#1D54E1] hover:bg-[#1D54E1]/60 text-white text-sm md:text-md py-3 rounded-xl w-full sm:w-[200px] h-[54px] transition-colors duration-200">
                {text || "Launch App"}
            </button>
        </Link>
    </div>
  )
}

export default Button