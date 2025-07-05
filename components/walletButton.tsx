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
      if (!account) return;

      // if (status === "login") {
        const message = Message
        try {
          const signature = await signMessage({
            message,
            account,
          });

          const { token, user } = await apiFetch<{ token: string; user: YourUserType }>("/Authentication/wallet-login", {
            method: "POST",
            body: JSON.stringify({
              walletAddress: account.address,
              signature,
              message,
            }),
          });

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          if (onConnect) onConnect("loggedIn");
        } catch (err) {
          console.log("Login failed after wallet connection", err);
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
          primaryButtonBg: "#494949",
        },
      })}
      connectModal={{ size: "compact" }}
    />
  );
};

export default WalletButton;
