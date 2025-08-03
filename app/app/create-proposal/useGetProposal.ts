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
  // @ts-ignore: Ignore type error for this line
  const proposal: Proposal | undefined = data
    ? {
        // @ts-ignore: Ignore type error for this line
        id: data[0], // Convert to number
        // @ts-ignore: Ignore type error for this line
        title: data.title, // Cast to string
        // @ts-ignore: Ignore type error for this line
        description: data.description, // Cast to string
        // @ts-ignore: Ignore type error for this line
        summary: data.summary, // Cast to string
        // @ts-ignore: Ignore type error for this line
        startDate: Number(data.startDate), // Convert to number
        // @ts-ignore: Ignore type error for this line
        endDate: Number(data.endDate), // Convert to number
        // @ts-ignore: Ignore type error for this line
        yesVotes: Number(data.yesVotes), // Convert to number
        // @ts-ignore: Ignore type error for this line
        noVotes: Number(data.noVotes), // Convert to number
        // @ts-ignore: Ignore type error for this line
        abstainVotes: Number(data.abstainVotes), // Convert to number
      }
    : undefined;

  // console.log("pt", data);

  return { proposal, isLoading, error };
};
