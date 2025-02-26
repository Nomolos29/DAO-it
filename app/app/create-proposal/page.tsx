"use client"


import React, { useState } from 'react'
import star from "../assets/StarsIcon.svg"
import Link from 'next/link';
import { IoInformationCircle } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { Modal } from '../components';

const CreateProposal = () => {

    const [proceedToCreate, setProceedToCreate] = useState(false)

    const inputStyle = "px-4 border border-[#CECECE] rounded-[10px] outline-none bg-transparent flex items-center text-[#474747]";

    const labelStyle = "text-[#494445] text-[14px]";

    const container = "flex flex-col gap-y-2"

  return (
    <main className='w-full flex justify-center pb-20'>
        <div className='w-[750px] flex flex-col gap-y-10'>
            <div className='flex justify-between items-center pb-10'>
                <div className='relative group cursor-pointer'>
                    <IoInformationCircle className='text-2xl hover:text-[#474747]' />
                    <div className='flex flex-col gap-y-2 p-[12px] shadow-md opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[10px] w-[300px] text-[#474747] absolute top-[-12px] left-[-12px]'>
                        <IoInformationCircle className='text-2xl' />
                        <p className='text-[14px]'>Submit your idea for voting. A fee is required to ensure serious and thoughtful proposals.</p>
                    </div>
                </div>
                <Link href="/app" className='flex py-5 items-center transition-all duration-500 hover:text-[#474747] gap-2 cursor-pointer'>Home <ImExit className='text-2xl' /></Link>
            </div>

            <h2 className='text-[28px] text-[#474747]'>Create and publish a proposal</h2>

            <form className='flex flex-col gap-y-5'>
                <div className={container}>
                    <label htmlFor="walletAddress" className={labelStyle}>Connected wallet address</label>
                    <input type="text" name='wallet address' id='walletAddress' value="0x4ceeb541ceb541b541b5ce41b54ce1b541ceb541b541" className={`${inputStyle} h-[50px]`} disabled />
                </div>

                <div className={container}>
                    <label htmlFor="ProposalID" className={labelStyle}>Proposal ID</label>
                    <input type="text" name='Proposal ID' id='ProposalID' className={`${inputStyle} h-[50px]`} disabled />
                </div>

                <div className={container}>
                    <label htmlFor="ProposalTitle" className={labelStyle}>Proposal Title</label>
                    <input type="text" name='Proposal title' id='ProposalTitle' className={`${inputStyle} h-[50px]`} />
                </div>

                <div className={container}>
                    <div className='flex w-full justify-between items-end -mt-3'>
                        <label htmlFor="ShortDescription" className={labelStyle}>Short Description/Summary</label>
                        <button type='submit' className='text-lg h-[40px] flex items-center justify-between rounded-[10px] w-[210px] bg-gradient-to-tr from-[#F8B51C] px-4 to-[#FEE539] text-[#474747] transition-colors duration-700'><img src={star} alt='Star Icon' width={20} />Generate with AI</button>
                    </div>
                    <textarea rows={4} name='Short Description' id='ShortDescription' className={inputStyle} />
                </div>

                <div className={container}>
                    <label htmlFor="Description" className={labelStyle}>Description</label>
                    <textarea rows={10} name='Description' id='Description' className={inputStyle} />
                </div>


                <div className='flex justify-between w-full gap-x-5'>
                    <div className={`${container} w-1/2`}>
                        <label htmlFor="StartDate" className={labelStyle}>Start date</label>
                        <input type="date" name='Start Date' id='StartDate' className={`${inputStyle} h-[50px]`} disabled />
                    </div>
                    <div className={`${container} w-1/2`}>
                        <label htmlFor="EndDate" className={labelStyle}>End Date</label>
                        <input type="date" name='End Date' id='EndDate' className={`${inputStyle} h-[50px]`} disabled />
                    </div>
                </div>

                <button 
                    type='button' 
                    onClick={() => setProceedToCreate(true)}
                    className='text-lg text-white h-[54px] flex items-center justify-center bg-[#1B1B1B] rounded-[10px] w-full border border-[#F8B51C] hover:bg-gradient-to-tr from-[#F8B51C] to-[#FEE539] hover:text-[#474747] transition-colors duration-700 cursor-pointer'
                >Create proposal</button>
            </form>


            <Modal isOpen={proceedToCreate} onClose={() => setProceedToCreate(false)} bgDarkened>
                <div>
                    Are you Sure you want to proceed?
                </div>
            </Modal>
        </div>
    </main>
  )
}

export default CreateProposal