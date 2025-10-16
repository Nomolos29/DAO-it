import { useQuery } from '@tanstack/react-query';
import { getCommentsFromIPFS, getRepliesFromIPFS } from '../actions/ipfs-actions';
import type { DAOCommentData } from '../lib/ipfs-service';

/**
 * Get total reaction count for a comment
 */
function getTotalReactions(comment: DAOCommentData): number {
  return (
    comment.reactions.like.length +
    comment.reactions.love.length +
    comment.reactions.laugh.length +
    comment.reactions.sad.length +
    comment.reactions.angry.length +
    comment.reactions.celebrate.length
  );
}

/**
 * Sort comments: most liked first, then oldest first
 */
function sortComments(comments: DAOCommentData[]): DAOCommentData[] {
  return [...comments].sort((a, b) => {
    const aReactions = getTotalReactions(a);
    const bReactions = getTotalReactions(b);

    // Most liked first
    if (aReactions !== bReactions) {
      return bReactions - aReactions;
    }

    // Then oldest first (for comments with same reaction count)
    return a.createdAt - b.createdAt;
  });
}

interface UseGetCommentsOptions {
  proposalId: string;
  enabled?: boolean;
  refetchInterval?: number; // For real-time updates (in ms)
}

/**
 * Hook to fetch and sort comments for a proposal
 * Supports real-time polling
 */
export const useGetComments = ({
  proposalId,
  enabled = true,
  refetchInterval = 15000, // Refetch every 15 seconds by default
}: UseGetCommentsOptions) => {
  return useQuery({
    queryKey: ['comments', proposalId],
    queryFn: async () => {
      const result = await getCommentsFromIPFS(proposalId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch comments');
      }

      // Filter out replies (only get top-level comments)
      const topLevelComments = (result.data || []).filter(
        (comment) => !comment.parentCommentId
      );

      // Sort comments
      return sortComments(topLevelComments);
    },
    enabled: enabled && !!proposalId,
    refetchInterval, // Auto-refetch for real-time updates
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

interface UseGetRepliesOptions {
  parentCommentId: string;
  enabled?: boolean;
}

/**
 * Hook to fetch replies for a comment
 * Lazy-loaded when user expands replies
 */
export const useGetReplies = ({
  parentCommentId,
  enabled = true,
}: UseGetRepliesOptions) => {
  return useQuery({
    queryKey: ['replies', parentCommentId],
    queryFn: async () => {
      const result = await getRepliesFromIPFS(parentCommentId);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch replies');
      }

      // Sort replies by oldest first
      return (result.data || []).sort((a, b) => a.createdAt - b.createdAt);
    },
    enabled: enabled && !!parentCommentId,
    staleTime: 30000, // Replies don't change as often
  });
};

/**
 * Hook to fetch all comments by a user
 * For user profile page
 */
export const useGetUserComments = (userAddress?: string) => {
  return useQuery({
    queryKey: ['userComments', userAddress],
    queryFn: async () => {
      if (!userAddress) throw new Error('No user address provided');

      const { getCommentsByUserFromIPFS } = await import('../actions/ipfs-actions');
      const result = await getCommentsByUserFromIPFS(userAddress);

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch user comments');
      }

      return result.data || [];
    },
    enabled: !!userAddress,
    staleTime: 60000, // Cache for 1 minute
  });
};
