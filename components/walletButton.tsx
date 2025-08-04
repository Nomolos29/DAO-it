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
        toast.info("Please connect your wallet..");
        return;
      }else {
        toast.success("Wallet connected successfully!\nPlease wait to sign the message.");
      }

      // if (status === "login") {
        const message = Message
        try {
          const signature = await signMessage({
            message,
            account,
          });

          toast.success("Logging in...");

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


          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);

          if (onConnect) onConnect("loggedIn");
          toast.success("Glad to have you back!");
        } catch (err) {
          toast.error("Login failed. Please register to get an account.");
          if (onConnect) onConnect("register");
        }
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
