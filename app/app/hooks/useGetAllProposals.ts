import { useReadContract } from "thirdweb/react";
import { daoitContract } from "../lib/constants";
import { Proposal } from "../types/types";

export const useGetAllProposals = () => {
  const { data, isLoading, error } = useReadContract({
    contract: daoitContract,
    method:
      "function getAllProposals() view returns ((uint256 id, address proposer, string title, string description, string summary, uint256 startDate, uint256 endDate, uint256 yesVotes, uint256 noVotes, uint256 abstainVotes)[])",
    params: [],
  });

  // Map the raw array data to an array of Proposal objects
  const proposals: Proposal[] = data
    ? data.map((p) => ({
        id: p[0],
        proposer: p[1],
        title: p[2],
        description: p[3],
        summary: p[4],
        startDate: p[5],
        endDate: p[6],
        yesVotes: p[7],
        noVotes: p[8],
        abstainVotes: p[9],
      }))
    : [];

  return { proposals, isLoading, error };
};
