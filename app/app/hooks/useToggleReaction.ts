import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveAccount } from 'thirdweb/react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { toggleCommentReaction, uploadNotificationToIPFS } from '../actions/ipfs-actions';
import type { DAOCommentData, ReactionType, DAONotificationData } from '../lib/ipfs-service';

interface ToggleReactionInput {
  commentId: string;
  reactionType: ReactionType;
  proposalId: string;
  commentAuthor: string; // For creating notification
}

/**
 * Hook to toggle reactions on comments
 * Supports 6 reaction types: like, love, laugh, sad, angry, celebrate
 */
export const useToggleReaction = () => {
  const account = useActiveAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ToggleReactionInput) => {
      if (!account) {
        throw new Error('Wallet not connected');
      }

      // Toggle reaction via IPFS
      const result = await toggleCommentReaction(
        input.commentId,
        account.address,
        input.reactionType
      );

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to toggle reaction');
      }

      // Check if user just added a reaction (not removed)
      const userReacted = result.data.reactions[input.reactionType].includes(
        account.address.toLowerCase()
      );

      // Create notification if user reacted (and it's not their own comment)
      if (
        userReacted &&
        input.commentAuthor.toLowerCase() !== account.address.toLowerCase()
      ) {
        const notificationData: DAONotificationData = {
          notificationId: uuidv4(),
          type: 'reaction',
          fromUser: account.address,
          toUser: input.commentAuthor,
          commentId: input.commentId,
          proposalId: input.proposalId,
          reactionType: input.reactionType,
          createdAt: Date.now(),
          isRead: false,
          metadata: {
            version: '1.0.0',
          },
        };

        // Upload notification in background (don't wait)
        uploadNotificationToIPFS(notificationData).catch((error) => {
          console.error('Failed to create notification:', error);
        });
      }

      return result.data;
    },

    onMutate: async (input) => {
      if (!account) return;

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
      queryClient.setQueryData<DAOCommentData[]>(
        ['comments', input.proposalId],
        (old) => {
          if (!old) return old;

          return old.map((comment) => {
            if (comment.commentId !== input.commentId) return comment;

            const userAddress = account.address.toLowerCase();
            const updatedComment = { ...comment };

            // Remove from all other reactions
            (Object.keys(updatedComment.reactions) as ReactionType[]).forEach(
              (type) => {
                if (type !== input.reactionType) {
                  updatedComment.reactions[type] = updatedComment.reactions[
                    type
                  ].filter((addr) => addr.toLowerCase() !== userAddress);
                }
              }
            );

            // Toggle current reaction
            const hasReacted = updatedComment.reactions[
              input.reactionType
            ].some((addr) => addr.toLowerCase() === userAddress);

            if (hasReacted) {
              // Remove reaction
              updatedComment.reactions[input.reactionType] =
                updatedComment.reactions[input.reactionType].filter(
                  (addr) => addr.toLowerCase() !== userAddress
                );
            } else {
              // Add reaction
              updatedComment.reactions[input.reactionType].push(
                account.address
              );
            }

            return updatedComment;
          });
        }
      );

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
        error instanceof Error ? error.message : 'Failed to update reaction'
      );
    },

    onSuccess: (data, input) => {
      // Invalidate to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ['comments', input.proposalId],
      });

      // Also invalidate replies if this was a reply
      queryClient.invalidateQueries({
        queryKey: ['replies'],
      });
    },
  });
};
