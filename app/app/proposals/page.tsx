"use client"


import React, { useState } from 'react'
import { Proposal, ProposalComments, ProposalVoteDetails } from '../components'
import { ProposalDetailsNav } from "@/app/app/lib/NavsAndLinks"

const Proposals = () => {

    const [activeScreen, setActiveScreen] = useState("Proposal details");

  return (
    <main className='bg-white grid grid-cols-5'>
    <section className='flex col-span-3 flex-col items-center gap-y-5 px-1 relative'>
      <nav className='w-full flex justify-between bg-white/30 static shadow-md backdrop-blur-md'>
        {ProposalDetailsNav.map((tab, index) => (
          <span 
            key={index} 
            onClick={() => (setActiveScreen(tab))}
            className={`text-md text-[#ABABAB] w-1/2 text-center border-b-[2px] border-transparent py-3 ${activeScreen === tab ? "border-yellow-400 text-black" : "hover:border-yellow-400 cursor-pointer  hover:text-black"}`}
          >{tab}</span>
        ))}
      </nav>

      <article className='w-full flex justify-center items-center overflow-y-auto min-h-screen h-full'>
        {activeScreen === "Proposal details" ? <Proposal /> 
        : activeScreen === "Comments" && <ProposalComments />}
      </article>
    </section>
    <aside className='flex col-span-2 justify-end pl-10'>
      <ProposalVoteDetails />
    </aside>
  </main>
  )
}

export default Proposals