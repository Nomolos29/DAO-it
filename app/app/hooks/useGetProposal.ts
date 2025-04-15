/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useReadContract } from "thirdweb/react";
import { daoitContract } from "../lib/constants";
import { Proposal } from "../types/types";
import { resolveMethod } from "thirdweb";

export const useGetProposal = (proposalId: number) => {
  const { data, isLoading, error } = useReadContract({
    contract: daoitContract,
    // @ts-ignore: Ignore type error for this line
    method: resolveMethod("getProposal"),
    params: [proposalId],
  });

  const proposal: Proposal | undefined = data
    ? {
        id: data[0], // Convert to number
        title: data.title, // Cast to string
        description: data.description, // Cast to string
        summary: data.summary, // Cast to string
        startDate: Number(data.startDate), // Convert to number
        endDate: Number(data.endDate), // Convert to number
        yesVotes: Number(data.yesVotes), // Convert to number
        noVotes: Number(data.noVotes), // Convert to number
        abstainVotes: Number(data.abstainVotes), // Convert to number
      }
    : undefined;

  // console.log("pt", data);

  return { proposal, isLoading, error };
};
