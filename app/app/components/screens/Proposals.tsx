import { useGetAllProposals } from "@/app/app/hooks/useGetAllProposals";
import Post from "../Post";
// import { PostCommentModalProps } from "../../types/types";
// import { ApiProposal } from "../../create-proposal/page";
// import { useState } from "react";

// import { useEffect, useState } from "react";
// import { Proposal } from "../../types/types";

const ProposalsHome = () => {
  const { proposals, isLoading, error } = useGetAllProposals();

  // type ProposalStatus = {
  //   proposalData: ApiProposal | null;
  //   proposalComments: PostCommentModalProps | null; // Replace 'any' with the actual type if known
  //   isLoading: boolean;
  //   error: Error | null;
  // };

  // console.log("Proposals:", proposals);

  // const [proposalStatus, setProposalStatus] = useState<ProposalStatus>({
  //   proposalData: null,
  //   proposalComments: null,
  //   isLoading: true,
  //   error: null,
  // });

  // useEffect(() => {
  //   if (!id) return;

  //   setProposalStatus({ proposalData: null, proposalComments: null, isLoading: true, error: null });

  //   fetchProposalById(id.toString())
  //     .then(({ proposalData, proposalComments, error }) => {
  //       setProposalStatus({
  //         proposalData,
  //         proposalComments,
  //         isLoading: false,
  //         error,
  //       });
  //     });
  // }, [id]);


  if (isLoading) {
    return <div>Loading proposals...</div>;
  }


  if (!proposals || proposals.length === 0) {
    return <div>No proposals found.</div>;
  }

  if (error) {
    return <div>Error fetching proposals: {error.message}</div>;
  }

  const reversedProposals = [...proposals].reverse();

  return (
    <main className="w-full px-2 md:px-4 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
      <div className="flex flex-col w-full h-[10px] gap-y-5">
        <div className="flex w-full gap-y-3 pb-5">
          <div className="flex flex-col w-full gap-3">
            {reversedProposals?.map((proposal) => (
              <Post
                key={proposal.proposalId}
                id={proposal.proposalId}
                title={proposal.proposalTitle}
                postBy={proposal.userId}
                postImage={true}
                // postType="proposal"
                postComments={
                  Array.isArray(proposal.comments) ? proposal.comments.length : 0
                }
                postStatus={"active"}
                postDislikes={20}
                profilePic={true}
                postLikes={100}
                description={proposal.proposalDetails}
                postCreationDate={proposal.createdAt}
                postStartDate={proposal.createdAt}
                postEndDate={proposal.endDate}
              />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
};

export default ProposalsHome;
