import React, { useState } from 'react'
import Modal, { ModalProps } from './Modal'

// interface VoteModalProps extends ModalProps {
//     // totalVotes: number;
//     // supports: number;
//     // against: number;
//     // abstain: number;
//     // voters: string[];
// }

const VoteModal: React.FC<ModalProps> = ({isOpen, onClose}) => {
  const [votes, setVotes] = useState<number>(1);

  const pricePerVote:number = 5;

  const voteButton = "w-full h-[50px] rounded-xl px-[14px] text-md font-medium border border-[#E0E2EA] flex items-center";
  
  return (
    <Modal isOpen={isOpen} bgBlured onClose={onClose}>
        <main className='w-[450px] flex flex-col gap-y-6'>
          <h3 className='text-xl font-medium'>Book Exchange Initiative Exchange Initiative</h3>

          <div className='w-full flex flex-col gap-y-[14px]'>
            <span className={`${voteButton}`}> Vote Yes</span>
            <span className={`${voteButton}`}>Vote No</span>
            <span className={`${voteButton}`}>Vote Abstain</span>
          </div>

          <p>Proposal ID: A100</p>

          <button type='button' className='bg-[#1D54E1] text-white w-full h-[54px] flex justify-center items-center rounded-lg'>Submit your vote</button>
        </main>
    </Modal>
  )
}

export default VoteModal