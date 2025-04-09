/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useReadContract } from "thirdweb/react";
import { daoitContract } from "../lib/constants";
import { Proposal } from "../types/types";
import { resolveMethod } from "thirdweb";

export const useGetProposal = (proposalId: number) => {
  const { data, isLoading, error } = useReadContract({
    contract: daoitContract,
    // @ts-ignore: Ignore type error for this line
    method: resolveMethod("getProposal"), // DO NOT EDIT THIS
    params: [proposalId],
  });

  const proposal: Proposal | undefined = data
    ? {
        id: Number(data[0]), // Convert to number
        title: data[1] as string, // Cast to string
        description: data[2] as string, // Cast to string
        summary: data[3] as string, // Cast to string
        startDate: Number(data[4]), // Convert to number
        endDate: Number(data[5]), // Convert to number
        yesVotes: Number(data[6]), // Convert to number
        noVotes: Number(data[7]), // Convert to number
        abstainVotes: Number(data[8]), // Convert to number
      }
    : undefined;

  console.log("pt", proposal);

  return { proposal, isLoading, error };
};
