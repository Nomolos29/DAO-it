import apiClient from './apiClient';
import { useActiveAccount } from 'thirdweb/react';

export const useCommentService = () => {
  const account = useActiveAccount();

  const addComment = async (proposalId: string, commentText: string) => {
    if (!account) throw new Error('No wallet connected');

    try {
      const response = await apiClient.post(`/proposal/${proposalId}/Comment`, null, {
        params: {
          CommentText: commentText
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error adding comment to proposal ${proposalId}:`, error);
      throw error;
    }
  };

  const updateComment = async (proposalId: string, commentId: string, comment: string) => {
    try {
      const response = await apiClient.put(`/proposal/${proposalId}/Comment`, null, {
        params: {
          commentId,
          Comment: comment
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error updating comment ${commentId} for proposal ${proposalId}:`, error);
      throw error;
    }
  };

  const deleteComment = async (proposalId: string, commentId: string) => {
    try {
      const response = await apiClient.delete(`/proposal/${proposalId}/Comment`, {
        params: {
          commentId
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId} for proposal ${proposalId}:`, error);
      throw error;
    }
  };

  const getAllComments = async (proposalId: string) => {
    try {
      const response = await apiClient.get(`/proposal/${proposalId}/Comment/GetAllComment`);
      return response.data;
    } catch (error) {
      console.error(`Error getting all comments for proposal ${proposalId}:`, error);
      throw error;
    }
  };

  const getComment = async (proposalId: string, commentId: string) => {
    try {
      const response = await apiClient.get(`/proposal/${proposalId}/Comment/GetComment`, {
        params: {
          commentId
        }
      });

      return response.data;
    } catch (error) {
      console.error(`Error getting comment ${commentId} for proposal ${proposalId}:`, error);
      throw error;
    }
  };

  const reactToComment = async (proposalId: string, commentId: string, isLike: boolean) => {
    if (!account) throw new Error('No wallet connected');

    try {
      const response = await apiClient.post('/proposal/comment/CommentReaction/react', {
        proposalId,
        commentId,
        userId: account.address,
        isLike
      });

      return response.data;
    } catch (error) {
      console.error(`Error reacting to comment ${commentId} for proposal ${proposalId}:`, error);
      throw error;
    }
  };

  return {
    addComment,
    updateComment,
    deleteComment,
    getAllComments,
    getComment,
    reactToComment
  };
};
