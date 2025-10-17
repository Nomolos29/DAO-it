import { useEffect, useState } from "react";
import { ProposalState } from "../create-proposal/page";
import { listProposalsFromIPFS, getCommentsFromIPFS, getProposalReactionCounts } from "../actions/ipfs-actions";
import type { DAOProposalData } from "../lib/ipfs-service";

export const useGetAllProposals = () => {
  const [proposals, setProposals] = useState<ProposalState[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setIsLoading(true);

        // Fetch from IPFS (active proposals)
        const result = await listProposalsFromIPFS('active');

        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to fetch proposals');
        }

        // Fetch comments AND reactions for each proposal
        const proposalsWithData = await Promise.all(
          result.data.map(async (proposal) => {
            // Fetch comments
            const commentsResult = await getCommentsFromIPFS(proposal.proposalId);
            const comments = commentsResult.success ? commentsResult.data || [] : [];

            // Fetch proposal reactions from separate storage
            const reactionsResult = await getProposalReactionCounts(proposal.proposalId);
            const reactionCounts = reactionsResult.success && reactionsResult.counts
              ? reactionsResult.counts
              : { like: 0, dislike: 0 };

            return transformProposal(proposal, comments.length, reactionCounts.like, reactionCounts.dislike);
          })
        );

        setProposals(proposalsWithData);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return { proposals, isLoading, error };
};

// Transformation function
function transformProposal(
  ipfsProposal: DAOProposalData,
  commentCount: number = 0,
  totalLikes: number = 0,
  totalDislikes: number = 0
): ProposalState {
  return {
    id: ipfsProposal.proposalId, // Use UUID as the proposal ID for routing
    title: ipfsProposal.title,
    summary: ipfsProposal.summary,
    proposalContent: ipfsProposal.content,
    visibility: ipfsProposal.visibility,
    proposalType: ipfsProposal.proposalType,
    startDate: ipfsProposal.createdAt,
    endDate: ipfsProposal.endDate,
    walletAddress: ipfsProposal.proposer,
    targetLocation: '',
    commentCount,
    totalLikes,
    totalDislikes,
  };
}