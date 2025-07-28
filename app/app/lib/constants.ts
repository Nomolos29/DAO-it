/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getContract, createThirdwebClient } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import daoitabi from "../abi/daoi.json";
import { parseUnits } from "ethers";

export const client = createThirdwebClient({
  clientId:
    process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ||
    "68e77509b173a1cf92aff87441d10f5c",
});

export const daoitContract = getContract({
  client,
  chain: baseSepolia,
  address: process.env.NEXT_PUBLIC_DAO_CONTRACT_ADDRESS || "",
  // @ts-ignore: Ignore type error for this line
  abi: daoitabi,
});

export const tokenContract = getContract({
  address: process.env.NEXT_PUBLIC_DAOIT_TOKEN_ADDRESS || "",
  chain: baseSepolia,
  client,
});

export const PROPOSAL_DEPOSIT = parseUnits("10", 18);

// 0x117AdcBad2171Eb68E1E6bCf1C71376EA24c63Fc

// export const DAOIT = "0x807f4535F256eAD8a2bb3e3F9829BBEBF424c14f";
// export const TOKENADDRESS = "0x9512046c010c0e3Ec0b15BaD3f6e7c222CDeAd80";
