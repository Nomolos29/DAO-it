"use client"

import React, { useState } from 'react'
import VoteModal from './VoteModal';

const CurrentResults = () => {

  const [openVoteModal, setOpenVoteModal] = useState(false);

  return (
    <main className='py-5'>
      <section className='flex flex-col gap-y-5'>
        <h3>Current result</h3>

        <div className='border border-[#ABABAB] py-5 px-[18px] w-full flex flex-col gap-y-2'>
          <div>

          </div>
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