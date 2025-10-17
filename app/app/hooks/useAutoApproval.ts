import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { readContract, prepareContractCall, sendAndConfirmTransaction } from "thirdweb";
import { tokenContract, daoitContract } from "../lib/constants";
import { toast } from "react-toastify";

interface ApprovalStatus {
  isChecking: boolean;
  isApproving: boolean;
  isApproved: boolean;
  error: Error | null;
}

/**
 * Hook to automatically approve the DAO contract to spend user's entire token balance upon login.
 * This ensures smooth UX by eliminating approval prompts during voting and proposal creation.
 */
export const useAutoApproval = () => {
  const account = useActiveAccount();
  const [status, setStatus] = useState<ApprovalStatus>({
    isChecking: false,
    isApproving: false,
    isApproved: false,
    error: null,
  });

  useEffect(() => {
    const checkAndApprove = async () => {
      if (!account) {
        setStatus({ isChecking: false, isApproving: false, isApproved: false, error: null });
        return;
      }

      try {
        setStatus(prev => ({ ...prev, isChecking: true, error: null }));

        // Step 1: Check user's token balance
        console.log("🔍 Checking token balance...");
        const balance = await readContract({
          contract: tokenContract,
          method: "function balanceOf(address account) view returns (uint256)",
          params: [account.address],
        }) as bigint;

        console.log("💰 User balance:", balance.toString());

        // If balance is 0, no need to approve
        if (balance === BigInt(0)) {
          console.log("⚠️ Balance is 0, skipping approval");
          setStatus({ isChecking: false, isApproving: false, isApproved: true, error: null });
          return;
        }

        // Step 2: Check current allowance
        console.log("🔍 Checking current allowance...");
        const currentAllowance = await readContract({
          contract: tokenContract,
          method: "function allowance(address owner, address spender) view returns (uint256)",
          params: [account.address, daoitContract.address],
        }) as bigint;

        console.log("📊 Current allowance:", currentAllowance.toString());

        // Step 3: If allowance is less than balance, request approval
        if (currentAllowance < balance) {
          console.log("⚡ Allowance insufficient, requesting approval for full balance...");
          setStatus(prev => ({ ...prev, isChecking: false, isApproving: true }));

          toast.info("🔐 Please approve token spending for seamless transactions");

          const approveTx = prepareContractCall({
            contract: tokenContract,
            method: "function approve(address spender, uint256 amount) returns (bool)",
            params: [daoitContract.address, balance],
          });

          await sendAndConfirmTransaction({
            account,
            transaction: approveTx,
          });

          console.log("✅ Approval successful!");
          toast.success("✅ Token approval confirmed! You can now vote and create proposals seamlessly.");
          setStatus({ isChecking: false, isApproving: false, isApproved: true, error: null });
        } else {
          console.log("✅ Already approved");
          setStatus({ isChecking: false, isApproving: false, isApproved: true, error: null });
        }
      } catch (err) {
        console.error("❌ Error during approval check:", err);
        const error = err instanceof Error ? err : new Error("Failed to check/approve tokens");
        setStatus({ isChecking: false, isApproving: false, isApproved: false, error });

        // Don't show error toast if user rejected the transaction
        if (!error.message.includes("User rejected")) {
          toast.error(`Token approval failed: ${error.message}`);
        }
      }
    };

    checkAndApprove();
  }, [account]);

  return status;
};
