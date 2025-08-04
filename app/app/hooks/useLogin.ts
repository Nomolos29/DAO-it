import { useMutation } from "@tanstack/react-query";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { signMessage } from "thirdweb/utils";
import { apiFetch } from "../lib/apiFetch";
import Message from "../lib/Message";



export const useLogin = () => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();


  return useMutation({
    mutationFn: async () => {
      if (!account || !wallet) {
        throw new Error("Wallet not connected");
      }

      // 1. Create message and signature
      const message = Message
      const signature = await signMessage({ account, message });

      console.log("Signature:", signature);
      // 2. Call backend login endpoint
      const response = await apiFetch("/Authentication/wallet-login", {
        method: "POST",
        body: JSON.stringify({
          walletAddress: account.address,
          signature,
          message,
        }),
      });


      const { accessToken, refreshToken } = response as { accessToken: string; refreshToken: string };


      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // router.push("/app");
      return { response };
    }
  });
};
