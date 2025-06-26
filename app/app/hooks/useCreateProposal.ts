import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { daoitContract } from "../lib/constants";

export const useCreateProposal = () => {
  const account = useActiveAccount();
  const isPending = false;

  const createProposal = async (
    title: string,
    description: string,
    summary: string
  ): Promise<void> => {
    try {
      if (!account) {
        throw new Error("No wallet connected");
      }

      const proposalTx = await prepareContractCall({
        contract: daoitContract,
        method:
          "function propose(string memory id, string memory title, string memory summary)",
        params: [
          title,
          description,
          summary,
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
