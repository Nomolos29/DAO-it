"use client";

import {
  ConnectButton,
  lightTheme,
  useActiveAccount,
} from "thirdweb/react";
import {
  inAppWallet,
  createWallet,
} from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { signMessage } from "thirdweb/utils";
import { useEffect } from "react";
import { apiFetch } from "@/app/app/lib/apiFetch";
import Message from "@/app/app/lib/Message";
import { YourUserType } from "@/app/app/types/types";
import { toast } from "react-toastify";

const clientId =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "defaultClientId";

const client = createThirdwebClient({ clientId });

const wallets = [
  inAppWallet({
    auth: {
      options: ["google", "email", "passkey", "phone"],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

export type WalletButtonProps = {
  onConnect?: (action: "loggedIn" | "register") => void;
};



const WalletButton = ({ onConnect }: WalletButtonProps) => {
  const account = useActiveAccount();

  useEffect(() => {
    const loginAfterConnect = async () => {
      if (!account) {
        toast.error("Could not connect to wallet. Please try again.");
        return;
      }else {
        toast.success("Wallet connected successfully!\nPlease wait to sign the message.");
      }

      // if (status === "login") {
        const message = Message
        try {
          toast.success("Logging in...");
          const signature = await signMessage({
            message,
            account,
          });

          const response = await apiFetch("/Authentication/wallet-login", {
            method: "POST",
            body: JSON.stringify({
              walletAddress: account.address,
              signature,
              message,
            }),
          });


          // Store token and user in localStorage
          const { accessToken, refreshToken } = response as { accessToken: string; refreshToken: string };
          console.log("Login response:", accessToken, refreshToken);
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          if (onConnect) onConnect("loggedIn");
          toast.success("Glad to have you back!");
        } catch (err) {
          console.log("Login failed after wallet connection", err);
          toast.error("Login failed. Please register to get an account.");
          if (onConnect) onConnect("register");
        }
      // } else if (status === "register") {
      //   try {
      //     const message = Message
      //     const signature = await signMessage({
      //       message,
      //       account,
      //     });

      //     const { token, user } = await apiFetch<{ token: string; user: YourUserType }>("/Authentication/register-wallet", {
      //       method: "POST",
      //       body: JSON.stringify({
      //         walletAddress: account.address,
      //         signature,
      //         message,
      //       }),
      //     });

      //     localStorage.setItem("token", token);
      //     localStorage.setItem("user", JSON.stringify(user));

      //     if (onConnect) onConnect("register");
      //   } catch (err) {
      //     console.log("Registration failed after wallet connection", err);
      //   }
      // }
    };

    loginAfterConnect();
  }, [account]);

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      connectButton={{ label: "Get Started" }}
      theme={lightTheme({
        colors: {
          primaryButtonBg: "#1D54E1",
        },
      })}
      connectModal={{ size: "compact" }}
    />
  );
};

export default WalletButton;
