import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { daoitContract, tokenContract } from "../lib/constants";
import { VoteOption } from "../types/types";
import apiClient from "../services/apiClient";
import { retryTransaction } from "../utils/blockchain";
import toast from "../utils/toast";

export const useVote = () => {
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const vote = async (
    proposalId: bigint | string | number,
    option: VoteOption,
    votes: bigint | number
  ): Promise<void> => {
    try {
      if (!account) {
        throw new Error("No wallet connected");
      }

      setIsLoading(true);
      setError(null);

      // Convert to BigInt if needed
      const proposalIdBigInt = typeof proposalId === 'bigint' ? proposalId : BigInt(proposalId);
      const votesBigInt = typeof votes === 'bigint' ? votes : BigInt(votes);
      const tokensToLock = votesBigInt * votesBigInt;

      // First, approve tokens for the contract with retry mechanism
      const approveTx = await prepareContractCall({
        contract: tokenContract,
        method:
          "function approve(address spender, uint256 amount) returns (bool)",
        params: [daoitContract.address, tokensToLock],
      });

      toast.info("Approving tokens for voting...");
      await retryTransaction(() => 
        sendAndConfirmTransaction({
          account,
          transaction: approveTx,
        })
      );

      // Then, vote on the blockchain with retry mechanism
      const voteTx = await prepareContractCall({
        contract: daoitContract,
        method: "function vote(uint256 proposalId, uint8 option, uint256 v)",
        params: [proposalIdBigInt, option, votesBigInt],
      });

      toast.info("Submitting vote to blockchain...");
      await retryTransaction(() => 
        sendAndConfirmTransaction({
          account,
          transaction: voteTx,
        })
      );

      // Finally, record the vote in the backend
      // In a real implementation, we would have a specific endpoint for voting
      // For now, we'll just use a proposal reaction as a placeholder
      await apiClient.post('/proposal/ProposalReaction/react', {
        proposalId: String(proposalId),
        userId: account.address,
        isLike: option === VoteOption.Yes // Simplistic mapping of vote to like/dislike
      });

    } catch (err) {
      console.error("Error voting:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    vote,
    isLoading,
    error
  };
};
