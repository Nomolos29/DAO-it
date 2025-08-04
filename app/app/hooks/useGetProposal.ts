import { apiFetchWithAuth } from "../lib/apiFetch";
import { toast } from "react-toastify";
import { ApiProposal } from "../create-proposal/page"; // or define it here

export async function fetchProposalById(proposalId: string): Promise<{
  proposalData: ApiProposal | null;
  error: Error | null;
}> {
  try {
    const response = await apiFetchWithAuth(`/Proposal/GetProposal/${proposalId}`, {
      method: "GET"
    });

    // if (!response.ok) {
    //   const error = new Error(`Error fetching proposal: ${response.statusText}`);
    //   toast.error(error.message);
    //   return { proposalData: null, error };
    // }

    const json = await response;

    return {
      proposalData: json as ApiProposal,
      error: null,
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    toast.error(`Error fetching proposal: ${err.message}`);
    return { proposalData: null, error: err };
  }
}
