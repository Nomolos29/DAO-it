"use client"


import React, { useState } from 'react'
import { HomeNavTab } from "./lib/NavsAndLinks" 
import { Proposal, IntendingProposals, CommunityPost, CommunityList } from './components'

const MainApp = () => {

  const [activeScreen, setActiveScreen] = useState("Proposals");

  return (
    <main className='bg-white grid grid-cols-5'>
      <section className='flex col-span-3 flex-col items-center gap-y-5 px-1'>
        <nav className='w-full flex justify-between'>
          {HomeNavTab.map((tab, index) => (
            <span 
              key={index} 
              onClick={() => (setActiveScreen(tab))}
              className={`text-md text-[#ABABAB] w-1/3 text-center border-b-[2px] border-transparent py-3 ${activeScreen === tab ? "border-yellow-400 bg-[#fee4393d] text-black" : "hover:border-yellow-400 cursor-pointer hover:bg-[#fee4393d] hover:text-black"}`}
            >{tab}</span>
          ))}
        </nav>

        <article className='w-full flex justify-center items-center'>
          {activeScreen === "Proposals" ? <Proposal /> 
          : activeScreen === "Intending Proposals" ? <IntendingProposals />
          : activeScreen === "Community Post" && <CommunityPost />}
        </article>
      </section>
      <aside className='flex col-span-2 justify-end pl-5'>
        <CommunityList />
      </aside>
    </main>
  )
}

export default MainApp