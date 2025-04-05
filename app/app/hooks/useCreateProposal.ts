import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { daoitContract } from "../lib/constants";

export const useCreateProposal = () => {
  const account = useActiveAccount();
  const isPending = false;

  const createProposal = async (
    title: string,
    description: string,
    summary: string,
    startDate: number,
    endDate: number
  ): Promise<void> => {
    try {
      if (!account) {
        throw new Error("No wallet connected");
      }

      const proposalTx = await prepareContractCall({
        contract: daoitContract,
        method:
          "function propose(string memory title, string memory description, string memory summary, uint256 startDate, uint256 endDate)",
        params: [
          title,
          description,
          summary,
          BigInt(startDate),
          BigInt(endDate),
        ],
      });

      // Send and confirm the transaction in one step
      await sendAndConfirmTransaction({
        account,
        transaction: proposalTx,
      });
    } catch (err) {
      console.error("Error creating proposal:", err);
      throw err; // Re-throw to be handled by the caller
    }
  };

  return {
    createProposal,
    isLoading: isPending,
    error: null,
  };
};
