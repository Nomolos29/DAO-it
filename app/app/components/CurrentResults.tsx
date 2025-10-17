"use client"

import React, { useState } from 'react'
import VoteModal, { VoteModalProps } from './modals/VoteModal';
import { IoInformationCircle } from 'react-icons/io5';
import { isProposalActive, getProposalStatus } from '../lib/proposalUtils';

interface CurrentResultsProps extends VoteModalProps {
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
  totalVotes: number;
  creationDate: Date | string | number;
}


const CurrentResults:React.FC<CurrentResultsProps> = ({title, proposalID, yesVotes, noVotes, abstainVotes, totalVotes, creationDate}) => {

  const [openVoteModal, setOpenVoteModal] = useState<boolean>(false);
  const [hasVoted, setHasVoted] = useState<boolean>(false)

  const handleVoteCompletion = (voted: boolean) => {
    setHasVoted(voted);
    setOpenVoteModal(false);
  }

  // Check if proposal is active
  const isActive = isProposalActive(creationDate);
  const statusInfo = getProposalStatus(creationDate);

  // setHasVoted(false);

  const votes = [
    {
      title: "Yes",
      votes: yesVotes,
    },
    {
      title: "No",
      votes: noVotes,
    },
    {
      title: "abstain",
      votes: abstainVotes,
    },
  ]

  // const totalVotes= 290;
  let percentage:number = 0;

  return (
    <main className='py-3 w-full flex flex-col gap-y-3'>
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
                  <p className='text-lg text-[#494445]'>{Number.isNaN(percentage) ? "0" : percentage}%</p>
                </div>

                <div className='w-full bg-[#DADADA] h-[10px] rounded-full overflow-hidden'>
                  <div 
                    className={`${vote.title.toLowerCase() == "yes" ? "bg-[#09FF00]" : vote.title.toLowerCase() == "no" ? "bg-[#FF0000]" : "bg-[#FFD336]"} min-w-[2px] h-full`}
                    style={{width: `${percentage}%`}}
                  />
                </div>
              </div>
          )})}
        </div>

        <button
          type='button'
          disabled={hasVoted || !isActive}
          onClick={() => setOpenVoteModal(true)}
          className={`w-full p-4 ${hasVoted || !isActive ? "bg-[#999CA3]" : "bg-[#1B1B1B]"} rounded-[10px] text-white`}
        >
          {hasVoted
            ? "You already voted"
            : !isActive
              ? (statusInfo.status === "pending" ? `Voting opens in ${statusInfo.daysRemaining} ${statusInfo.daysRemaining === 1 ? 'day' : 'days'}` : "Voting has ended")
              : "Vote now"
          }
        </button>
      </section>


      {hasVoted && <section className='w-full rounded-[10px] flex flex-col bg-white gap-y-3 p-3 shadow-md shadow-[#00000017]'>
        <IoInformationCircle className='text-2xl text-[#ABABAB]' />
        <p className='text-[#474747]'>You&apos;ve already cast your vote. Each user can vote only once per proposal.</p>
      </section>}

      {!hasVoted && !isActive && statusInfo.status === "pending" && (
        <section className='w-full rounded-[10px] flex flex-col bg-white gap-y-3 p-3 shadow-md shadow-[#00000017]'>
          <IoInformationCircle className='text-2xl text-[#FFD336]' />
          <p className='text-[#474747]'>This proposal is in the pending period. Voting will open in {statusInfo.daysRemaining} {statusInfo.daysRemaining === 1 ? 'day' : 'days'}.</p>
        </section>
      )}

      {!hasVoted && !isActive && statusInfo.status === "ended" && (
        <section className='w-full rounded-[10px] flex flex-col bg-white gap-y-3 p-3 shadow-md shadow-[#00000017]'>
          <IoInformationCircle className='text-2xl text-[#FF0000]' />
          <p className='text-[#474747]'>Voting for this proposal has ended. The results are final.</p>
        </section>
      )}



      <VoteModal isOpen={openVoteModal} onClose={() => setOpenVoteModal(false)} VoteStatus={handleVoteCompletion} title={title} proposalID={proposalID} />
    </main>
  )
}

export default CurrentResults