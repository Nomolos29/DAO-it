import { toast } from "react-toastify";
import { getProposalByIdFromIPFS, getCommentsFromIPFS } from "../actions/ipfs-actions";
import type { DAOProposalData, DAOCommentData } from "../lib/ipfs-service";

export async function fetchProposalById(proposalId: string): Promise<{
  proposalData: DAOProposalData | null;
  proposalComments: DAOCommentData[];
  error: Error | null;
}> {
  try {
    console.log('🔍 [fetchProposalById] Fetching proposal:', proposalId);

    // Fetch proposal from IPFS using UUID
    const proposalResult = await getProposalByIdFromIPFS(proposalId);

    if (!proposalResult.success || !proposalResult.data) {
      throw new Error(proposalResult.error || 'Proposal not found');
    }

    console.log('✅ [fetchProposalById] Proposal fetched successfully');

    // Fetch comments from IPFS (comments still use CID/proposalId)
    console.log('🔍 [fetchProposalById] Fetching comments for proposal:', proposalId);
    const commentsResult = await getCommentsFromIPFS(proposalId);

    console.log('📊 [fetchProposalById] Comments result:', commentsResult);

    const comments = commentsResult.success && commentsResult.data
      ? commentsResult.data
      : [];

    console.log('✅ [fetchProposalById] Comments fetched:', comments.length);

    return {
      proposalData: proposalResult.data,
      proposalComments: comments,
      error: null,
    };
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    console.error('❌ [fetchProposalById] Error:', err);
    toast.error(`Error fetching proposal: ${err.message}`);
    return { proposalData: null, proposalComments: [], error: err };
  }
}
