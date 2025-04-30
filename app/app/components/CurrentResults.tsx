"use client"

import React, { useState } from 'react'
import VoteModal from './VoteModal';

// interface CurrentResultsProps {
//   totalVotes: number
// }


const CurrentResults = () => {

  const [openVoteModal, setOpenVoteModal] = useState(false);

  const votes = [
    {
      title: "Yes",
      votes: 235,
    },
    {
      title: "No",
      votes: 50,
    },
    {
      title: "abstain",
      votes: 5,
    },
  ]

  const totalVotes= 290;
  let percentage:number = 0;

  return (
    <main className='py-3'>
      <section className='flex flex-col gap-y-5 rounded-[12px] bg-white p-[15px]'>
        <h3 className='text-xl text-[#232426] font-semibold'>Current result</h3>

        <div className='w-full flex flex-col gap-y-2'>
          {votes.map((vote, index) => {
            percentage = Number(((vote.votes/totalVotes)*100).toFixed(2));

            return(
              <div key={index} className='flex flex-col border-[#EDEDED] border rounded-[10px] p-3 gap-y-[12px]'>
                <h6 className='capitalize pb-1'>{vote.title}</h6>

                <div className='flex w-full items-center text-sm justify-between'>
                  <p className='text-lg'>{vote.votes} <span className='text-md font-normal text-[#868686]'>credits</span></p>
                  <p className='text-lg text-[#494445]'>{percentage}%</p>
                </div>

                <div className='w-full bg-[#DADADA] h-[10px] rounded-full overflow-hidden'>
                  <div 
                    className={`${vote.title.toLowerCase() == "yes" ? "bg-[#09FF00]" : vote.title.toLowerCase() == "no" ? "bg-[#FF0000]" : "bg-[#FFD336]"} min-w-[2px] h-full`}
                    style={{width: `${percentage}%`}}
                  ></div>
                </div>
              </div>
          )})}
        </div>

        <button 
          type='button'
          onClick={() => setOpenVoteModal(true)}
          className='w-full p-4 bg-[#1B1B1B] rounded-[10px] text-white'
        >Vote now</button>
      </section>
      <section></section>



      <VoteModal isOpen={openVoteModal} onClose={() => setOpenVoteModal(false)} />
    </main>
  )
}

export default CurrentResults