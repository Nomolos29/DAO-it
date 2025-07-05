// hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  useConnect,
  useActiveAccount,
} from "thirdweb/react";
import { signMessage } from "thirdweb/utils";
import { createWallet } from "thirdweb/wallets"; // ✅ Correct way now
import { apiFetch } from "../lib/apiFetch";
import Message from "../lib/Message";
import { YourUserType } from "../types/types";

export const useRegister = () => {
  const router = useRouter();
  const connect = useConnect();
  const account = useActiveAccount();

  return useMutation({
    mutationFn: async () => {
      let currentAccount = account;

      if (!currentAccount) {
        const metamask = createWallet("io.metamask"); // ✅ Create instance
        const connectedWallet = await connect.connect(metamask); // connect

        if (!connectedWallet) throw new Error("Failed to connect wallet.");

        currentAccount = connectedWallet.getAccount(); // ✅ Use getAccount on returned wallet
      }

        if (!currentAccount) {
            throw new Error("No wallet connected");
        }

      const message = Message
      const signature = await signMessage({
        message,
        account: currentAccount,
      });

      const { token, user } = await apiFetch<{ token: string; user: YourUserType }>("/Authentication/register-wallet", {
        method: "POST",
        body: JSON.stringify({
          walletAddress: currentAccount.address,
          signature,
          message,
        }),
      });

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      router.push("/app");

      return { token, user };
    },
  });
};
