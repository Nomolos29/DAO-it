import { useState, useEffect } from "react";
import { readContract } from "thirdweb";
import { daoitContract } from "../lib/constants";
import daoitAbi from "../abi/daoi.json";

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
        // Find the getProposal function from the ABI
        const getProposalAbi = daoitAbi.find(
          (item) => item.type === 'function' && item.name === 'getProposal'
        );

        if (!getProposalAbi) {
          throw new Error('getProposal function not found in ABI');
        }

        const proposal = (await readContract({
          contract: daoitContract,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          method: getProposalAbi as any,
          params: [proposalId],
        })) as unknown as BlockchainProposal;

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
