import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { daoitContract, tokenContract } from "../lib/constants";
import { VoteOption } from "../types/types";

export const useVote = () => {
  const account = useActiveAccount();

  const vote = async (
    proposalId: bigint,
    option: VoteOption,
    votes: bigint
  ): Promise<void> => {
    try {
      if (!account) {
        throw new Error("No wallet connected");
      }

      const tokensToLock = votes * votes;

      const approveTx = await prepareContractCall({
        contract: tokenContract,
        method:
          "function approve(address spender, uint256 amount) returns (bool)",
        params: [daoitContract.address, tokensToLock],
      });

      await sendAndConfirmTransaction({
        account,
        transaction: approveTx,
      });

      const voteTx = await prepareContractCall({
        contract: daoitContract,
        method: "function vote(uint256 proposalId, uint8 option, uint256 v)",
        params: [proposalId, option, votes],
      });

      await sendAndConfirmTransaction({
        account,
        transaction: voteTx,
      });
    } catch (err) {
      console.error("Error voting:", err);
      throw err;
    }
  };

  return { vote };
};
