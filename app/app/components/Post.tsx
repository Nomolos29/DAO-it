"use client";

import Image from 'next/image';
import React from 'react'
import userpic from "@/public/appImages/userPic.png"
import postPic from "@/public/appImages/postImage.png"
import Link from 'next/link';
import { BsChatFill } from 'react-icons/bs';
import { BiSolidDislike, BiSolidLike } from 'react-icons/bi';
import Dot from './Dot';
import { useToggleProposalReaction } from '../hooks/useToggleProposalReaction';
import { useActiveAccount } from 'thirdweb/react';
import { toast } from 'react-toastify';

export interface PostProps {
  id: number | string;
  title: string;
  profilePic?: string | boolean;
  description: string;
  postImage?: string | boolean;
  // postType: "proposal" | "post";
  postBy?: string;
  postDetailsPage?: boolean;
  postCreationDate: Date | string;
  postStartDate: Date | string;
  postEndDate: Date | string;
  postStatus?: "active" | "pending" | "ended";
  postVotes?: number;
  postComments: number;
  postLikes: number;
  postDislikes: number;
  userLiked?: boolean;
  userDisliked?: boolean;
}




const Post:React.FC<PostProps> = ({id, title, description, profilePic, postBy, postComments, postCreationDate, postDislikes, postLikes, postStatus, postDetailsPage, postStartDate, postEndDate, postImage, postVotes, userLiked, userDisliked}) => {

  const currentDate = new Date();
  const postEndDateObj = new Date(postEndDate);
  const postCreationDateObj = new Date(postCreationDate);
  const postStartDateObj = new Date(postStartDate);

  const account = useActiveAccount();
  const { mutate: toggleReaction, isPending } = useToggleProposalReaction();

  // console.log(postCreationDate);

  const postCreationDateString = Math.floor((Number(currentDate) - Number(postCreationDateObj)) / (1000 * 60 * 60 * 24));
  const postValidityTime = Math.floor((Number(postEndDateObj) - Number(postStartDateObj)) / (1000 * 60 * 60 * 24));

  const handleReactionClick = (e: React.MouseEvent, type: 'like' | 'dislike') => {
    e.preventDefault();
    e.stopPropagation();

    if (!account) {
      toast.error('Please connect your wallet to react');
      return;
    }

    toggleReaction({
      proposalId: String(id),
      reactionType: type,
    });
  };

  const handleLikeClick = (e: React.MouseEvent) => handleReactionClick(e, 'like');
  const handleDislikeClick = (e: React.MouseEvent) => handleReactionClick(e, 'dislike');

  return (
    <main className={`${!postDetailsPage && "border-[#D5D5D5] border  p-[15px]"} rounded-[10px] flex flex-col gap-y-[19px]`} key={`post-${id}`}>
        <section className='flex justify-between items-center'>
          <div className='flex items-center gap-x-3'>
            {profilePic && <Image src={userpic} alt='Profile Pic' width={40} height={40} />}

            <div className='flex flex-col gap-y-1'>
                <p className='flex items-center gap-x-2'>Proposal by {postBy}<span className='text-[#5B5E65] flex items-center gap-x-2'><Dot />{postCreationDateString}d</span></p>
                <p className='text-[#5B5E65] flex items-center gap-x-1'>
                    <svg width="14" height="16" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.20702 0.030077C4.2828 0.147655 3.31483 0.546874 2.51366 1.14023C2.1828 1.38633 1.54022 2.02891 1.29413 2.36523C0.317959 3.68594 -0.0675878 5.26914 0.246865 6.66641C0.572256 8.11289 1.48554 9.73164 3.46522 12.3594C4.04765 13.1332 4.1953 13.3027 4.45507 13.4996C4.8953 13.8332 5.4121 14 6.00273 14C6.83671 14 7.49022 13.6883 8.0371 13.0293C8.32421 12.6848 9.04608 11.7141 9.45077 11.1289C10.7715 9.22305 11.5672 7.66445 11.7941 6.54336C11.8598 6.22891 11.8734 5.57266 11.8242 5.16797C11.6629 3.83359 11.0859 2.64687 10.1453 1.70625C9.21562 0.779296 8.09726 0.221483 6.79843 0.0437489C6.46483 -0.00273514 5.52694 -0.0109386 5.20702 0.030077ZM6.69999 1.16211C7.74452 1.31797 8.66327 1.80195 9.42343 2.59492C10.0387 3.2375 10.4598 4.03867 10.6512 4.93828C10.7332 5.32656 10.7523 6.00195 10.6894 6.31641C10.4406 7.54687 9.28671 9.55664 7.49022 11.8973C7.05546 12.4633 6.89413 12.6219 6.6453 12.7395C6.39647 12.857 6.22421 12.8871 5.92069 12.8734C5.44218 12.8461 5.13866 12.6766 4.78866 12.2391C3.17265 10.1992 1.86288 8.06641 1.44999 6.80312C1.28319 6.29727 1.25858 6.13047 1.27772 5.63008C1.3078 4.76328 1.5703 3.97305 2.08163 3.19922C2.36601 2.77266 2.91015 2.22578 3.33124 1.94414C3.96562 1.52305 4.58905 1.27422 5.28905 1.16211C5.61444 1.11289 6.35273 1.11289 6.69999 1.16211Z" fill="#5B5E65"/>
                        <path d="M5.63626 3.55469C4.70931 3.72148 4.06126 4.29844 3.79603 5.18711C3.69212 5.53711 3.67298 6.04297 3.75501 6.3793C3.95189 7.20234 4.55072 7.83945 5.37103 8.09922C5.55423 8.15391 5.62806 8.16211 6.04095 8.16211C6.49486 8.16211 6.51126 8.15938 6.76283 8.07187C7.4847 7.82031 8.00697 7.30352 8.23939 6.60352C8.52376 5.75039 8.29134 4.77148 7.66244 4.16719C7.37259 3.88828 7.06361 3.71602 6.65619 3.60664C6.42376 3.54375 5.85228 3.51367 5.63626 3.55469ZM6.55228 4.76328C7.16205 5.0668 7.40541 5.7668 7.11009 6.38477C6.99525 6.63086 6.81751 6.80586 6.56048 6.93438C6.39369 7.01641 6.32259 7.03555 6.12845 7.04648C5.7429 7.07109 5.4558 6.97266 5.1933 6.72383C4.62181 6.18516 4.72845 5.23359 5.40384 4.81797C5.61986 4.68398 5.77572 4.6457 6.07103 4.65664C6.32533 4.66211 6.36087 4.67031 6.55228 4.76328Z" fill="#5B5E65"/>
                    </svg>
                    Location
                </p>
            </div>
          </div>

          {postDetailsPage &&
          <div className={`px-[10px] w-[84px] capitalize py-[4px] flex items-center justify-center rounded-[5px] ${postStatus === "active" ? "bg-[#8AFF8A]" : postStatus === "pending" ? "bg-[#FFD336]" : "bg-[#FF0000]"}`}>
              {postStatus}
          </div>}
        </section>

        <div className={`flex ${postDetailsPage ? "flex-col-reverse" : "flex-col"} gap-y-3`}>
          <Link href={postDetailsPage ? `#` : `/app/${id}`}>
            <section className='flex flex-col gap-y-2'>
              <h3 className='text-lg font-medium text-[#232426]'>{title}</h3>
              <p className='text-[#2E3035] text-md line-clamp-3'>{description}</p>
            </section>
          </Link>

          {postImage && <section className='w-full h-[202px]'>
              <Image src={postPic} alt='post image' width={1000} height={1000} className='h-full' />
          </section>}
        </div>

        <section className='flex justify-between items-center'>
          <div className='flex items-center gap-x-3'>
            <p className='text-[#5B5E65] flex items-center gap-x-2 text-md'><BsChatFill className='text-xl text-[#1D54E1] flex items-center gap-x-2' /><span>{postComments} {!(postComments > 1) ? "Comment" : "Comments"}</span></p>

            <button
              type="button"
              onClick={handleLikeClick}
              disabled={isPending}
              className={`text-[#5B5E65] flex items-center gap-x-2 text-md transition-all hover:scale-105 disabled:opacity-50 ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <BiSolidLike className={`text-xl flex items-center gap-x-2 transition-colors ${userLiked ? 'text-green-600' : 'text-green-400'}`} />
              <span>{postLikes} Likes</span>
            </button>

            <button
              type="button"
              onClick={handleDislikeClick}
              disabled={isPending}
              className={`text-[#5B5E65] flex items-center gap-x-2 text-md transition-all hover:scale-105 disabled:opacity-50 ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <BiSolidDislike className={`text-xl flex items-center gap-x-2 transition-colors ${userDisliked ? 'text-red-600' : 'text-red-400'}`} />
              <span>{postDislikes} Dislikes</span>
            </button>
          </div>

          {!postDetailsPage && <div className='flex items-center gap-x-3'>
            {postVotes && <p className='flex gap-x-2 items-center text-[#5B5E65] text-md'><Dot /><span>{postVotes} {postVotes > 1 ? "votes" : "vote"}</span></p>}


            <p className='flex gap-x-2 items-center text-[#5B5E65] text-md'><Dot /><span>Ends in {postValidityTime}{postValidityTime > 1 ? "days" : "day"}</span></p>
          </div>}
        </section>
    </main>
  )
}

export default Post