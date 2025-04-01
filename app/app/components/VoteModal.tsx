import React from 'react'
import Modal, { ModalProps } from './Modal'

// interface VoteModalProps extends ModalProps {
//     // totalVotes: number;
//     // supports: number;
//     // against: number;
//     // abstain: number;
//     // voters: string[];
// }

const VoteModal: React.FC<ModalProps> = ({isOpen, onClose}) => {
  return (
    <Modal isOpen={isOpen} bgBlured onClose={onClose}>
        <main>
            VoteModal
        </main>
    </Modal>
  )
}

export default VoteModal