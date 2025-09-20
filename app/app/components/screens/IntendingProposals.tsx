

import { useGetAllProposals } from "@/app/app/hooks/useGetAllProposals";
import Post from "../Post";

const IntendingProposals = () => {
  const { proposals, isLoading, error } = useGetAllProposals();

  // Handle loading state
  if (isLoading) {
    return <div>Loading proposals...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error fetching proposals: {error.message}</div>;
  }

  return (
    <main className="w-full px-2 md:px-4 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
      <div className="flex flex-col w-full h-[10px] gap-y-5">
        <div className="flex w-full gap-y-3">
          <div className="flex flex-col w-full gap-3">
            {proposals?.map((proposal, index) => (
              <Post
                key={index}
                id={proposal.id}
                title={proposal.title}
                postBy={proposal.id}
                postImage={true}
                // postType="proposal"
                postComments={286}
                postStatus={"active"}
                postDislikes={20}
                profilePic={true}
                postLikes={100}
                description={proposal.summary}
                postCreationDate={proposal.startDate}
                postStartDate={proposal.startDate}
                postEndDate={proposal.endDate}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default IntendingProposals;
