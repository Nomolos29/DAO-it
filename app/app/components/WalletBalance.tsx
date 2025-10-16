import Link from 'next/link'
import React from 'react'
import { CiSearch } from 'react-icons/ci'
import { FaCirclePlus } from 'react-icons/fa6'
import { tokenContract } from '../lib/constants'
import { useActiveAccount, useReadContract } from 'thirdweb/react'

const WalletBalance = () => {
  const account = useActiveAccount();

  const { data: balance, isLoading } = useReadContract({
    contract: tokenContract,
    method: "function balanceOf(address) view returns (uint256)",
    params: account?.address ? [account.address] : ["0x0000000000000000000000000000000000000000"],
  });

  if (!account) {
    return (
      <div className="flex items-center gap-x-2">
        <div className="flex items-center justify-center rounded-[10px] border border-[#1D54E1] bg-white w-[48px] h-[48px]">
          <CiSearch className="text-2xl text-[#1D54E1]" />
        </div>
        <div className="flex items-center justify-between gap-x-2 rounded-[10px] overflow-hidden bg-white w-[205px] h-[50px]">
          <p className="w-[150px] font-medium text-md flex items-center justify-center h-full bg-[#1D54E11A] text-[#1D54E1]">
            Not Connected
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-x-2">
        <div className="flex items-center justify-center rounded-[10px] border border-[#1D54E1] bg-white w-[48px] h-[48px]">
          <CiSearch className="text-2xl text-[#1D54E1]" />
        </div>
        <div className="flex items-center justify-between gap-x-2 rounded-[10px] overflow-hidden bg-white w-[205px] h-[50px]">
          <p className="w-[150px] font-medium text-md flex items-center justify-center h-full bg-[#1D54E11A] text-[#1D54E1]">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  const formattedBalance = balance ? (parseFloat(balance.toString()) / 1e18).toFixed(2) : "0.00";

  return (
    <div className="flex items-center gap-x-2">
        <div className="flex items-center justify-center rounded-[10px] border border-[#1D54E1] bg-white w-[48px] h-[48px]">
            <CiSearch className="text-2xl text-[#1D54E1]" />
        </div>

        <div className="flex items-center justify-between gap-x-2 rounded-[10px] overflow-hidden bg-white w-[205px] h-[50px]">
        <p className="w-[150px] font-medium text-md flex items-center justify-center h-full bg-[#1D54E11A] text-[#1D54E1]">{formattedBalance} tokens</p>

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