/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from "react";
import { useReadContract } from "thirdweb/react";
import { daoitContract } from "../lib/constants";
import { Proposal } from "../types/types";
import { resolveMethod } from "thirdweb";
import { useProposalService } from "../services/proposalService";

export const useGetProposal = (proposalId: number | string) => {
  const [backendProposal, setBackendProposal] = useState<any | null>(null);
  const [isBackendLoading, setIsBackendLoading] = useState(false);
  const [backendError, setBackendError] = useState<Error | null>(null);
  const proposalService = useProposalService();

  // Get proposal from blockchain
  const { data, isLoading: isBlockchainLoading, error: blockchainError } = useReadContract({
    contract: daoitContract,
    // @ts-ignore: Ignore type error for this line
    method: resolveMethod("getProposal"),
    params: [proposalId],
  });

  // Get proposal from backend API
  useEffect(() => {
    const fetchBackendProposal = async () => {
      try {
        setIsBackendLoading(true);
        const result = await proposalService.getProposal(String(proposalId));
        setBackendProposal(result);
      } catch (error) {
        console.error(`Error fetching proposal ${proposalId} from backend:`, error);
        setBackendError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsBackendLoading(false);
      }
    };

    fetchBackendProposal();
  }, [proposalId, proposalService]);

  // Process blockchain proposal
  // @ts-ignore: Ignore type error for this line
  const blockchainProposal: Proposal | undefined = data
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

  // Merge proposals from both sources
  // In a real implementation, we would properly merge the data
  let mergedProposal: Proposal | undefined = blockchainProposal;

  // If we have backend data but no blockchain data, use the backend data
  if (!mergedProposal && backendProposal) {
    mergedProposal = {
      id: backendProposal.id || backendProposal.proposalId || proposalId,
      title: backendProposal.title || backendProposal.proposalTitle || "",
      description: backendProposal.description || backendProposal.proposalDetails || "",
      summary: backendProposal.summary || backendProposal.proposalSummary || "",
      startDate: backendProposal.startDate || backendProposal.createdAt || Date.now(),
      endDate: backendProposal.endDate || 0,
      yesVotes: backendProposal.yesVotes || 0,
      noVotes: backendProposal.noVotes || 0,
      abstainVotes: backendProposal.abstainVotes || 0,
    };
  }
  // If we have both, we could merge them here

  const isLoading = isBlockchainLoading || isBackendLoading;
  const error = blockchainError || backendError;

  return { 
    proposal: mergedProposal, 
    isLoading, 
    error 
  };
};
