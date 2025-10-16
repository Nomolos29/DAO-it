import { toast } from "react-toastify";
import { getProposalByIdFromIPFS, getCommentsFromIPFS } from "../actions/ipfs-actions";
import type { DAOProposalData, DAOCommentData } from "../lib/ipfs-service";

export async function fetchProposalById(proposalId: string): Promise<{
  proposalData: DAOProposalData | null;
  proposalComments: DAOCommentData[];
  error: Error | null;
}> {
  try {
    // Fetch proposal from IPFS using UUID
    const proposalResult = await getProposalByIdFromIPFS(proposalId);

    if (!proposalResult.success || !proposalResult.data) {
      throw new Error(proposalResult.error || 'Proposal not found');
    }

    // Fetch comments from IPFS (comments still use CID/proposalId)
    const commentsResult = await getCommentsFromIPFS(proposalId);

    const comments = commentsResult.success && commentsResult.data
      ? commentsResult.data
      : [];

    return {
      proposalData: proposalResult.data,
      proposalComments: comments,
      error: null,
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    toast.error(`Error fetching proposal: ${err.message}`);
    return { proposalData: null, proposalComments: [], error: err };
  }
}
