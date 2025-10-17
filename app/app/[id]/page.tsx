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
import { useGetProposalVotes } from "../hooks/useGetProposalVotes";
import { useActiveAccount } from "thirdweb/react";
import { getProposalReactionCounts, getUserReactionForProposal } from "../actions/ipfs-actions";
import { useQuery } from "@tanstack/react-query";
import { ProposalDetailsSkeleton, CurrentResultsSkeleton } from "../components/skeletons";



const Proposals = () => {
  const [activeScreen, setActiveScreen] = useState<string>("Proposal details");
    const account = useActiveAccount();
    const param = useParams();
    const id: string | undefined = Array.isArray(param.id)
      ? param.id[0]
      : param.id || undefined;

    // Map IPFS status to component status
    const mapStatusToComponentStatus = (status: "active" | "executed" | "rejected"): "active" | "pending" | "ended" => {
      if (status === "active") return "active";
      if (status === "executed") return "ended";
      return "ended"; // rejected also maps to ended
    };

    // Use React Query for caching proposal data
    const { data: proposalStatus, isLoading, error } = useQuery({
      queryKey: ['proposal', id],
      queryFn: async () => {
        if (!id) throw new Error('No proposal ID');

        // Fetch proposal and comments
        const { proposalData, proposalComments, error } = await fetchProposalById(id.toString());

        if (error || !proposalData) {
          throw error || new Error('Proposal not found');
        }

        // Fetch reaction counts separately
        const countsResult = await getProposalReactionCounts(id.toString());
        const reactionCounts = countsResult.success && countsResult.counts
          ? countsResult.counts
          : { like: 0, dislike: 0 };

        // Fetch user's reaction if logged in
        let userReaction: 'like' | 'dislike' | null = null;
        if (account) {
          const userReactionResult = await getUserReactionForProposal(id.toString(), account.address);
          userReaction = userReactionResult.success && userReactionResult.reaction
            ? userReactionResult.reaction
            : null;
        }

        return {
          proposalData,
          proposalComments,
          reactionCounts,
          userReaction,
        };
      },
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
      enabled: !!id, // Only run if ID exists
    });

    useEffect(() => {
      if (proposalStatus?.proposalData) {
        console.log("📋 [Proposal Page] Proposal Data:", proposalStatus.proposalData);
        console.log("💬 [Proposal Page] Comments Count:", proposalStatus.proposalComments?.length || 0);
        console.log("💬 [Proposal Page] Comments Data:", proposalStatus.proposalComments);
      }
    }, [proposalStatus]);

    const proposalData = proposalStatus?.proposalData || null;

    // Fetch vote counts from blockchain
    const { yesVotes, noVotes, abstainVotes, isLoading: votesLoading } = useGetProposalVotes(proposalData?.proposalId);

    // Use reaction data from separate storage
    const userLiked = proposalStatus?.userReaction === 'like';
    const userDisliked = proposalStatus?.userReaction === 'dislike';
    const proposalLikes = proposalStatus?.reactionCounts?.like || 0;
    const proposalDislikes = proposalStatus?.reactionCounts?.dislike || 0;

  return (
    <main className="flex w-full">
      <section className="flex col-span-3 flex-col w-[calc(100%-370px)] h-full gap-y-3 p-[12px] mt-3 bg-white rounded-xl">
        <Link href="/app">
          <button type="button" className="flex rounded-[5px] transition-colors duration-200 text-[#1D54E1] gap-x-3 px-3 hover:bg-[#1d55e1a6] hover:text-white items-center justify-center w-[208px] h-[50px] bg-[#F7F3FF]">
            <HiOutlineArrowNarrowLeft className="text-2xl" />
            <p>Back to Proposals</p>
          </button>
        </Link>

        <article className="w-full flex flex-col gap-x-3 relative h-[calc(100vh-190px)]">

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

          {isLoading ? (
            <div className="h-full flex flex-col gap-y-3 overflow-auto scrollbar-hide">
              <ProposalDetailsSkeleton />
            </div>
          ) : error ? (
            <div>Error loading proposal: {error.message}</div>
          ) : !proposalData ? (
            <div>Proposal not found</div>
          ) : (
            <div className="h-full flex flex-col gap-y-3 overflow-auto scrollbar-hide">
              <Post
                id={proposalData.proposalId}
                title={proposalData.title}
                postImage={true}
                postBy={proposalData.proposer}
                postDetailsPage
                description={proposalData.summary}
                postCreationDate={proposalData.createdAt}
                postStartDate={proposalData.createdAt}
                profilePic={true}
                postStatus={mapStatusToComponentStatus(proposalData.metadata.status)}
                postComments={proposalStatus?.proposalComments?.length ?? 0}
                postDislikes={proposalDislikes}
                postLikes={proposalLikes}
                postEndDate={proposalData.endDate}
                userLiked={userLiked}
                userDisliked={userDisliked}
              />
              {activeScreen === "Proposal details" && (
                <ProposalDetail
                  fullDescription={proposalData.content}
                  yesVotes={Number(yesVotes)}
                  noVotes={Number(noVotes)}
                  abstainVotes={Number(abstainVotes)}
                />
              )}

              {activeScreen === "Comments" && proposalStatus && (
                <ProposalComments
                  comments={proposalStatus.proposalComments}
                  proposalId={proposalData.proposalId}
                />
              )}
            </div>
          )}
        </article>
      </section>

      <aside className="flex col-span-2 justify-end pl-4 overflow-auto h-[calc(100vh-80px)] px-3 w-[380px] scrollbar-hide">
        {isLoading || votesLoading ? (
          <CurrentResultsSkeleton />
        ) : error ? (
          <div className="mt-3 w-full p-3 bg-red-400 h-fit px-3 rounded-[10px]">
            Error loading proposal vote details: {error.message}
          </div>
        ) : !proposalData ? (
          <div className="mt-3 w-full p-3 bg-yellow-200 px-3 h-fit rounded-[10px] overflow-y-auto">
            Cannot query undefined, try a valid proposal
          </div>
        ) : (
          <CurrentResults
            title={proposalData.title}
            proposalID={proposalData.proposalId}
            yesVotes={Number(yesVotes)}
            noVotes={Number(noVotes)}
            abstainVotes={Number(abstainVotes)}
            totalVotes={Number(yesVotes + noVotes + abstainVotes)}
          />
        )}
      </aside>
    </main>
  );
};

export default Proposals;
