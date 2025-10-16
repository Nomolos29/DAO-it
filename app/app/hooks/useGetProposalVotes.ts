import { useState, useEffect } from "react";
import { readContract } from "thirdweb";
import { daoitContract } from "../lib/constants";

interface ProposalVotes {
  yesVotes: bigint;
  noVotes: bigint;
  abstainVotes: bigint;
  isLoading: boolean;
  error: Error | null;
}

interface BlockchainProposal {
  id: string;
  title: string;
  summary: string;
  creationTime: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  abstainVotes: bigint;
  status: number;
  proposalType: number;
  token: string;
  destination: string;
  author: string;
  targetAmount: bigint;
  endDate: bigint;
  raisedAmount: bigint;
  signatories: string[];
  userContribution: bigint;
  contributorCount: bigint;
}

export const useGetProposalVotes = (proposalId: string | undefined): ProposalVotes => {
  const [votes, setVotes] = useState<ProposalVotes>({
    yesVotes: BigInt(0),
    noVotes: BigInt(0),
    abstainVotes: BigInt(0),
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchVotes = async () => {
      if (!proposalId) {
        setVotes(prev => ({ ...prev, isLoading: false, error: new Error("No proposal ID") }));
        return;
      }

      try {
        console.log('🗳️ Fetching votes for proposal:', proposalId);

        // Call smart contract to get proposal details including vote counts
        // @ts-expect-error - Complex contract type from Thirdweb
        const proposal = (await readContract({
          contract: daoitContract,
          method: "function getProposal(string proposalId) view returns (tuple(string id, string title, string summary, uint256 creationTime, uint256 yesVotes, uint256 noVotes, uint256 abstainVotes, uint8 status, uint8 proposalType, address token, address destination, address author, uint256 targetAmount, uint256 endDate, uint256 raisedAmount, address[3] signatories, uint256 userContribution, uint256 contributorCount))",
          params: [proposalId],
        }) as unknown) as BlockchainProposal;

        console.log('✅ Votes fetched from blockchain:', {
          yes: proposal.yesVotes.toString(),
          no: proposal.noVotes.toString(),
          abstain: proposal.abstainVotes.toString()
        });

        setVotes({
          yesVotes: proposal.yesVotes,
          noVotes: proposal.noVotes,
          abstainVotes: proposal.abstainVotes,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        console.error('❌ Error fetching votes:', err);
        setVotes({
          yesVotes: BigInt(0),
          noVotes: BigInt(0),
          abstainVotes: BigInt(0),
          isLoading: false,
          error: err instanceof Error ? err : new Error("Failed to fetch votes"),
        });
      }
    };

    fetchVotes();
  }, [proposalId]);

  return votes;
};
