import { useEffect, useState } from "react";
import { ProposalState } from "../create-proposal/page";
import { listProposalsFromIPFS } from "../actions/ipfs-actions";
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

        const transformed = result.data.map((proposal) => transformProposal(proposal));
        setProposals(transformed);
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
function transformProposal(ipfsProposal: DAOProposalData): ProposalState {
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
  };
}