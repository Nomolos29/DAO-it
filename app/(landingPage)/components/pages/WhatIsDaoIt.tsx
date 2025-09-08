import React from 'react'
import Button from '../global/Button'

const WhatIsDaoIt = () => {
  return (
    <section className='flex justify-center w-full'>
        <main className='flex flex-col items-center text-center md:w-3/5 w-4/5 px-4 md:px-10 py-6 md:py-10 gap-y-3 md:gap-y-4'>
            <p className='text-xl sm:text-2xl text-[#003CB1] font-medium'>What is DAOit?</p>
            <h2 className='text-3xl sm:text-4xl md:text-[48px] leading-tight text-[#2E3035] font-semibold'>Empowering Education Through Decentralization</h2>
            <div className='flex flex-col sm:flex-row items-center gap-y-3 sm:gap-x-10'>
                <Button />
                <Button text='Explore Communities' href='/community' />
            </div>
        </main>
    </section>
  )
}

export default WhatIsDaoIt