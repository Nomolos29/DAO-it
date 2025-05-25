import { useActiveAccount } from "thirdweb/react";
import { useState } from "react";
import { useProposalService, ProposalData } from "../services/proposalService";

export const useCreateProposal = () => {
  const account = useActiveAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const proposalService = useProposalService();

  const createProposal = async (
    title: string,
    description: string,
    summary: string,
    startDate: number,
    endDate: number,
    status: 'Public' | 'Private' = 'Public',
    privateStatus: 'Community' | 'Group' = 'Community',
    proposalType: 'Adoption' | 'FundRaiser' = 'Adoption',
    images?: File[]
  ): Promise<void> => {
    try {
      if (!account) {
        throw new Error("No wallet connected");
      }

      setIsLoading(true);
      setError(null);

      const proposalData: ProposalData = {
        proposalId: account.address ? `prop_${account.address.slice(-4)}_${Date.now().toString(36)}` : undefined,
        proposalTitle: title,
        proposalSummary: summary,
        proposalDetails: description,
        proposalStatus: status,
        privateStatus: privateStatus,
        proposalType: proposalType,
        endDate: new Date(endDate),
        images: images
      };

      await proposalService.createProposal(proposalData);
    } catch (err) {
      console.error("Error creating proposal:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err; // Re-throw to be handled by the caller
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProposal,
    isLoading,
    error,
  };
};
