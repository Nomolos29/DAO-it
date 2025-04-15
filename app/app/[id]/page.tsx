"use client";

import React, { useState } from "react";
import { ProposalDetail, ProposalComments, ProposalVoteDetails } from "../components";
import { ProposalDetailsNav } from "../lib/NavsAndLinks";
import { useGetProposal } from "../hooks/useGetProposal";
import { useParams } from "next/navigation";

const Proposals = () => {
  const [activeScreen, setActiveScreen] = useState("Proposal details");
    const param = useParams();
    const id = Number(param.id);
    const { proposal, isLoading, error } = useGetProposal(id);   
    console.log("this is the ID: ", id);
  


  return (
    <main className="bg-white grid grid-cols-5">
      <section className="flex col-span-3 flex-col items-center px-1">
        <nav className="w-full flex justify-between bg-white/20 static shadow-md backdrop-blur-md px-10">
          {ProposalDetailsNav.map((tab, index) => (
            <span
              key={index}
              onClick={() => setActiveScreen(tab)}
              className={`text-md text-[#ABABAB] px-2 text-center border-b-[4px] border-transparent py-3 ${
                activeScreen === tab
                  ? "border-yellow-400 text-black"
                  : "hover:border-yellow-400 cursor-pointer  hover:text-black"
              }`}
            >
              {tab}
            </span>
          ))}
        </nav>

        <article className="w-full flex justify-center relative px-1 h-[calc(100vh-50px)]">
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
      <aside className="flex col-span-2 justify-end pl-10 overflow-auto h-[calc(100vh-80px)] scrollbar-hide">
        <ProposalVoteDetails />
      </aside>
    </main>
  );
};

export default Proposals;
