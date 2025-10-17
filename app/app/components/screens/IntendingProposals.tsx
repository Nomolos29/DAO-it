import { useProposalsContext } from "@/app/app/context/ProposalsContext";
import Post from "../Post";
import { PostSkeleton } from "../skeletons";
import EmptyState from "../EmptyState";
import { isProposalPending, getProposalStatus } from "../../lib/proposalUtils";

const IntendingProposals = () => {
  const { proposals, isLoading, error } = useProposalsContext();

  // Filter only pending proposals
  const pendingProposals = proposals?.filter(proposal =>
    isProposalPending(proposal.startDate)
  ) || [];

  // Handle loading state
  if (isLoading) {
    return (
      <main className="w-full px-2 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
        <div className="flex flex-col w-full h-[10px] gap-y-5">
          <div className="flex w-full gap-y-3 pb-5">
            <div className="flex flex-col w-full gap-3">
              {[1, 2, 3].map((i) => (
                <PostSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Handle error state
  if (error) {
    return (
      <main className="w-full px-2 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-red-600">Error fetching proposals: {error.message}</p>
        </div>
      </main>
    );
  }

  // Handle empty state
  if (pendingProposals.length === 0) {
    return (
      <main className="w-full px-2 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
        <EmptyState
          title="No Pending Proposals"
          message="There are no proposals waiting to become active. All proposals are either already active or have ended."
          showCreateButton={false}
        />
      </main>
    );
  }

  const reversedProposals = [...pendingProposals].reverse();

  return (
    <main className="w-full px-2 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
      <div className="flex flex-col w-full h-[10px] gap-y-5">
        <div className="flex w-full gap-y-3">
          <div className="flex flex-col w-full gap-3">
            {reversedProposals?.map((proposal) => {
              const statusInfo = getProposalStatus(proposal.startDate);
              return (
                <Post
                  key={proposal.id}
                  id={proposal.id}
                  title={proposal.title}
                  postBy={proposal.id}
                  postImage={true}
                  postComments={proposal.commentCount || 0}
                  postStatus={statusInfo.status}
                  postDislikes={proposal.totalDislikes || 0}
                  profilePic={true}
                  postLikes={proposal.totalLikes || 0}
                  description={proposal.summary}
                  postCreationDate={proposal.startDate}
                  postStartDate={proposal.startDate}
                  postEndDate={proposal.endDate}
                />
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default IntendingProposals;
