import Image from 'next/image'
import React from 'react'
import Logo from "@/app/app/assets/smallLogo.svg"
import Link from 'next/link'


const TermsAndConditions = () => {
  return (
    <main className='w-full flex justify-center items-center'>
      <div className='container w-full py-7 flex justify-center text-center gap-y-10'>
        <nav className='flex justify-between w-full items-center'>
          <Link href="/">
            <Image src={Logo} alt='logo' width={80} height={80} />
          </Link>

          <button type='button' className='text-lg text-white w-[208px] h-[54px] rounded-[10px] bg-black flex justify-center items-center'>Download PDF</button>
        </nav>

        <section></section>
      </div>
    </main>
  )
}

export default TermsAndConditions