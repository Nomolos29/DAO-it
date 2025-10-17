import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { daoitContract } from "../lib/constants";
import { VoteOption } from "../types/types";

export const useVote = () => {
  const account = useActiveAccount();

  const vote = async (
    proposalId: string,
    option: VoteOption,
    votes: bigint
  ): Promise<void> => {
    try {
      if (!account) {
        throw new Error("No wallet connected");
      }

      // No need for approval anymore - it's handled on login by useAutoApproval
      console.log('🗳️ Submitting vote:', { proposalId, option, votes: votes.toString() });

      const voteTx = await prepareContractCall({
        contract: daoitContract,
        method: "function vote(string proposalId, uint8 option, uint256 v)",
        params: [proposalId, option, votes],
      });

      await sendAndConfirmTransaction({
        account,
        transaction: voteTx,
      });

      console.log('✅ Vote submitted successfully');
    } catch (err) {
      console.error("❌ Error voting:", err);
      throw err;
    }
  };

  return { vote };
};
