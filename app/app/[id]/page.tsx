"use client";

import React, { useState } from "react";
import { ProposalDetail, ProposalComments } from "../components";
import { ProposalDetailsNav } from "../lib/NavsAndLinks";
import { useGetProposal } from "../hooks/useGetProposal";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import Post from "../components/Post";
import CurrentResults from "../components/CurrentResults";

const Proposals = () => {
  const [activeScreen, setActiveScreen] = useState("Proposal details");
    const param = useParams();
    const id = Number(param.id);
    const { proposal, isLoading, error } = useGetProposal(id);   
    // console.log("this is the ID: ", id);
  


  return (
    <main className="flex w-full">
      <section className="flex col-span-3 flex-col w-[calc(100%-370px)] h-full gap-y-3 p-[12px] mt-3 bg-white rounded-xl">
        <Link href="/app">
          <button type="button" className="flex rounded-[5px] transition-colors duration-200 text-[#1D54E1] gap-x-3 px-3 hover:bg-[#1d55e1a6] hover:text-white items-center justify-center w-[208px] h-[50px] bg-[#F7F3FF]">
            <HiOutlineArrowNarrowLeft className="text-2xl" />
            <p>Back to Proposals</p>
          </button>
        </Link>

        <article className="w-full flex flex-col gap-x-3 relative h-[calc(100vh-180px)]">

          <nav className="w-full flex justify-between mb-4">
            {ProposalDetailsNav.map((tab, index) => (
              <span
                key={index}
                onClick={() => setActiveScreen(tab)}
                className={`text-lg text-[#ABABAB] transition-colors duration-200 rounded-xl px-2 text-center w-[calc(50%-15px)] py-3 ${
                  activeScreen === tab
                    ? "bg-[#1D54E1] text-white"
                    : "hover:bg-[#789eff] cursor-pointer hover:text-white bg-[#EEEEEE]"
                }`}
              >
                {tab}
              </span>
            ))}
          </nav>

          {isLoading ? <div>Loading proposal...</div> :
            error ? <div>Error loading proposal: {error.message}</div> :
            !proposal ? <div>Proposal not found</div> :
            (<div className="h-full flex flex-col gap-y-3 overflow-auto scrollbar-hide">
              <Post
                id={id}
                title={proposal.title}
                postImage={true}
                postBy="Amarachi2944"
                postDetailsPage
                description={proposal.summary}
                postCreationDate={proposal.startDate}
                postStartDate={proposal.startDate}
                profilePic={true}
                postStatus="active"
                postComments={286}
                postDislikes={20}
                postLikes={100}
                postEndDate={proposal.endDate}
                postVotes={proposal.yesVotes + proposal.noVotes + proposal.abstainVotes}
              />
              {activeScreen === "Proposal details" ? 
              (
                <ProposalDetail
                  fullDescription={proposal.description}
                  yesVotes={proposal.yesVotes}
                  noVotes={proposal.noVotes}
                  abstainVotes={proposal.abstainVotes}
                />
              ) : (
                activeScreen === "Comments" && <ProposalComments />
              )}
            </div>)
          }
        </article>
      </section>

      <aside className="flex col-span-2 justify-end pl-4 overflow-auto h-[calc(100vh-80px)] px-3 w-[380px] scrollbar-hide">
      {isLoading ? <div className="mt-3 w-full p-3 bg-white h-fit px-3 rounded-[10px]">Loading proposal vote details...</div> :
            error ? <div className="mt-3 w-full p-3 bg-red-400 h-fit px-3 rounded-[10px]">Error loading proposal vote details: {error.message}</div> :
            !proposal ? <div className="mt-3 w-full p-3 bg-yellow-200 px-3 h-fit rounded-[10px]">Cannot query undefined, try a valid proposal</div> : <CurrentResults title={proposal.title} proposalID={proposal.id} yesVotes={proposal.yesVotes} noVotes={proposal.noVotes} abstainVotes={proposal.abstainVotes} totalVotes={proposal.yesVotes + proposal.noVotes + proposal.abstainVotes} />}
      </aside>
    </main>
  );
};

export default Proposals;
