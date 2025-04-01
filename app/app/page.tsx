"use client"


import React, { useState } from 'react'
import { HomeNavTab } from "./lib/NavsAndLinks" 
import { ProposalsHome, IntendingProposals, CommunityPost, CommunityList } from './components'

const MainApp = () => {

  const [activeScreen, setActiveScreen] = useState("Proposals");

  return (
    <main className='bg-white grid grid-cols-5'>
      <section className='flex col-span-3 flex-col items-center'>
        <nav className='w-full flex justify-evenly bg-white/20 static shadow-sm z-20 backdrop-blur-sm'>
          {HomeNavTab.map((tab, index) => (
            <div 
              key={index} 
              onClick={() => setActiveScreen(tab)}
              className={`text-md text-[#ABABAB] px-2 text-center border-b-[4px] border-transparent py-3 ${activeScreen === tab ? "border-yellow-400 text-black" : "hover:border-yellow-400 cursor-pointer hover:text-black"}`}
            >{tab}</div>
          ))}
        </nav>

        <article className='w-full flex justify-center relative items-center h-[calc(100vh-250px)]'>
          {activeScreen === "Proposals" ? <ProposalsHome /> 
          : activeScreen === "Intending Proposals" ? <IntendingProposals />
          : activeScreen === "Community Post" && <CommunityPost />}
        </article>
      </section>
      <aside className='flex col-span-2 justify-end overflow-auto scrollbar-hide pl-10 h-[calc(100vh-80px)]'>
        <CommunityList />
      </aside>
    </main>
  )
}

export default MainApp