import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { daoitContract } from "../lib/constants";
import apiClient from "../services/apiClient";
import { retryTransaction } from "../utils/blockchain";
import toast from "../utils/toast";

export const useWithdraw = () => {
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const withdraw = async (proposalId: bigint | string | number): Promise<void> => {
    try {
      if (!account) {
        throw new Error("No wallet connected");
      }

      setIsLoading(true);
      setError(null);

      // Convert to BigInt if needed
      const proposalIdBigInt = typeof proposalId === 'bigint' ? proposalId : BigInt(proposalId);

      // Withdraw tokens on the blockchain with retry mechanism
      const withdrawTx = await prepareContractCall({
        contract: daoitContract,
        method: "function withdraw(uint256 proposalId)",
        params: [proposalIdBigInt],
      });

      toast.info("Withdrawing tokens from proposal...");
      await retryTransaction(() => 
        sendAndConfirmTransaction({
          account,
          transaction: withdrawTx,
        })
      );

      // Record the withdrawal in the backend
      // In a real implementation, we would have a specific endpoint for withdrawals
      // For now, we'll just log it
      console.log(`Withdrawal recorded for proposal ${proposalId} by ${account.address}`);

      // If there was a backend endpoint for withdrawals, we would call it like this:
      // await apiClient.post('/proposal/withdraw', {
      //   proposalId: String(proposalId),
      //   userId: account.address
      // });

    } catch (err) {
      console.error("Error withdrawing tokens:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    withdraw,
    isLoading,
    error
  };
};
