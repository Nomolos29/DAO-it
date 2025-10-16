import { useMutation } from "@tanstack/react-query";
import { useConnect, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { uploadUserToIPFS, getUserFromIPFS } from "../actions/ipfs-actions";
import type { DAOUserData } from "../lib/ipfs-service";

export const useRegister = () => {
  const connect = useConnect();
  const account = useActiveAccount();

  return useMutation({
    mutationFn: async () => {
      let currentAccount = account;

      if (!currentAccount) {
        const metamask = createWallet("io.metamask");
        const connectedWallet = await connect.connect(metamask);

        if (!connectedWallet) throw new Error("Failed to connect wallet.");

        currentAccount = connectedWallet.getAccount();
      }

      if (!currentAccount) {
        throw new Error("No wallet connected");
      }

      // Check if user already exists
      console.log("🔍 Checking if wallet is already registered:", currentAccount.address);
      const existingUser = await getUserFromIPFS(currentAccount.address);

      if (existingUser.success && existingUser.data) {
        console.log("⚠️ User already registered with this wallet!");
        throw new Error("This wallet is already registered. Please login instead.");
      }

      console.log("✅ Wallet not registered yet, proceeding with registration...");

      // Create user data for IPFS
      const userData: DAOUserData = {
        walletAddress: currentAccount.address,
        profile: {},
        activity: {
          proposalsCreated: [],
          votesCount: 0,
          commentsCount: 0,
          joinedAt: Date.now(),
        },
        metadata: {
          version: '1.0.0',
          lastUpdated: Date.now(),
        },
      };

      // Upload to IPFS
      const result = await uploadUserToIPFS(userData);

      if (!result.success || !result.cid) {
        throw new Error(result.error || 'Failed to register user on IPFS');
      }

      // Store user data in localStorage
      localStorage.setItem("walletAddress", currentAccount.address);
      localStorage.setItem("userCID", result.cid);
      localStorage.setItem("user", JSON.stringify(userData));

      console.log("✅ User registered and saved to localStorage");

      // Don't navigate here - let the QuizModal handle the login flow
      // router.push("/app");

      return { cid: result.cid, userData };
    },
  });
};
