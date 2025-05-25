import { useState, useEffect } from "react";
import { useReadContract } from "thirdweb/react";
import { daoitContract } from "../lib/constants";
import { Proposal } from "../types/types";
import { resolveMethod } from "thirdweb";
import { useProposalService } from "../services/proposalService";

export const useGetPendingProposals = () => {
  const [backendProposals, setBackendProposals] = useState<any[]>([]);
  const [isBackendLoading, setIsBackendLoading] = useState(false);
  const [backendError, setBackendError] = useState<Error | null>(null);
  const proposalService = useProposalService();

  // Get pending proposals from blockchain
  const { data, isLoading: isBlockchainLoading, error: blockchainError } = useReadContract({
    contract: daoitContract,
    // @ts-ignore: Ignore type error for this line
    method: resolveMethod("getPendingProposals"),
    params: [],
  });

  // Get proposals from backend API
  useEffect(() => {
    const fetchBackendProposals = async () => {
      try {
        setIsBackendLoading(true);
        const result = await proposalService.getAllProposals();
        
        // Filter for pending proposals
        // In a real implementation, we would have a specific endpoint for pending proposals
        // or filter criteria to identify pending proposals
        const now = Date.now();
        const pendingProposals = Array.isArray(result) 
          ? result.filter(p => {
              const endDate = p.endDate || p.EndDate;
              return endDate && new Date(endDate).getTime() > now;
            })
          : [];
          
        setBackendProposals(pendingProposals);
      } catch (error) {
        console.error("Error fetching pending proposals from backend:", error);
        setBackendError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        setIsBackendLoading(false);
      }
    };

    fetchBackendProposals();
  }, [proposalService]);

  // Process blockchain proposals
  const blockchainProposals: Proposal[] = [];
  if (data) {
    try {
      if (Array.isArray(data)) {
        data.forEach((item) => {
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

          blockchainProposals.push(proposal);
        });
      }
    } catch (transformError) {
      console.error("Error transforming blockchain proposal data:", transformError);
    }
  }

  // Merge proposals from both sources
  const mergedProposals = [...blockchainProposals];
  
  // Add backend proposals that aren't already in the blockchain list
  backendProposals.forEach(backendProposal => {
    const backendId = backendProposal.id || backendProposal.proposalId;
    const exists = mergedProposals.some(p => String(p.id) === String(backendId));
    
    if (!exists) {
      mergedProposals.push({
        id: backendId,
        title: backendProposal.title || backendProposal.proposalTitle || "",
        description: backendProposal.description || backendProposal.proposalDetails || "",
        summary: backendProposal.summary || backendProposal.proposalSummary || "",
        startDate: backendProposal.startDate || backendProposal.createdAt || Date.now(),
        endDate: backendProposal.endDate || 0,
        yesVotes: backendProposal.yesVotes || 0,
        noVotes: backendProposal.noVotes || 0,
        abstainVotes: backendProposal.abstainVotes || 0,
      });
    }
  });

  // Sort by newest first
  mergedProposals.sort((a, b) => Number(b.startDate) - Number(a.startDate));

  const isLoading = isBlockchainLoading || isBackendLoading;
  const error = blockchainError || backendError;

  return {
    pendingProposals: mergedProposals,
    isLoading,
    error,
  };
};
