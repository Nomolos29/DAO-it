import { getContract, createThirdwebClient } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import daoitabi from "../abi/daoi.json";

export const client = createThirdwebClient({
  clientId:
    process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ||
    "68e77509b173a1cf92aff87441d10f5c",
});

export const daoitContract = getContract({
  address: "0x807f4535F256eAD8a2bb3e3F9829BBEBF424c14f",
  chain: sepolia,
  client,
  abi: daoitabi,
});

export const tokenContract = getContract({
  address: "0x9512046c010c0e3Ec0b15BaD3f6e7c222CDeAd80",
  chain: sepolia,
  client,
});

export const DAOIT = "0x807f4535F256eAD8a2bb3e3F9829BBEBF424c14f";
export const TOKENADDRESS = "0x9512046c010c0e3Ec0b15BaD3f6e7c222CDeAd80";
