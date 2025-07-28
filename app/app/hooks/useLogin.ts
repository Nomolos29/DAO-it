import { useMutation } from "@tanstack/react-query";
import { useActiveAccount, useActiveWallet } from "thirdweb/react";
import { signMessage } from "thirdweb/utils";
import { apiFetch } from "../lib/apiFetch";
import Message from "../lib/Message";
import { YourUserType } from "../types/types";



export const useLogin = () => {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  console.log("Please connect your wallet to login");

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

      console.log("Login response:", response);

      // 3. Store auth and redirect
      // localStorage.setItem("token", token);
      // localStorage.setItem("user", JSON.stringify(user));

      // router.push("/app");
      return { response };
    },
    // onSuccess: () => {
    //   if (onSuccessCallback) {
    //     onSuccessCallback(); // 👈 Automatically notify login success
    //   }
    // },
  });
};
