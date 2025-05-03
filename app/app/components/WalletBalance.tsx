import Link from 'next/link'
import React from 'react'
import { CiSearch } from 'react-icons/ci'
import { FaCirclePlus } from 'react-icons/fa6'

const WalletBalance = () => {
  return (
    <div className="flex items-center gap-x-2">
        <div className="flex items-center justify-center rounded-[10px] border border-[#1D54E1] bg-white w-[48px] h-[48px]">
            <CiSearch className="text-2xl text-[#1D54E1]" />
        </div>

        <div className="flex items-center justify-between gap-x-2 rounded-[10px] overflow-hidden bg-white w-[205px] h-[50px]">
        <p className="w-[150px] font-medium text-md flex items-center justify-center h-full bg-[#1D54E11A] text-[#1D54E1]">1000.00 tokens</p>

        <Link href="#" className="flex items-center justify-center w-[50px] h-full bg-[#1D54E1] text-white">
            <div>
            <FaCirclePlus className="text-white text-2xl" />
            </div>
        </Link>
        </div>
    </div>
  )
}

export default WalletBalance