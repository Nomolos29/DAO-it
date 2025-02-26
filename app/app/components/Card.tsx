import React from 'react'

interface CardProps {
    children: React.ReactNode
}

const Card: React.FC<CardProps> = ({children}) => {
  return (
    <div className='w-full p-2 shadow-md bg-white'>
        {children}
    </div>
  )
}

export default Card