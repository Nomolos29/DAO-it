/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getContract, createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import daoitabi from "../abi/daoi.json";

// Create a custom Sepolia chain configuration with our custom RPC URL
const customSepolia = {
  ...sepolia,
  rpc: process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://base-sepolia.drpc.org"
};

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "defaultClientId",
  secretKey: process.env.NEXT_PUBLIC_THIRDWEB_SECRET_KEY,
});

export const daoitContract = getContract({
  address: process.env.NEXT_PUBLIC_DAO_CONTRACT_ADDRESS || "0x117AdcBad2171Eb68E1E6bCf1C71376EA24c63Fc",
  chain: customSepolia, // Use our custom chain with the new RPC endpoint
  client,
  // @ts-ignore: Ignore type error for this line
  abi: daoitabi,
});

export const tokenContract = getContract({
  address: "0x9512046c010c0e3Ec0b15BaD3f6e7c222CDeAd80",
  chain: customSepolia, // Use our custom chain with the new RPC endpoint
  client,
});

export const DAOIT = "0x807f4535F256eAD8a2bb3e3F9829BBEBF424c14f";
export const TOKENADDRESS = "0x9512046c010c0e3Ec0b15BaD3f6e7c222CDeAd80";
