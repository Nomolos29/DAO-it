
import Logo from "../../assets/smallLogo.svg"
import { CiSearch } from "react-icons/ci";
import { IoWalletOutline } from "react-icons/io5";


const Header = () => {
  return (
    <header className='bg-white w-full flex justify-center items-center border-b-[1px] border-[#ABABAB] h-[75px]'>
        <main className='container grid grid-cols-6 h-full items-center gap-10'>
            <div className='grid col-span-1 items-center'>
                <img src={Logo} alt="logo" className='' />
            </div>

            <div className='flex col-span-3 items-center justify-center'>
                <div className='flex w-full items-center px-4 gap-x-3 hover:bg-gray-50 cursor-pointer rounded-full h-[40px] border border-[#ABABAB]'>
                    <CiSearch className='text-[#ABABAB] text-2xl' />
                    <input type="text" name="search" id="" placeholder='Search' className='outline-none w-full text-black bg-transparent cursor-pointer' />
                </div>
            </div>

            <div className='flex col-span-2 justify-end'>
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