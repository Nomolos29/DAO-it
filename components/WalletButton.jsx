"use client"


import React, { useState, useEffect } from "react";
import { useActiveAccount, useWalletBalance, ConnectButton } from "thirdweb/react";
import { createWallet, inAppWallet } from "thirdweb/wallets";
import { Sepolia } from "@thirdweb-dev/chains";
import { FaChevronDown, FaChevronUp, FaCopy } from "react-icons/fa";
import { createThirdwebClient } from "thirdweb";
import { useGlobalStore } from "../../store/globalStore"; // Import the Zustand store

const clientId = "68e77509b173a1cf92aff87441d10f5c";
const client = createThirdwebClient({ clientId });

const wallets = [
  inAppWallet({ recommended: true }),
  createWallet("io.metamask"),
];

const WalletButton = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const account = useActiveAccount();
  const { data: balance, isLoading } = useWalletBalance({
    client,
    chain: Sepolia,
    address: account?.address,
  });

  const { setWalletInfo } = useGlobalStore();

  useEffect(() => {
    setWalletInfo(account?.address || null);
  }, [account?.address, setWalletInfo]);

  const toggleMinimize = () => setIsMinimized(!isMinimized);

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
    }
  };

//   if (isMinimized) {
//     return (
//       <button 
//         onClick={toggleMinimize}
//         className="fixed bottom-4 left-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50"
//         title="Expand wallet info"
//       >
//         <FaChevronUp className="text-gray-600" />
//       </button>
//     );
//   }

  return (
    <div className="relative">
      <ConnectButton client={client} wallets={wallets} theme="light" modalSize="wide" />
    </div>
  );
};

export default WalletButton;
