import { useMutation } from "@tanstack/react-query";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { getUserFromIPFS } from "../actions/ipfs-actions";

export const useLogin = () => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  return useMutation({
    mutationFn: async () => {
      if (!account || !wallet) {
        throw new Error("Wallet not connected");
      }

      console.log("🔐 Login attempt for wallet:", account.address);

      // Fetch user from IPFS
      const result = await getUserFromIPFS(account.address);

      console.log("📥 Login - getUserFromIPFS result:", result);

      if (!result.success || !result.data) {
        console.log("❌ Login failed - user not found in IPFS");
        throw new Error(result.error || "User not found. Please register first.");
      }

      console.log("✅ Login successful - user found:", result.data.walletAddress);

      // Store user data in localStorage
      localStorage.setItem("walletAddress", account.address);
      localStorage.setItem("user", JSON.stringify(result.data));

      return { userData: result.data };
    }
  });
};
