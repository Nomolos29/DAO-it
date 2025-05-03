"use client"


import React, { useState } from 'react'
import { HomeNavTab } from "./lib/NavsAndLinks" 
import { ProposalsHome, IntendingProposals, CommunityPost, CommunityList } from './components'

const MainApp = () => {

  const [activeScreen, setActiveScreen] = useState("Proposals");

  return (
    <main className='flex w-full py-3'>
      <section className='flex flex-col items-center bg-white px-[15px] rounded-[10px] overflow-hidden w-[calc(100%-370px)]'>
        <nav className='w-full flex justify-between static bg-white z-20 py-[15px] border-b-[1px] border-[#D5D5D5] mb-1'>
          {HomeNavTab.map((tab, index) => (
            <div 
              key={index} 
              onClick={() => setActiveScreen(tab)}
              className={`text-lg text-[#ABABAB] transition-colors duration-200 rounded-xl px-2 text-center w-[calc(100%/3-15px)] py-3 ${
                  activeScreen === tab
                    ? "bg-[#1D54E1] text-white"
                    : "hover:bg-[#789eff] cursor-pointer hover:text-white bg-[#EEEEEE]"
                }`}
            >{tab}</div>
          ))}
        </nav>

        <article className='w-full flex justify-center relative items-center h-[calc(100vh-220px)] overflow-auto scrollbar-hide'>
          {activeScreen === "Proposals" ? <ProposalsHome /> 
          : activeScreen === "Intending Proposals" ? <IntendingProposals />
          : activeScreen === "Community Post" && <CommunityPost />}
        </article>
      </section>


      <aside className='flex justify-end overflow-auto scrollbar-hide px-3 w-[380px] h-[calc(100vh-110px)]'>
        <CommunityList />
      </aside>
    </main>
  )
}

export default MainApp