import { createThirdwebClient } from "thirdweb";
import { ConnectButton, lightTheme } from "thirdweb/react";

import { inAppWallet, createWallet } from "thirdweb/wallets";

const clientId =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "defaultClientId";
const client = createThirdwebClient({ clientId });

const wallets = [
  inAppWallet({
    auth: {
      options: [
        "google",
        "telegram",
        "farcaster",
        "email",
        "x",
        "passkey",
        "phone",
      ],
    },
  }),
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
  createWallet("me.rainbow"),
  createWallet("io.rabby"),
  createWallet("io.zerion.wallet"),
];

const WalletButton = () => {
  return (
    <ConnectButton
      client={client}
      wallets={wallets}
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
