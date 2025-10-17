import { useProposalsContext } from "@/app/app/context/ProposalsContext";
import Post from "../Post";
import { PostSkeleton } from "../skeletons";
import EmptyState from "../EmptyState";
import { isProposalActive, getProposalStatus } from "../../lib/proposalUtils";

const ProposalsHome = () => {
  const { proposals, isLoading, error } = useProposalsContext();

  // Filter only active proposals
  const activeProposals = proposals?.filter(proposal =>
    isProposalActive(proposal.startDate)
  ) || [];

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


  if (error) {
    return (
      <main className="w-full px-2 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-red-600">Error fetching proposals: {error.message}</p>
        </div>
      </main>
    );
  }

  if (!isLoading && activeProposals.length === 0) {
    return (
      <main className="w-full px-2 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
        <EmptyState
          title="No Active Proposals"
          message="There are currently no active proposals available for voting. Check back later or create a new proposal to get started."
          showCreateButton={true}
        />
      </main>
    );
  }

  const reversedProposals = [...activeProposals].reverse();

  return (
    <main className="w-full px-2 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
      <div className="flex flex-col w-full h-[10px] gap-y-5">
        <div className="flex w-full gap-y-3 pb-5">
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

export default ProposalsHome;
