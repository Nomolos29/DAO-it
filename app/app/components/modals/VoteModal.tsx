import React, { useState } from 'react'
import { IoIosCheckmarkCircle } from "react-icons/io";
import Modal, { ModalProps } from "./Modal";
import { GiPartyPopper } from 'react-icons/gi';

export interface VoteModalProps {
    title: string;
    proposalID: number | string;
}

type VoteStatus = (voted: boolean) => void;

type FullVoteModalProps = VoteModalProps & ModalProps & {
  VoteStatus: VoteStatus;
};

const VoteModal: React.FC<FullVoteModalProps> = ({ isOpen, onClose, title, proposalID, VoteStatus }) => {
  const [voteType, setVoteType] = useState<string>("");
  const [activeModal, setActiveModal] = useState<'vote' | 'confirmation' | 'completion'>('vote');

  const handleShowConfirmationModal = () => {
    if (!voteType) return;
    setActiveModal('confirmation');
  }

  const handleVoteCompletion = () => {
    setActiveModal('completion');
    VoteStatus(true);
    setVoteType("");
  }

  const handleCloseAllModals = () => {
    setActiveModal('vote');
    onClose();
  };

  const voteButton =
    "w-full py-3 rounded-[10px] px-[10px] gap-x-2 cursor-pointer text-md font-medium border flex items-center";

  return (
    <>
      <Modal isOpen={isOpen && activeModal === 'vote'} bgBlured onClose={onClose} closeButton="right">
        <main className="w-[450px] flex flex-col gap-y-6">
          <p>Proposal ID: {proposalID}</p>

          <h3 className="text-xl font-medium">
            {title}
          </h3>

          <div className="w-full flex flex-col gap-y-[14px]">
            <fieldset className={`${voteButton} ${voteType == "yes" ? "bg-green-200 border-green-200" : "hover:border-green-400 border-[#E0E2EA]" }`} onClick={() => setVoteType("yes")}>
                <IoIosCheckmarkCircle className={`text-2xl text-green-400 ${voteType == "yes" ? "flex" : "hidden" }`} />
                <span>Vote Yes</span>
            </fieldset>
            <fieldset className={`${voteButton} ${voteType == "no" ? "bg-red-200 border-red-200" : "hover:border-red-400 border-[#E0E2EA]" }`} onClick={() => setVoteType("no")}>
              <IoIosCheckmarkCircle className={`text-2xl text-red-400 ${voteType == "no" ? "flex" : "hidden" }`} />
              <span>Vote No</span>
            </fieldset>
            <fieldset className={`${voteButton} ${voteType == "abstain" ? "bg-yellow-200 border-yellow-200" : "hover:border-yellow-400 border-[#E0E2EA]" }`} onClick={() => setVoteType("abstain")}>
              <IoIosCheckmarkCircle className={`text-2xl text-yellow-400 ${voteType == "abstain" ? "flex" : "hidden" }`} />
              <span>Vote Abstain</span>
            </fieldset>
          </div>

          <button
            type="button"
            className="bg-[#1D54E1] text-white w-full h-[54px] flex justify-center items-center rounded-lg"
            onClick={handleShowConfirmationModal}
            disabled={!voteType}
          >
            Submit your vote
          </button>
        </main>
      </Modal>

      <Modal isOpen={activeModal === 'confirmation'} bgBlured onClose={() => setActiveModal('vote')} closeButton="left">
        <main className="w-[450px] flex flex-col items-center gap-y-4 px-[30px]">
          <h3 className="text-xl font-semibold">Confirm Your Vote</h3>

          <div className='flex flex-col gap-y-5 text-[#5B5E65] text-center'>
            <p>You&apos;re about to cast your vote on this proposal. This action is final and cannot be changed.</p>

            <p>Please make sure you&apos;ve reviewed the proposal details before continuing.</p>
          </div>

          <div className="flex flex-col w-full gap-y-3">
            <button
              type='button'
              className="bg-[#1D54E1] text-white px-4 py-[15px] rounded-[10px]"
              onClick={handleVoteCompletion}
            >
              Submit your vote
            </button>
            <button
              type='button'
              className="bg-gray-200 text-gray-800 w-full px-4 py-[15px] rounded-[10px]"
              onClick={() => setActiveModal('vote')}
            >
              Go back
            </button>
          </div>
        </main>
      </Modal>

      <Modal isOpen={activeModal === 'completion'} bgBlured onClose={handleCloseAllModals}>
        <main className="w-[450px] flex flex-col items-center text-center gap-y-4 px-[30px]">
          <GiPartyPopper className='text-[100px] text-[#1D54E1]' />

          <h3 className='text-xl font-semibold text-[#2E3035]'>Vote Submitted Successfully!</h3>

          <p className='text-[#5B5E65]'>Your vote has been recorded and added to the proposal. Thanks for participating in shaping the future of the DAO!</p>

          <button
            type='button'
            className="bg-[#1D54E1] text-white w-full px-4 py-[15px] rounded-[10px]"
            onClick={handleCloseAllModals}
          >
            Go back
          </button>
        </main>
      </Modal>
    </>
  );
};

export default VoteModal;
