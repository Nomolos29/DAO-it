"use client";

import { useParams } from "next/navigation";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import Link from "next/link";
import { ProposalDetailsNav } from "../lib/NavsAndLinks";
import { useEffect, useState } from "react";
import Post from "../components/Post";
import { ProposalComments, ProposalDetail } from "../components";
import CurrentResults from "../components/CurrentResults";
import { fetchProposalById } from "../hooks/useGetProposal";
import { ApiProposal } from "../create-proposal/page";



const Proposals = () => {
  const [activeScreen, setActiveScreen] = useState<string>("Proposal details");
    const param = useParams();
    const id: string | undefined = Array.isArray(param.id)
      ? param.id[0]
      : param.id || undefined;


    type ProposalStatus = {
      proposalData: ApiProposal | null; // Replace 'any' with the actual type if known
      isLoading: boolean;
      error: Error | null;
    };

    const [proposalStatus, setProposalStatus] = useState<ProposalStatus>({
      proposalData: null,
      isLoading: true,
      error: null,
    });

    useEffect(() => {
      if (!id) return;

      setProposalStatus({ proposalData: null, isLoading: true, error: null });

      fetchProposalById(id.toString())
        .then(({ proposalData, error }) => {
          setProposalStatus({
            proposalData,
            isLoading: false,
            error,
          });
        });
    }, [id]);

    const { proposalData, isLoading, error } = proposalStatus;



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
            !proposalData ? <div>Proposal not found</div> :
            (<div className="h-full flex flex-col gap-y-3 overflow-auto scrollbar-hide">
              <Post
                id={proposalData.proposalId.toString()}
                title={proposalData.proposalTitle}
                postImage={true}
                postBy="Amarachi2944"
                postDetailsPage
                description={proposalData.proposalDetails}
                postCreationDate={proposalData.createdAt}
                postStartDate={proposalData.createdAt}
                profilePic={true}
                postStatus="active"
                postComments={286}
                postDislikes={20}
                postLikes={100}
                postEndDate={proposalData.endDate}
              />
              {activeScreen === "Proposal details" ?
              (
                <ProposalDetail
                  fullDescription={proposalData.proposalDetails}
                  yesVotes={0}
                  noVotes={0}
                  abstainVotes={0}
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
            !proposalData ? <div className="mt-3 w-full p-3 bg-yellow-200 px-3 h-fit rounded-[10px]">Cannot query undefined, try a valid proposal</div> : <CurrentResults title={proposalData.proposalTitle} proposalID={proposalData.proposalId} yesVotes={0} noVotes={0} abstainVotes={0} totalVotes={0 + 0 + 0} />}
      </aside>
    </main>
  );
};

export default Proposals;
