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

  const voteButton = "w-[150px] h-[50px] rounded-lg text-lg font-medium border border-[#ABABAB] flex justify-center items-center";
  
  return (
    <Modal isOpen={isOpen} bgBlured onClose={onClose}>
        <main className='w-[550px] flex flex-col gap-y-6'>
          <h3 className='text-xl font-medium'>Book Exchange Initiative Exchange Initiative</h3>

          <div>
            <p>Status</p>
            <h4>Active</h4>
          </div>

          <div>
            <p>Vote direction</p>

            <div className='flex w-full justify-between p-3 rounded-lg border'>
              <span className={`${voteButton}`}>Yes</span>
              <span className={`${voteButton}`}>No</span>
              <span className={`${voteButton}`}>Abstain</span>
            </div>
          </div>

          <div>
            <label htmlFor='votes'>Numbers of votes</label >

            <div>
              <input type="number" name="votes" id="votes" step={1} min={1} max={5} value={votes} onChange={(e) => setVotes(Number(e.target.value))} className='w-full px-3 py-3 border border-[#ABABAB] text-lg rounded-lg outline-none' />
              <p className='text-[#E2AD4C]'>Number of token required {votes*pricePerVote}</p>
            </div>
          </div>

          <p>Proposal ID: A100</p>

          <button type='button' className='bg-gradient-to-tr from-[#F8B51C] to-[#FEE539] w-full h-[54px] flex justify-center items-center rounded-lg'>Confirm vote</button>
        </main>
    </Modal>
  )
}

export default VoteModal