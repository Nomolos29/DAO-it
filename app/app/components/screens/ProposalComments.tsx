import React from 'react'
// import Comment from '../Comment'
import PostComment from '../PostComment'
import type { DAOCommentData } from '../../lib/ipfs-service'
import Image from 'next/image'
import userpic from "@/public/appImages/userPic.png"
import Dot from '../Dot'

interface ProposalCommentsProps {
  comments: DAOCommentData[];
  proposalId: string;
}

const ProposalComments:React.FC<ProposalCommentsProps> = ({comments, proposalId}) => {
  return (
    <div className="flex flex-col gap-4 w-full min-h-screen p-4 bg-gray-50">
      <div className='flex flex-col gap-2 w-full h-full overflow-y-scroll scrollbar-hide'>
        {comments.map((comment) => (
          <div key={comment.commentId} className='border border-gray-50 bg-white w-full h-fit p-4 rounded-lg shadow-md'>
            <section className='flex justify-between items-center'>
              <div className='flex flex-col gap-y-3'>

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
                  {/* <h3 className='text-lg font-medium text-[#232426]'>{title}</h3> */}
                  <p className='text-[#2E3035] text-sm line-clamp-3'>{comment.text}</p>
                </section>
              </div>
            </section>
          </div>
        ))}
      </div>
      <PostComment proposalId={proposalId} />
    </div>
  )
}

export default ProposalComments