import { useState } from 'react';
import Card from '../Card'
import { IoIosPerson } from "react-icons/io";
import { HiChatBubbleOvalLeft } from "react-icons/hi2";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import Modal from '../Modal';
import { Proposals } from "../../lib/ScreenData"
import Link from 'next/link';

const Proposal = () => {

    const [postComment, setPostComment] = useState(false);

  return (
    <main className='w-full flex flex-col items-center gap-y-4 overflow-y-scroll h-full'>
        <Card>
            <Link
                href="/app/create-proposal"
                className='flex bg-[#F8F8F8] items-center w-full h-[54px] px-5 gap-x-3 rounded-full cursor-pointer'
            >
                <div className='flex justify-center items-center rounded-full overflow-hidden'>
                    <IoIosPerson className='text-[#ABABAB] text-2xl' />
                </div>
                <input type="text" placeholder='Create Proposal' className='w-full bg-transparent outline-none cursor-pointer' />
            </Link>
        </Card>

        <Card>
            <div className='flex flex-col gap-y-3'>
                {Proposals.map((proposal, index) => (
                    <div 
                        key={index}
                        className='flex flex-col gap-y-5 rounded-lg bg-[#F8F8F8] p-[30px]'
                    >
                        <div className='text-lg text-[#474747]'>Username234</div>

                        <article className='flex flex-col gap-y-4'>
                            <h3 className='text-lg text-[#474747]'>{proposal.title}</h3>
                            <p className='text-md text-[#777777]'>{proposal.shortDescription}</p>

                            <section className='flex w-full justify-between items-center'>
                                <div className='flex items-center gap-x-3 text-[14px] text-[#474747]'>
                                    <span 
                                        onClick={() => setPostComment(true)}
                                        className='cursor-pointer flex items-center'
                                    ><HiChatBubbleOvalLeft className='text-lg' />{proposal.comments}</span>
                                    <span className='flex gap-x-1 '><BiSolidLike className='text-lg hover:text-yellow-500 bg-clip-text' />{proposal.likes}</span>
                                    <span className='flex gap-x-1'><BiSolidDislike className='text-lg' />{proposal.dislikes}</span>
                                </div>

                                <div className='flex items-center gap-x-3 text-[#494445] text-[12px]'>
                                    <span>{proposal.numberOfVotes} votes</span>
                                    <span>{proposal.endDate}</span>
                                </div>
                            </section>
                        </article>


                        <Modal isOpen={postComment} onClose={() => setPostComment(false)} bgDarkened>
                            <div className='w-[500px] flex flex-col gap-y-4'>
                                <p className='text-[12px]'>Replying to <span className='text-[#8A5A00]'>username234</span></p>

                                <div 
                                    key={index}
                                    className='flex flex-col gap-y-5 rounded-lg'
                                >
                                    <div className='text-lg text-[#474747]'>Username234</div>

                                    <article className='flex flex-col gap-y-4'>
                                        <h3 className='text-lg text-[#474747]'>{proposal.title}</h3>
                                        <p className='text-md text-[#777777]'>{proposal.shortDescription}</p>

                                        <section className='flex w-full justify-between items-center'>
                                            <div className='flex items-center gap-x-3 text-[14px] text-[#474747]'>
                                                <span 
                                                    onClick={() => setPostComment(true)}
                                                    className='cursor-pointer'
                                                ><HiChatBubbleOvalLeft />{proposal.comments}</span>
                                                <span>{proposal.likes}</span>
                                                <span>{proposal.dislikes}</span>
                                            </div>

                                            <div className='flex items-center gap-x-3 text-[#494445] text-[12px]'>
                                                <span>{proposal.numberOfVotes}</span>
                                                <span>{proposal.endDate}</span>
                                            </div>
                                        </section>
                                    </article>
                                </div>

                                <div 
                                    className='flex bg-[#F8F8F8] items-center w-full max-h-[100px] h-full px-5 gap-x-3 rounded-full cursor-pointer'
                                >
                                    <div className='flex justify-center items-center rounded-full overflow-hidden'>
                                        <IoIosPerson className='text-[#ABABAB] text-2xl' />
                                    </div>
                                    <textarea placeholder='Create Proposal' className='w-full bg-transparent outline-none cursor-pointer' />
                                </div>
                            </div>
                        </Modal>
                    </div>
                ))}
            </div>
        </Card>
    </main>
  )
}

export default Proposal