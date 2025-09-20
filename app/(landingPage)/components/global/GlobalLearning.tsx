import React from 'react'
import Button from './Button'

const GlobalLearning = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center px-4 lg:px-10 mb-10 md:mb-20'>
        <main className='flex flex-col items-center max-w-screen-2xl rounded-[16px] w-full gap-8 mx-auto justify-center min-h-[300px] md:h-[457px] bg-[url("/LandingPage/heroBGImage.png")] bg-cover bg-center bg-no-repeat'>
            <div className='flex flex-col gap-y-5 items-center justify-center text-center w-full p-6 md:p-4 bg-[url("/LandingPage/globalLearning.png")] bg-contain md:bg-fit bg-bottom h-full bg-no-repeat'>
                <h2 className='text-2xl md:text-3xl lg:text-[36px] font-semibold text-[#241B00] leading-tight'>Join a Global Learning DAO</h2>
                <p className='text-[#5B5E65] w-full md:w-3/4 lg:w-1/2 text-sm md:text-base leading-relaxed'>Looking to learn more about Doait? No worries, get access to the best resource available on order to get educated and become part of the community.</p>
                <Button />
            </div>
        </main>
    </div>
  )
}

export default GlobalLearning