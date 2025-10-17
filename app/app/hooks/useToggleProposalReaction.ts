import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActiveAccount } from 'thirdweb/react';
import { toast } from 'react-toastify';
import { toggleProposalReaction } from '../actions/ipfs-actions';

interface ToggleProposalReactionInput {
  proposalId: string;
  reactionType: 'like' | 'dislike';
  forceChange?: boolean;
}

/**
 * Hook to toggle reactions on proposals using separate IPFS storage
 * This ensures proposal content stays immutable
 * Enforces one-time change rule with confirmation
 */
export const useToggleProposalReaction = () => {
  const account = useActiveAccount();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ToggleProposalReactionInput) => {
      if (!account) {
        throw new Error('Wallet not connected');
      }

      console.log('🔄 [useToggleProposalReaction] Toggling reaction:', input);

      // Toggle reaction via IPFS (separate storage)
      const result = await toggleProposalReaction(
        input.proposalId,
        account.address,
        input.reactionType,
        input.forceChange || false
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to toggle reaction');
      }

      // If needs confirmation, show modal
      if (result.needsConfirmation) {
        const currentReactionText = result.currentReaction === 'like' ? 'Like' : 'Dislike';
        const newReactionText = input.reactionType === 'like' ? 'Like' : 'Dislike';

        const confirmed = window.confirm(
          `⚠️ Change Reaction?\n\nYou currently have a "${currentReactionText}" reaction.\n\nChanging to "${newReactionText}" will permanently delete your "${currentReactionText}" and you can ONLY change once.\n\nDo you want to proceed?`
        );

        if (!confirmed) {
          // User cancelled, return current counts without changing
          return { proposalId: input.proposalId, counts: result.counts!, cancelled: true };
        }

        // User confirmed, retry with forceChange
        const forceResult = await toggleProposalReaction(
          input.proposalId,
          account.address,
          input.reactionType,
          true // forceChange
        );

        if (!forceResult.success || !forceResult.counts) {
          throw new Error(forceResult.error || 'Failed to change reaction');
        }

        console.log('✅ [useToggleProposalReaction] Reaction changed after confirmation');
        return { proposalId: input.proposalId, counts: forceResult.counts, reactionType: input.reactionType };
      }

      if (!result.counts) {
        throw new Error('Failed to get reaction counts');
      }

      console.log('✅ [useToggleProposalReaction] New counts:', result.counts);
      return { proposalId: input.proposalId, counts: result.counts, reactionType: input.reactionType };
    },

    onSuccess: (data) => {
      if ('cancelled' in data && data.cancelled) {
        console.log('ℹ️ [useToggleProposalReaction] Reaction change cancelled by user');
        return;
      }

      console.log('✅ [useToggleProposalReaction] Success, invalidating queries');

      // Invalidate all queries to refresh with new reaction counts
      queryClient.invalidateQueries({
        queryKey: ['proposals'],
      });

      queryClient.invalidateQueries({
        queryKey: ['proposal', data.proposalId],
      });

      queryClient.invalidateQueries({
        queryKey: ['reactions', data.proposalId],
      });

      toast.success('Reaction updated!');
    },

    onError: (error) => {
      console.error('❌ [useToggleProposalReaction] Error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update reaction'
      );
    },
  });
};
