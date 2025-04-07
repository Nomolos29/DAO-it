import { useReadContract } from "thirdweb/react";
import { daoitContract } from "../lib/constants";
import { resolveMethod } from "thirdweb";

export interface Proposal {
  id: number;
  title: string;
  description: string;
  summary: string;
  startDate: number; // Timestamp when voting starts
  endDate: number; // Timestamp when voting ends
  yesVotes: number; // Total votes for Yes
  noVotes: number; // Total votes for No
  abstainVotes: number; // Total votes for Abstain
}

export function useGetAllProposals() {
  console.log("Initializing useAllProposals hook");
  console.log("daoitContract:", daoitContract);

  const { data, isLoading, error } = useReadContract({
    contract: daoitContract,
    method: resolveMethod("getAllProposals"), // DO NOT EDIT THIS
  });

  console.log("Contract read state:", {
    data: data,
    isLoading: isLoading,
    error: error ? error.toString() : "null",
  });

  const proposals: Proposal[] = [];

  if (data) {
    console.log("Raw data from contract:", data);
    try {
      if (Array.isArray(data)) {
        data.forEach((item, index) => {
          console.log(`Processing item ${index}:`, item);

          const proposal: Proposal = {
            id: Number(item.id || 0),
            title: item.title || "",
            description: item.description || "",
            summary: item.summary || "",
            startDate: Number(item.startDate || 0),
            endDate: Number(item.endDate || 0),
            yesVotes: Number(item.yesVotes || 0),
            noVotes: Number(item.noVotes || 0),
            abstainVotes: Number(item.abstainVotes || 0),
          };

          proposals.push(proposal);
        });
      } else {
        console.error("Contract data is not an array:", data);
      }
    } catch (transformError) {
      console.error("Error transforming proposal data:", transformError);
    }
  }

  console.log("Transformed proposals:", proposals);

  return {
    proposals,
    isLoading,
    error,
  };
}
