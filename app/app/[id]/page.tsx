"use client";

import React, { useState } from "react";
import { ProposalDetail, ProposalComments, ProposalVoteDetails } from "../components";
import { ProposalDetailsNav } from "../lib/NavsAndLinks";
import { useGetProposal } from "../hooks/useGetProposal";
import { useParams } from "next/navigation";
import Link from "next/link";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";

const Proposals = () => {
  const [activeScreen, setActiveScreen] = useState("Proposal details");
    const param = useParams();
    const id = Number(param.id);
    const { proposal, isLoading, error } = useGetProposal(id);   
    console.log("this is the ID: ", id);
  


  return (
    <main className="grid grid-cols-5">
      <section className="flex col-span-3 flex-col h-full gap-y-3 p-[12px] mt-3 bg-white rounded-xl">
        <Link href="/app">
          <button type="button" className="flex rounded-[5px] transition-colors duration-200 text-[#1D54E1] gap-x-3 px-3 hover:bg-[#1d55e1a6] hover:text-white items-center justify-center w-[208px] h-[50px] bg-[#F7F3FF]">
            <HiOutlineArrowNarrowLeft className="text-2xl" />
            <p>Back to Proposals</p>
          </button>
        </Link>

        <article className="w-full flex flex-col gap-x-3 relative h-[calc(100vh-50px)]">

          <nav className="w-full flex justify-between">
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
            activeScreen === "Proposal details" ? 
            (
              <ProposalDetail 
                id={proposal.id} 
                title={proposal.title}
                description={proposal.description}
                startDate={proposal.startDate}
                endDate={proposal.endDate}
                yesVotes={proposal.yesVotes}
                noVotes={proposal.noVotes}
                abstainVotes={proposal.abstainVotes}
                summary={proposal.summary}
              />
            ) : (
              activeScreen === "Comments" && <ProposalComments />
            )
          }
        </article>
      </section>

      <aside className="flex col-span-2 justify-end pl-4 overflow-auto h-[calc(100vh-80px)] scrollbar-hide">
        <ProposalVoteDetails />
      </aside>
    </main>
  );
};

export default Proposals;
