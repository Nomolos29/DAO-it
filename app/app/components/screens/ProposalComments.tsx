import React from 'react'
// import Comment from '../Comment'
import PostComment from '../PostComment'
import type { DAOCommentData } from '../../lib/ipfs-service'
import Image from 'next/image'
import userpic from "@/public/appImages/userPic.png"
import Dot from '../Dot'
import ReactMarkdown from 'react-markdown'

interface ProposalCommentsProps {
  comments: DAOCommentData[];
  proposalId: string;
}

const ProposalComments:React.FC<ProposalCommentsProps> = ({comments, proposalId}) => {
  return (
    <div className="flex flex-col w-full h-full">
      {/* Comments List - Scrollable */}
      <div className='flex flex-col gap-2 w-full flex-1 overflow-y-auto scrollbar-hide px-4 pt-4 pb-4'>
        {!comments || comments.length === 0 ? (
          <div className='text-center text-gray-500 py-8'>
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.commentId} className='border border-gray-50 bg-white w-full h-fit p-4 rounded-lg shadow-md'>
              <section className='flex justify-between items-center'>
                <div className='flex flex-col gap-y-3 w-full'>

                  <div className='flex items-center gap-x-2'>
                    <Image src={userpic} alt='Profile Pic' width={40} height={40} />
                    <div>
                      <p className='flex items-center gap-x-2'>{comment.author.slice(0, 6)}...{comment.author.slice(-4)}
                        <span className='text-[#5B5E65] flex items-center gap-x-2'>
                          <Dot />
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>
                  <section className='flex flex-col gap-y-2'>
                    <div className='text-[#2E3035] text-sm prose prose-sm max-w-none'>
                      <ReactMarkdown>{comment.text}</ReactMarkdown>
                    </div>
                  </section>
                </div>
              </section>
            </div>
          ))
        )}
      </div>

      {/* Comment Input - Fixed at bottom */}
      <div className='flex-shrink-0 px-4 pb-4'>
        <PostComment proposalId={proposalId} />
      </div>
    </div>
  )
}

export default ProposalComments