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
      votes: 5,
    },
    {
      title: "abstain",
      votes: 0,
    },
  ]

  const totalVotes= 240;
  let percentage:number = 0;

  return (
    <main className='py-5'>
      <section className='flex flex-col gap-y-5'>
        <h3>Current result</h3>

        <div className='border border-[#ABABAB] rounded-[10px] py-5 px-[18px] w-full flex flex-col gap-y-5'>
          {votes.map((vote, index) => {
            percentage = Number(((vote.votes/totalVotes)*100).toFixed(2));

            return(
              <div key={index} className='flex flex-col'>
                <h6 className='capitalize font-medium pb-1'>{vote.title}</h6>

                <div className='flex w-full items-center text-sm justify-between'>
                  <p className='text-md font-medium'>{vote.votes} <span className='text-sm font-normal text-[#868686]'>credits</span></p>
                  <p>{percentage}%</p>
                </div>

                <div className='w-full bg-black h-[7px] rounded-full overflow-hidden p-[1px]'>
                  <div 
                    className="bg-[#FEE539] min-w-[2px] h-full"
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