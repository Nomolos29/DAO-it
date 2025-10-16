"use client";

import {
  ConnectButton,
  lightTheme,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";
import {
  inAppWallet,
  createWallet,
} from "thirdweb/wallets";
import { createThirdwebClient } from "thirdweb";
import { signMessage } from "thirdweb/utils";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { getUserFromIPFS } from "@/app/app/actions/ipfs-actions";
import Message from "@/app/app/lib/Message";
import { baseSepolia } from "thirdweb/chains";

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
  const wallet = useActiveWallet();
  const activeChain = useActiveWalletChain();

  useEffect(() => {
    const loginAfterConnect = async () => {
      if (!account) {
        return;
      }

      // Step 1: Check and switch to Base Sepolia network
      try {
        const chainId = activeChain?.id;
        console.log("🔗 Current chain ID:", chainId);
        console.log("🔗 Required chain ID:", baseSepolia.id);

        if (chainId !== baseSepolia.id) {
          console.log("⚠️ Wrong network detected. Switching to Base Sepolia...");
          toast.info("Switching to Base Sepolia network...");

          if (!wallet) {
            toast.error("Unable to switch network. Please switch to Base Sepolia manually.");
            return;
          }

          try {
            await wallet.switchChain(baseSepolia);
            console.log("✅ Successfully switched to Base Sepolia");
            toast.success("Switched to Base Sepolia!");
          } catch (switchError: unknown) {
            console.error("❌ Failed to switch network:", switchError);

            // If the error is about network not being added, help user add it
            const errorMessage = switchError instanceof Error ? switchError.message : String(switchError);
            if (errorMessage.includes("Unrecognized chain") || errorMessage.includes("not found")) {
              toast.error("Please add Base Sepolia network to your wallet and try again.");
            } else {
              toast.error("Failed to switch network. Please switch to Base Sepolia manually.");
            }
            return;
          }
        } else {
          console.log("✅ Already on Base Sepolia network");
        }
      } catch (networkError) {
        console.error("❌ Network check error:", networkError);
        toast.error("Error checking network. Please ensure you're on Base Sepolia.");
        return;
      }

      // Check if user is already logged in with this wallet
      const storedWallet = localStorage.getItem("walletAddress");
      const storedUser = localStorage.getItem("user");

      if (storedWallet === account.address && storedUser) {
        console.log("✅ User already logged in from localStorage");
        try {
          JSON.parse(storedUser); // Validate JSON
          if (onConnect) onConnect("loggedIn");
          toast.success("Welcome back!");
          return;
        } catch (err) {
          console.error("❌ Failed to parse stored user data:", err);
          // Clear invalid data and continue with normal login flow
          localStorage.removeItem("user");
        }
      }

      toast.info("Wallet connected! Please sign the message to continue...");

      try {
        // Step 1: Sign message to verify wallet ownership
        const message = Message;
        console.log("🔐 Requesting signature...");
        const signature = await signMessage({
          message,
          account,
        });
        console.log("✅ Signature obtained:", signature.slice(0, 20) + "...");

        toast.info("Verifying signature and checking account...");

        // Step 2: Attempt to fetch user from IPFS
        console.log("🔍 Checking if user exists in IPFS:", account.address);
        const result = await getUserFromIPFS(account.address);
        console.log("📥 IPFS result:", result);

        if (!result.success || !result.data) {
          // User not found in IPFS, needs to register
          console.log("⚠️ User not found, redirecting to registration");
          toast.info("Account not found. Please complete registration.");
          if (onConnect) {
            console.log("🔄 Calling onConnect('register')");
            onConnect("register");
          } else {
            console.error("❌ onConnect callback is undefined!");
          }
          return;
        }

        // Step 3: User found, log them in
        console.log("✅ User found in IPFS, logging in");
        localStorage.setItem("walletAddress", account.address);
        localStorage.setItem("user", JSON.stringify(result.data));
        localStorage.setItem("signature", signature);

        if (onConnect) onConnect("loggedIn");
        toast.success("Welcome back!");
      } catch (err) {
        console.error("❌ Auto-login error:", err);
        toast.error(`Login failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        if (onConnect) {
          console.log("🔄 Error occurred, calling onConnect('register')");
          onConnect("register");
        }
      }
    };

    loginAfterConnect();
  }, [account, wallet, activeChain, onConnect]);

  return (
    <ConnectButton
      client={client}
      wallets={wallets}
      chain={baseSepolia}
      connectButton={{ label: "Get Started" }}
      theme={lightTheme({
        colors: {
          primaryButtonBg: "#1D54E1",
        },
      })}
      connectModal={{
        size: "compact",
        title: "Connect to DAO-it",
        showThirdwebBranding: false,
      }}
    />
  );
};

export default WalletButton;
