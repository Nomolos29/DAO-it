import Image from 'next/image'
import React from 'react'
import Logo from "@/app/app/assets/smallLogo.svg"
import Link from 'next/link'


const TermsAndConditions = () => {
  return (
    <main className='w-full flex justify-center items-center'>
      <div className='container w-full py-4 md:py-7 flex justify-center text-center gap-y-10'>
        <nav className='flex flex-col sm:flex-row justify-between w-full items-center gap-4 sm:gap-0 px-4 md:px-0'>
          <Link href="/">
            <Image src={Logo} alt='logo' width={60} height={60} className='sm:w-[80px] sm:h-[80px]' />
          </Link>

          <button type='button' className='text-sm sm:text-lg text-white w-full sm:w-[208px] h-[48px] sm:h-[54px] rounded-[10px] bg-black flex justify-center items-center max-w-[300px]'>Download PDF</button>
        </nav>

        <section></section>
      </div>
    </main>
  )
}

export default TermsAndConditions