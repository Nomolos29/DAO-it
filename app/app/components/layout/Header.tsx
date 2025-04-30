
// import Logo from "../../assets/smallLogo.svg"
import Image from "next/image";
import { CiSearch } from "react-icons/ci";
import { IoWalletOutline } from "react-icons/io5";
import logo from "@/app/app/assets/smallLogo.svg"


const Header = () => {
  return (
    <header className='bg-white w-full flex justify-center items-center h-[80px] py-2'>
        <main className='h-full flex justify-end w-full items-center gap-10'>
            <div className='flex  justify-end'>
                <span className='flex group items-center overflow-hidden translate-x-8 hover:translate-x-0 transition-all duration-500 cursor-pointer'>
                    <IoWalletOutline className='text-3xl text-[#000000] z-10 bg-white' />
                    <p className='text-[12px] text-black py-[1px] pr-2 pl-4 rounded-full border border-yellow-500 bg-yellow-200 -translate-x-[54px] group-hover:-translate-x-3 transition-all duration-500 font-semibold'>100.00 DAT</p>
                </span>
            </div>
        </main>
    </header>
  )
}

export default Header