import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveAccount } from 'thirdweb/react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { uploadCommentToIPFS } from '../actions/ipfs-actions';
import type { DAOCommentData } from '../lib/ipfs-service';

interface PostCommentInput {
  proposalId: string;
  text: string;
  parentCommentId?: string | null;
  attachments?: DAOCommentData['attachments'];
  formatting?: DAOCommentData['formatting'];
}

/**
 * Hook to post a comment or reply with optimistic updates
 */
export const usePostComment = () => {
  const account = useActiveAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: PostCommentInput) => {
      if (!account) {
        throw new Error('Wallet not connected');
      }

      const commentId = uuidv4();
      const now = Date.now();

      const commentData: DAOCommentData = {
        commentId,
        proposalId: input.proposalId,
        author: account.address,
        text: input.text,
        createdAt: now,
        parentCommentId: input.parentCommentId || null,
        reactions: {
          like: [],
          love: [],
          laugh: [],
          sad: [],
          angry: [],
          celebrate: [],
        },
        attachments: input.attachments,
        formatting: input.formatting,
        metadata: {
          version: '1.0.0',
          isEdited: false,
        },
      };

      // Upload comment to IPFS
      const result = await uploadCommentToIPFS(commentData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to upload comment');
      }

      // If this is a reply, create notification for parent comment author
      if (input.parentCommentId) {
        // We need to fetch the parent comment to get the author
        // For now, we'll handle this separately
        // TODO: Implement notification creation for replies
      }

      return { commentData, cid: result.cid };
    },

    onMutate: async (input) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ['comments', input.proposalId],
      });

      // Snapshot previous value
      const previousComments = queryClient.getQueryData<DAOCommentData[]>([
        'comments',
        input.proposalId,
      ]);

      // Optimistically update the UI
      if (account) {
        const optimisticComment: DAOCommentData = {
          commentId: `temp-${Date.now()}`,
          proposalId: input.proposalId,
          author: account.address,
          text: input.text,
          createdAt: Date.now(),
          parentCommentId: input.parentCommentId || null,
          reactions: {
            like: [],
            love: [],
            laugh: [],
            sad: [],
            angry: [],
            celebrate: [],
          },
          attachments: input.attachments,
          formatting: input.formatting,
          metadata: {
            version: '1.0.0',
            isEdited: false,
          },
        };

        queryClient.setQueryData<DAOCommentData[]>(
          ['comments', input.proposalId],
          (old) => [...(old || []), optimisticComment]
        );
      }

      return { previousComments };
    },

    onError: (error, input, context) => {
      // Rollback on error
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['comments', input.proposalId],
          context.previousComments
        );
      }

      toast.error(
        error instanceof Error ? error.message : 'Failed to post comment'
      );
    },

    onSuccess: (data, input) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['comments', input.proposalId],
      });

      // If it's a reply, also invalidate replies query
      if (input.parentCommentId) {
        queryClient.invalidateQueries({
          queryKey: ['replies', input.parentCommentId],
        });
      }

      toast.success(
        input.parentCommentId ? 'Reply posted!' : 'Comment posted!'
      );
    },
  });
};
