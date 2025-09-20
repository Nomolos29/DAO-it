import { useEffect, useState } from "react";
import { ApiProposal, ProposalState } from "../create-proposal/page";
import { apiFetchWithAuth } from "../lib/apiFetch";
import { comment } from "postcss";

export const useGetAllProposals = () => {
  const [proposals, setProposals] = useState<ApiProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setIsLoading(true);

        // Make the API call
        const result = await apiFetchWithAuth("/Proposal/GetAllEntities", {
          method: "GET",
        });

        // Handle case where apiFetchWithAuth already parses JSON
        if (Array.isArray(result)) {
          const transformed = result.map(transformProposal);
          setProposals(transformed);
          setIsLoading(false);
          return;
        }

        // Handle case where we get a Response object
        if (result instanceof Response) {
          if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
          }
          const data: ApiProposal[] = await result.json();
          // const transformed = data.map(transformProposal);
          setProposals(data);
          setIsLoading(false);
          return;
        }

        throw new Error('Unexpected response format');
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return { proposals, isLoading, error };
};

// Transformation function
function transformProposal(apiProposal: ApiProposal): ApiProposal {
  return {
    proposalId: apiProposal.proposalId,
    proposalTitle: apiProposal.proposalTitle,
    proposalSummary: apiProposal.proposalSummary,
    proposalDetails: apiProposal.proposalDetails,
    proposalStatus: apiProposal.proposalStatus,
    proposalType: apiProposal.proposalType,
    createdAt: apiProposal.createdAt,
    endDate: apiProposal.endDate,
    userId: apiProposal.userId,
    privateStatus: apiProposal.privateStatus,
    comments: apiProposal.comments,
    abdoptionOption: apiProposal.abdoptionOption,
    fundRaiserOption: apiProposal.fundRaiserOption,
    imageFilePath: apiProposal.imageFilePath,
    reactions: apiProposal.reactions
    // Map any additional fields here
  };
}