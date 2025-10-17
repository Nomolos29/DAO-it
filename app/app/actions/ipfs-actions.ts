"use server";

import { getIPFSService } from '../lib/ipfs-service';
import type {
  DAOUserData,
  DAOProposalData,
  DAOCommentData,
  DAOSentimentData,
  DAONotificationData,
  ReactionType
} from '../lib/ipfs-service';

/**
 * Server Actions for IPFS operations
 * These can be called directly from client components
 */

// ==================== USER ACTIONS ====================

export async function uploadUserToIPFS(userData: DAOUserData): Promise<{ success: boolean; cid?: string; error?: string }> {
  try {
    console.log('📤 [Server Action] uploadUserToIPFS called for:', userData.walletAddress);
    console.log('🔑 [Server Action] PINATA_JWT exists:', !!process.env.PINATA_JWT);
    console.log('🔑 [Server Action] JWT length:', process.env.PINATA_JWT?.length || 0);

    const ipfs = getIPFSService();
    console.log('✅ [Server Action] IPFS service initialized');

    const cid = await ipfs.uploadUser(userData);
    console.log('✅ [Server Action] User uploaded successfully:', cid);

    return { success: true, cid };
  } catch (error) {
    console.error('❌ [Server Action] Error uploading user:', error);
    console.error('❌ [Server Action] Error details:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error && error.stack) {
      console.error('❌ [Server Action] Stack trace:', error.stack);
    }
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getUserFromIPFS(walletAddress: string): Promise<{ success: boolean; data?: DAOUserData; error?: string }> {
  try {
    console.log('🔍 [Server Action] getUserFromIPFS called for:', walletAddress);
    console.log('🔑 [Server Action] PINATA_JWT exists:', !!process.env.PINATA_JWT);
    console.log('🔑 [Server Action] JWT first 20 chars:', process.env.PINATA_JWT?.substring(0, 20));

    const ipfs = getIPFSService();
    console.log('✅ [Server Action] IPFS service initialized');

    console.log('🔄 [Server Action] Calling ipfs.getUser...');
    const data = await ipfs.getUser(walletAddress);
    console.log('📥 [Server Action] getUser result:', data ? 'User found' : 'User not found');

    if (data) {
      console.log('📥 [Server Action] User data preview:', {
        walletAddress: data.walletAddress,
        hasProfile: !!data.profile,
        hasActivity: !!data.activity,
        hasMetadata: !!data.metadata
      });
    }

    if (!data) {
      console.log('⚠️ [Server Action] Returning success=false, user not found');
      return { success: false, error: 'User not found' };
    }

    console.log('✅ [Server Action] Returning success=true with user data');
    return { success: true, data };
  } catch (error) {
    console.error('❌ [Server Action] Error getting user:', error);
    console.error('❌ [Server Action] Error stack:', error instanceof Error ? error.stack : 'No stack');
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ==================== PROPOSAL ACTIONS ====================

export async function uploadProposalToIPFS(proposalData: DAOProposalData): Promise<{ success: boolean; cid?: string; error?: string }> {
  try {
    console.log('📤 [Server Action] uploadProposalToIPFS called for:', proposalData.proposalId);
    console.log('📤 [Server Action] Proposal data:', {
      proposalId: proposalData.proposalId,
      title: proposalData.title,
      proposer: proposalData.proposer,
      contentLength: proposalData.content?.length || 0
    });
    console.log('🔑 [Server Action] PINATA_JWT exists:', !!process.env.PINATA_JWT);

    const ipfs = getIPFSService();
    console.log('✅ [Server Action] IPFS service initialized');

    const cid = await ipfs.uploadProposal(proposalData);
    console.log('✅ [Server Action] Proposal uploaded successfully, CID:', cid);

    return { success: true, cid };
  } catch (error) {
    console.error('❌ [Server Action] Error uploading proposal:', error);
    console.error('❌ [Server Action] Error details:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error && error.stack) {
      console.error('❌ [Server Action] Stack trace:', error.stack);
    }
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getProposalFromIPFS(cid: string): Promise<{ success: boolean; data?: DAOProposalData; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const data = await ipfs.getProposal(cid);

    if (!data) {
      return { success: false, error: 'Proposal not found' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error getting proposal:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getProposalByIdFromIPFS(proposalId: string): Promise<{ success: boolean; data?: DAOProposalData; error?: string }> {
  try {
    console.log('📋 [Server Action] getProposalByIdFromIPFS called for:', proposalId);
    const ipfs = getIPFSService();
    const data = await ipfs.getProposalByUUID(proposalId);

    if (!data) {
      return { success: false, error: 'Proposal not found' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('❌ [Server Action] Error getting proposal by ID:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function listProposalsFromIPFS(status?: 'active' | 'executed' | 'rejected'): Promise<{ success: boolean; data?: Array<DAOProposalData & { cid: string }>; error?: string }> {
  try {
    console.log('📋 [Server Action] listProposalsFromIPFS called with status:', status);
    const ipfs = getIPFSService();
    const data = await ipfs.listProposals(status);
    console.log('📋 [Server Action] Found proposals:', data.length);
    if (data.length > 0) {
      console.log('📋 [Server Action] First proposal:', {
        title: data[0].title,
        proposer: data[0].proposer,
        status: data[0].metadata.status
      });
    }
    return { success: true, data };
  } catch (error) {
    console.error('❌ [Server Action] Error listing proposals:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function updateProposalStatusInIPFS(cid: string, newStatus: 'active' | 'executed' | 'rejected'): Promise<{ success: boolean; error?: string }> {
  try {
    const ipfs = getIPFSService();
    await ipfs.updateProposalStatus(cid, newStatus);
    return { success: true };
  } catch (error) {
    console.error('Error updating proposal status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ==================== COMMENT ACTIONS ====================

export async function uploadCommentToIPFS(commentData: DAOCommentData): Promise<{ success: boolean; cid?: string; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const cid = await ipfs.uploadComment(commentData);
    return { success: true, cid };
  } catch (error) {
    console.error('Error uploading comment:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getCommentsFromIPFS(proposalId: string): Promise<{ success: boolean; data?: DAOCommentData[]; error?: string }> {
  try {
    console.log('🔍 [getCommentsFromIPFS] Fetching comments for proposal:', proposalId);
    const ipfs = getIPFSService();
    const data = await ipfs.getCommentsByProposal(proposalId);
    console.log('✅ [getCommentsFromIPFS] Comments fetched:', data?.length || 0);
    console.log('📊 [getCommentsFromIPFS] Comments data:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ [getCommentsFromIPFS] Error getting comments:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getCommentByIdFromIPFS(commentId: string): Promise<{ success: boolean; data?: DAOCommentData; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const data = await ipfs.getCommentById(commentId);

    if (!data) {
      return { success: false, error: 'Comment not found' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error getting comment by ID:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getRepliesFromIPFS(parentCommentId: string): Promise<{ success: boolean; data?: DAOCommentData[]; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const data = await ipfs.getReplies(parentCommentId);
    return { success: true, data };
  } catch (error) {
    console.error('Error getting replies:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function toggleCommentReaction(
  commentId: string,
  userAddress: string,
  reactionType: ReactionType
): Promise<{ success: boolean; data?: DAOCommentData; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const data = await ipfs.toggleReaction(commentId, userAddress, reactionType);
    return { success: true, data };
  } catch (error) {
    console.error('Error toggling reaction:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function toggleProposalReaction(
  proposalId: string,
  userAddress: string,
  reactionType: 'like' | 'dislike',
  forceChange: boolean = false
): Promise<{ success: boolean; counts?: { like: number; dislike: number }; needsConfirmation?: boolean; currentReaction?: 'like' | 'dislike'; error?: string }> {
  try {
    console.log('🔄 [Server Action] toggleProposalReaction:', { proposalId, userAddress, reactionType, forceChange });
    const ipfs = getIPFSService();
    const result = await ipfs.toggleProposalReaction(proposalId, userAddress, reactionType, forceChange);
    console.log('✅ [Server Action] Reaction toggled, result:', result);
    return { success: true, ...result };
  } catch (error) {
    console.error('❌ [Server Action] Error toggling proposal reaction:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getProposalReactionCounts(proposalId: string): Promise<{ success: boolean; counts?: { like: number; dislike: number }; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const counts = await ipfs.getProposalReactionCounts(proposalId);
    return { success: true, counts };
  } catch (error) {
    console.error('Error getting proposal reaction counts:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getUserReactionForProposal(proposalId: string, userAddress: string): Promise<{ success: boolean; reaction?: 'like' | 'dislike' | null; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const reaction = await ipfs.getUserReactionForProposal(proposalId, userAddress);
    return { success: true, reaction };
  } catch (error) {
    console.error('Error getting user reaction:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getCommentsByUserFromIPFS(userAddress: string): Promise<{ success: boolean; data?: DAOCommentData[]; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const data = await ipfs.getCommentsByUser(userAddress);
    return { success: true, data };
  } catch (error) {
    console.error('Error getting user comments:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ==================== NOTIFICATION ACTIONS ====================

export async function uploadNotificationToIPFS(notificationData: DAONotificationData): Promise<{ success: boolean; cid?: string; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const cid = await ipfs.uploadNotification(notificationData);
    return { success: true, cid };
  } catch (error) {
    console.error('Error uploading notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getNotificationsFromIPFS(userAddress: string): Promise<{ success: boolean; data?: DAONotificationData[]; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const data = await ipfs.getNotificationsByUser(userAddress);
    return { success: true, data };
  } catch (error) {
    console.error('Error getting notifications:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getUnreadNotificationsFromIPFS(userAddress: string): Promise<{ success: boolean; data?: DAONotificationData[]; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const data = await ipfs.getUnreadNotifications(userAddress);
    return { success: true, data };
  } catch (error) {
    console.error('Error getting unread notifications:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function markNotificationAsReadInIPFS(notificationId: string): Promise<{ success: boolean; data?: DAONotificationData; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const data = await ipfs.markNotificationAsRead(notificationId);
    return { success: true, data };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ==================== SENTIMENT ACTIONS ====================

export async function uploadSentimentToIPFS(sentimentData: DAOSentimentData): Promise<{ success: boolean; cid?: string; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const cid = await ipfs.uploadSentiment(sentimentData);
    return { success: true, cid };
  } catch (error) {
    console.error('Error uploading sentiment:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function getSentimentFromIPFS(proposalCID: string): Promise<{ success: boolean; data?: DAOSentimentData; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const data = await ipfs.getSentiment(proposalCID);

    if (!data) {
      return { success: false, error: 'Sentiment analysis not found' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error getting sentiment:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ==================== MEDIA ACTIONS ====================

export async function uploadFileToIPFS(formData: FormData): Promise<{ success: boolean; cid?: string; url?: string; error?: string }> {
  try {
    const file = formData.get('file') as File;
    const type = formData.get('type') as 'avatar' | 'proposal-image';

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    const ipfs = getIPFSService();
    const result = await ipfs.uploadFile(file, type);
    return { success: true, ...result };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ==================== UTILITY ACTIONS ====================

export async function initializeIPFSGroups(): Promise<{ success: boolean; error?: string }> {
  try {
    const ipfs = getIPFSService();
    await ipfs.init();
    return { success: true };
  } catch (error) {
    console.error('Error initializing IPFS groups:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

export async function testIPFSConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const ipfs = getIPFSService();
    const connected = await ipfs.testConnection();

    if (!connected) {
      return { success: false, error: 'IPFS connection test failed' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error testing IPFS connection:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
