import { apiFetchWithAuth } from "../lib/apiFetch";
import { toast } from "react-toastify";
import { ApiProposal } from "../create-proposal/page"; // or define it here
import { PostCommentModalProps } from "../types/types";

export async function fetchProposalById(proposalId: string): Promise<{
  proposalData: ApiProposal | null;
  proposalComments: PostCommentModalProps | null;
  error: Error | null;
}> {
  try {
    const response = await apiFetchWithAuth(`/Proposal/GetProposal/${proposalId}`, {
      method: "GET"
    });

    const comments = await apiFetchWithAuth(`/proposal/${proposalId}/Comment/GetAllComment`, {
      method: "GET"
    });

    const json = await response;
    const commentsJson = await comments;
    return {
      proposalData: json as ApiProposal,
      proposalComments: commentsJson as PostCommentModalProps,
      error: null,
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    toast.error(`Error fetching proposal: ${err.message}`);
    return { proposalData: null, error: err, proposalComments: null };
  }
}
