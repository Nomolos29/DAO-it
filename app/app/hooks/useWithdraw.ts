import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { daoitContract } from "../lib/constants";

export const useWithdraw = () => {
  const account = useActiveAccount();

  const withdraw = async (proposalId: bigint): Promise<void> => {
    try {
      if (!account) {
        throw new Error("No wallet connected");
      }

      const withdrawTx = await prepareContractCall({
        contract: daoitContract,
        method: "function withdraw(uint256 proposalId)",
        params: [proposalId],
      });

      await sendAndConfirmTransaction({
        account,
        transaction: withdrawTx,
      });
    } catch (err) {
      console.error("Error withdrawing tokens:", err);
      throw err;
    }
  };

  return { withdraw };
};
