import { PinataSDK } from "pinata";

/**
 * DAO-it IPFS Service using Pinata SDK v2.5.0
 * SERVER-SIDE ONLY - Do not import in client components
 */

// ==================== FILE GROUPS ====================
export const DAO_FILE_GROUPS = {
  USERS: 'daoit-users',
  PROPOSALS: 'daoit-proposals',
  COMMENTS: 'daoit-comments',
  NOTIFICATIONS: 'daoit-notifications',
  MEDIA: 'daoit-media',
  REACTIONS: 'daoit-reactions', // Separate group for reactions
} as const;

export type DAOFileGroup = typeof DAO_FILE_GROUPS[keyof typeof DAO_FILE_GROUPS];

// ==================== DATA STRUCTURES ====================

export interface DAOUserData {
  walletAddress: string;
  profile: {
    username?: string;
    bio?: string;
    avatar?: {
      cid: string;
      url: string;
    };
  };
  activity: {
    proposalsCreated: string[];
    votesCount: number;
    commentsCount: number;
    joinedAt: number;
  };
  metadata: {
    version: string;
    lastUpdated: number;
  };
}

export interface DAOProposalData {
  // UUID from form - matches blockchain ID
  proposalId: string;
  proposer: string;
  title: string;
  summary: string;

  // Full content only on IPFS
  content: string; // Full markdown/HTML content

  proposalType: string;
  visibility: string;

  createdAt: string;
  endDate: string;

  // Proposal-level reactions (like/dislike)
  reactions?: {
    like: string[];     // Users who liked
    dislike: string[];  // Users who disliked
  };

  metadata: {
    version: string;
    status: 'active' | 'executed' | 'rejected';
    currentCID?: string;  // Track current CID for updates
    previousCID?: string; // Track previous CID for cleanup
  };
}

export type ReactionType = 'like' | 'love' | 'laugh' | 'sad' | 'angry' | 'celebrate';

// Proposal Reaction - Stored separately from proposal content
export interface DAOProposalReaction {
  proposalId: string;
  userAddress: string;
  reactionType: 'like' | 'dislike';
  timestamp: number;
  hasBeenChanged: boolean; // Track if user has changed their reaction
  metadata: {
    version: string;
  };
}

export interface DAOCommentAttachment {
  cid: string;
  url: string;
  type: 'image' | 'file';
  name: string;
  size: number;
  mimeType?: string;
}

export interface DAOCommentData {
  commentId: string;
  proposalId: string;
  author: string;
  text: string;
  createdAt: number;
  updatedAt?: number;

  // Threading (1 level only)
  parentCommentId?: string | null;

  // Multiple reaction types with user tracking
  reactions: {
    like: string[];      // 👍
    love: string[];      // ❤️
    laugh: string[];     // 😂
    sad: string[];       // 😢
    angry: string[];     // 😡
    celebrate: string[]; // 🎉
  };

  // Rich text formatting indicators
  formatting?: {
    hasBold: boolean;
    hasItalic: boolean;
    hasUnderline: boolean;
    hasCode: boolean;
    hasAttachments: boolean;
  };

  // File/image attachments
  attachments?: DAOCommentAttachment[];

  // Computed field
  replyCount?: number;

  metadata: {
    version: string;
    isEdited: boolean;
  };
}

export interface DAONotificationData {
  notificationId: string;
  type: 'reply' | 'reaction';
  fromUser: string;
  toUser: string;
  commentId: string;
  proposalId: string;
  reactionType?: ReactionType;
  createdAt: number;
  isRead: boolean;
  metadata: {
    version: string;
  };
}

export interface DAOSentimentData {
  proposalCID: string;
  overallSentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
  breakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  keyThemes: string[];
  insights: string[];
  generatedAt: number;
}

// ==================== IPFS SERVICE ====================

export class DAOIPFSService {
  private pinata: PinataSDK;
  private gateway: string;
  private groupCache: Map<string, string> = new Map();
  private userCache: Map<string, { data: DAOUserData; timestamp: number }> = new Map();
  private proposalCache: Map<string, { data: DAOProposalData; timestamp: number }> = new Map();
  private proposalListCache: { data: Array<DAOProposalData & { cid: string }>; timestamp: number } | null = null;
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache

  constructor() {
    const jwtKey = process.env.PINATA_JWT;

    console.log('🔑 Pinata JWT exists:', !!jwtKey);
    console.log('🔑 JWT length:', jwtKey?.length || 0);
    console.log('🌐 Gateway:', process.env.PINATA_GATEWAY);

    if (!jwtKey) {
      console.error('❌ PINATA_JWT not found in environment variables');
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('PINATA')));
      throw new Error('PINATA_JWT environment variable is required');
    }

    this.gateway = process.env.PINATA_GATEWAY || 'gateway.pinata.cloud';

    try {
      this.pinata = new PinataSDK({
        pinataJwt: jwtKey,
        pinataGateway: this.gateway,
      });
      console.log('✅ PinataSDK initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize PinataSDK:', error);
      throw error;
    }
  }

  // ==================== CORE HELPERS ====================

  async unpinFile(cid: string): Promise<void> {
    try {
      console.log('🗑️ [IPFS Service] Unpinning file:', cid);
      await this.pinata.files.public.delete([cid]);
      console.log('✅ [IPFS Service] File unpinned:', cid);

      // Remove from cache
      this.proposalCache.delete(cid);
    } catch (error) {
      console.error('❌ [IPFS Service] Error unpinning file:', cid, error);
      // Don't throw - unpinning failures shouldn't block the operation
    }
  }

  private async ensureGroup(groupName: DAOFileGroup): Promise<string> {
    if (this.groupCache.has(groupName)) {
      return this.groupCache.get(groupName)!;
    }

    const groups = await this.pinata.groups.public.list().name(groupName);
    const existing = groups.groups?.find((g: { name: string; id: string }) => g.name === groupName);

    if (existing) {
      this.groupCache.set(groupName, existing.id);
      return existing.id;
    }

    const newGroup = await this.pinata.groups.public.create({
      name: groupName,
    });

    this.groupCache.set(groupName, newGroup.id);
    return newGroup.id;
  }

  // ==================== USERS ====================

  async uploadUser(userData: DAOUserData): Promise<string> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.USERS);

    const upload = await this.pinata.upload.public
      .json(userData)
      .name(`user-${userData.walletAddress}`)
      .keyvalues({
        type: 'user',
        wallet: userData.walletAddress.toLowerCase(),
      })
      .group(groupId);

    // Update cache with new user data
    const cacheKey = userData.walletAddress.toLowerCase();
    this.userCache.set(cacheKey, {
      data: userData,
      timestamp: Date.now()
    });

    console.log(`✅ User uploaded: ${upload.cid}`);
    return upload.cid;
  }

  async getUser(walletAddress: string): Promise<DAOUserData | null> {
    const cacheKey = walletAddress.toLowerCase();

    // Check cache first
    const cached = this.userCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      console.log(`✅ Returning cached user for wallet: ${walletAddress}`);
      return cached.data;
    }

    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.USERS);

    const files = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        wallet: walletAddress.toLowerCase(),
        type: 'user',
      });

    if (!files.files || files.files.length === 0) {
      console.log(`⚠️ No user found for wallet: ${walletAddress}`);
      return null;
    }

    const latest = files.files.sort((a: { created_at: string }, b: { created_at: string }) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    console.log(`✅ Found user for wallet ${walletAddress}, CID: ${latest.cid}`);
    const response = await this.pinata.gateways.public.get(latest.cid);
    const userData = response.data as unknown as DAOUserData;

    // Cache the result
    this.userCache.set(cacheKey, {
      data: userData,
      timestamp: Date.now()
    });

    return userData;
  }

  // ==================== PROPOSALS ====================

  async uploadProposal(proposalData: DAOProposalData): Promise<string> {
    try {
      console.log('📤 [IPFS Service] Starting proposal upload for ID:', proposalData.proposalId);

      const groupId = await this.ensureGroup(DAO_FILE_GROUPS.PROPOSALS);
      console.log('✅ [IPFS Service] Group ID obtained:', groupId);

      console.log('📤 [IPFS Service] Uploading JSON to Pinata...');
      const upload = await this.pinata.upload.public
        .json(proposalData)
        .name(`proposal-${proposalData.title.slice(0, 30)}`)
        .keyvalues({
          type: 'proposal',
          proposalId: proposalData.proposalId, // Store UUID for lookup!
          proposer: proposalData.proposer.toLowerCase(),
          status: proposalData.metadata.status,
          proposalType: proposalData.proposalType,
        })
        .group(groupId);

      console.log('✅ [IPFS Service] Upload successful, CID:', upload.cid);

      // Cache the new proposal
      this.proposalCache.set(upload.cid, {
        data: proposalData,
        timestamp: Date.now()
      });

      // Invalidate the list cache
      this.proposalListCache = null;

      console.log(`✅ Proposal uploaded with ID ${proposalData.proposalId}: ${upload.cid}`);
      return upload.cid;
    } catch (error) {
      console.error('❌ [IPFS Service] Error uploading proposal:', error);
      console.error('❌ [IPFS Service] Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        proposalId: proposalData.proposalId
      });
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async fetchWithRetry(cid: string, maxRetries: number = 3): Promise<any> {
    // Try Pinata gateway first
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📥 Attempt ${attempt}/${maxRetries} - Fetching from Pinata gateway: ${cid}`);
        const response = await this.pinata.gateways.public.get(cid);
        return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const is429 = error?.statusCode === 429 || error?.message?.includes('429') || error?.message?.includes('Too many requests');
        const isCloudflare = error?.message?.includes('<!DOCTYPE html>') || error?.message?.includes('cloudflare');

        if ((is429 || isCloudflare) && attempt < maxRetries) {
          const waitTime = Math.min(1000 * Math.pow(2, attempt), 10000);
          console.log(`⏳ Rate limited on Pinata, waiting ${waitTime}ms before retry ${attempt + 1}...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        // If all Pinata attempts failed, try alternative public gateways
        if (attempt === maxRetries && (is429 || isCloudflare)) {
          console.log('⚠️ Pinata gateway blocked, trying alternative public gateways...');
          return await this.fetchFromAlternativeGateway(cid);
        }

        throw error;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async fetchFromAlternativeGateway(cid: string): Promise<any> {
    const alternativeGateways = [
      'https://ipfs.io/ipfs',
      'https://cloudflare-ipfs.com/ipfs',
      'https://dweb.link/ipfs',
    ];

    for (const gateway of alternativeGateways) {
      try {
        console.log(`🔄 Trying alternative gateway: ${gateway}`);
        const url = `${gateway}/${cid}`;
        const response = await fetch(url);

        if (!response.ok) {
          console.log(`❌ Gateway ${gateway} returned ${response.status}`);
          continue;
        }

        const data = await response.json();
        console.log(`✅ Successfully fetched from alternative gateway: ${gateway}`);
        return data;
      } catch (error) {
        console.log(`❌ Failed to fetch from ${gateway}:`, error instanceof Error ? error.message : 'Unknown error');
        continue;
      }
    }

    throw new Error('All gateways (Pinata + alternatives) failed to fetch the CID');
  }

  async getProposal(cid: string): Promise<DAOProposalData | null> {
    // Check cache first
    const cached = this.proposalCache.get(cid);
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_TTL) {
      console.log(`✅ Returning cached proposal for CID: ${cid}`);
      return cached.data;
    }

    try {
      const data = await this.fetchWithRetry(cid, 3);
      const proposalData = data as unknown as DAOProposalData;

      // Cache the result
      this.proposalCache.set(cid, {
        data: proposalData,
        timestamp: Date.now()
      });

      return proposalData;
    } catch (error) {
      console.error(`❌ Error getting proposal ${cid} after retries:`, error);
      return null;
    }
  }

  async getProposalByUUID(proposalId: string): Promise<DAOProposalData | null> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.PROPOSALS);

    // Find the proposal by UUID in keyvalues
    const files = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'proposal',
        proposalId: proposalId,
      });

    if (!files.files || files.files.length === 0) {
      console.log(`⚠️ No proposal found with ID: ${proposalId}`);
      return null;
    }

    // Get the latest version if multiple exist
    const latest = files.files.sort((a: { created_at: string }, b: { created_at: string }) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    console.log(`✅ Found proposal ${proposalId}, CID: ${latest.cid}`);
    return await this.getProposal(latest.cid);
  }

  async listProposals(status?: 'active' | 'executed' | 'rejected'): Promise<Array<DAOProposalData & { cid: string }>> {
    console.log('📋 [IPFS Service] listProposals called with status:', status);

    // Check list cache first (only if no specific status filter)
    if (!status && this.proposalListCache && (Date.now() - this.proposalListCache.timestamp) < this.CACHE_TTL) {
      console.log('✅ Returning cached proposal list');
      return this.proposalListCache.data;
    }

    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.PROPOSALS);
    console.log('📋 [IPFS Service] Using group ID:', groupId);

    // First, try listing ALL files in the proposals group
    const files = await this.pinata.files.public
      .list()
      .group(groupId);

    console.log('📋 [IPFS Service] Files found in group:', files.files?.length || 0);
    if (files.files && files.files.length > 0) {
      console.log('📋 [IPFS Service] First file:', {
        cid: files.files[0].cid,
        name: files.files[0].name,
        keyvalues: files.files[0].keyvalues
      });
    }

    if (!files.files || files.files.length === 0) {
      console.log('⚠️ [IPFS Service] No files found in proposals group');
      return [];
    }

    // Fetch proposals using the cached getProposal method (which handles its own caching)
    const proposals: Array<DAOProposalData & { cid: string }> = [];

    for (let i = 0; i < files.files.length; i++) {
      const file = files.files[i];
      try {
        const proposal = await this.getProposal(file.cid);
        if (proposal) {
          // Add the CID to the proposal data
          proposals.push({ ...proposal, cid: file.cid });
        }

        // Add a delay between requests to avoid rate limiting (except for the last one)
        if (i < files.files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        }
      } catch (error) {
        console.error(`❌ Failed to fetch proposal ${file.cid}:`, error);
        // Continue with other proposals even if one fails
      }
    }

    console.log('📋 [IPFS Service] Total proposals fetched:', proposals.length);

    // Cache the full list (only if no status filter)
    if (!status) {
      this.proposalListCache = {
        data: proposals,
        timestamp: Date.now()
      };
    }

    // Filter by status if provided
    let filteredProposals = proposals;
    if (status) {
      filteredProposals = proposals.filter(p => p.metadata.status === status);
      console.log(`📋 [IPFS Service] After filtering by status '${status}':`, filteredProposals.length);
    }

    console.log('✅ [IPFS Service] Returning', filteredProposals.length, 'proposals');
    return filteredProposals;
  }

  async updateProposalStatus(cid: string, newStatus: 'active' | 'executed' | 'rejected'): Promise<void> {
    const proposal = await this.getProposal(cid);
    if (!proposal) throw new Error('Proposal not found');

    proposal.metadata.status = newStatus;
    proposal.metadata.previousCID = cid;
    await this.uploadProposal(proposal);
  }

  // ==================== PROPOSAL REACTIONS (SEPARATE STORAGE) ====================

  async toggleProposalReaction(
    proposalId: string,
    userAddress: string,
    reactionType: 'like' | 'dislike',
    forceChange: boolean = false // Used when user confirms they want to change
  ): Promise<{ like: number; dislike: number; hasBeenChanged?: boolean; needsConfirmation?: boolean; currentReaction?: 'like' | 'dislike' }> {
    console.log('👍 [IPFS Service] Toggling reaction:', { proposalId, userAddress, reactionType, forceChange });

    const normalizedAddress = userAddress.toLowerCase();
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.REACTIONS);

    // Check if user already has a reaction for this proposal
    const existingReactions = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'proposal-reaction',
        proposalId: proposalId,
        userAddress: normalizedAddress,
      });

    let existingReactionData: DAOProposalReaction | null = null;

    // Get existing reaction data if any
    if (existingReactions.files && existingReactions.files.length > 0) {
      const file = existingReactions.files[0];
      try {
        const response = await this.pinata.gateways.public.get(file.cid);
        existingReactionData = response.data as unknown as DAOProposalReaction;
      } catch (error) {
        console.error('❌ [IPFS Service] Error fetching existing reaction:', error);
      }
    }

    // If user has an existing reaction and it's different, check if they can change
    if (existingReactionData && existingReactionData.reactionType !== reactionType) {
      if (existingReactionData.hasBeenChanged && !forceChange) {
        // User already changed once - not allowed
        throw new Error('You can only change your reaction once');
      }

      if (!forceChange) {
        // Need confirmation to change
        const counts = await this.getProposalReactionCounts(proposalId);
        return {
          ...counts,
          needsConfirmation: true,
          currentReaction: existingReactionData.reactionType,
        };
      }
    }

    // Delete existing reaction if any
    if (existingReactions.files && existingReactions.files.length > 0) {
      console.log('🗑️ [IPFS Service] Removing existing reactions:', existingReactions.files.length);
      for (const file of existingReactions.files) {
        await this.unpinFile(file.cid);
      }
    }

    // Check if this is the same reaction (toggle off)
    const isSameReaction = existingReactionData && existingReactionData.reactionType === reactionType;

    if (!isSameReaction) {
      // Add new reaction
      const hasBeenChanged = existingReactionData !== null; // True if this is a change from existing
      const reactionData: DAOProposalReaction = {
        proposalId,
        userAddress: normalizedAddress,
        reactionType,
        timestamp: Date.now(),
        hasBeenChanged,
        metadata: {
          version: '1.0.0',
        },
      };

      await this.pinata.upload.public
        .json(reactionData)
        .name(`reaction-${proposalId}-${normalizedAddress}`)
        .keyvalues({
          type: 'proposal-reaction',
          proposalId: proposalId,
          userAddress: normalizedAddress,
          reactionType: reactionType,
          hasBeenChanged: hasBeenChanged.toString(),
        })
        .group(groupId);

      console.log('✅ [IPFS Service] Reaction added/changed');
    } else {
      console.log('✅ [IPFS Service] Reaction toggled off');
    }

    // Return aggregated counts
    const counts = await this.getProposalReactionCounts(proposalId);
    return { ...counts, hasBeenChanged: existingReactionData?.hasBeenChanged };
  }

  async getProposalReactionCounts(proposalId: string): Promise<{ like: number; dislike: number }> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.REACTIONS);

    const reactions = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'proposal-reaction',
        proposalId: proposalId,
      });

    let likeCount = 0;
    let dislikeCount = 0;

    if (reactions.files) {
      for (const file of reactions.files) {
        const reactionType = file.keyvalues?.reactionType;
        if (reactionType === 'like') likeCount++;
        if (reactionType === 'dislike') dislikeCount++;
      }
    }

    console.log('📊 [IPFS Service] Reaction counts for', proposalId, ':', { like: likeCount, dislike: dislikeCount });
    return { like: likeCount, dislike: dislikeCount };
  }

  async getUserReactionForProposal(proposalId: string, userAddress: string): Promise<'like' | 'dislike' | null> {
    const normalizedAddress = userAddress.toLowerCase();
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.REACTIONS);

    const userReaction = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'proposal-reaction',
        proposalId: proposalId,
        userAddress: normalizedAddress,
      });

    if (userReaction.files && userReaction.files.length > 0) {
      const reactionType = userReaction.files[0].keyvalues?.reactionType;
      return reactionType as 'like' | 'dislike' | null;
    }

    return null;
  }

  // ==================== COMMENTS ====================

  async uploadComment(commentData: DAOCommentData): Promise<string> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.COMMENTS);

    const keyvalues: Record<string, string> = {
      type: 'comment',
      proposalId: commentData.proposalId,
      author: commentData.author.toLowerCase(),
      commentId: commentData.commentId,
    };

    // Add parent comment ID if this is a reply
    if (commentData.parentCommentId) {
      keyvalues.parentCommentId = commentData.parentCommentId;
    }

    const upload = await this.pinata.upload.public
      .json(commentData)
      .name(`comment-${commentData.commentId}`)
      .keyvalues(keyvalues)
      .group(groupId);

    console.log(`✅ Comment uploaded: ${upload.cid}`);
    return upload.cid;
  }

  async getCommentsByProposal(proposalId: string): Promise<DAOCommentData[]> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.COMMENTS);

    const files = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'comment',
        proposalId: proposalId,
      });

    if (!files.files || files.files.length === 0) return [];

    const comments = await Promise.all(
      files.files.map(async (file: { cid: string }) => {
        try {
          const response = await this.pinata.gateways.public.get(file.cid);
          const comment = response.data as unknown as DAOCommentData;
          // Calculate reply count for each comment
          if (!comment.parentCommentId) {
            comment.replyCount = await this.getReplyCount(comment.commentId);
          }
          return comment;
        } catch (error) {
          console.error(`Failed to fetch comment ${file.cid}:`, error);
          return null;
        }
      })
    );

    // Filter out failed fetches and sort by creation time
    return comments
      .filter((c): c is DAOCommentData => c !== null)
      .sort((a: DAOCommentData, b: DAOCommentData) => a.createdAt - b.createdAt);
  }

  async getCommentById(commentId: string): Promise<DAOCommentData | null> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.COMMENTS);

    const files = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'comment',
        commentId: commentId,
      });

    if (!files.files || files.files.length === 0) return null;

    // Get the latest version if multiple exist
    const latest = files.files.sort((a: { created_at: string }, b: { created_at: string }) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    const response = await this.pinata.gateways.public.get(latest.cid);
    return response.data as unknown as DAOCommentData;
  }

  async getReplies(parentCommentId: string): Promise<DAOCommentData[]> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.COMMENTS);

    const files = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'comment',
        parentCommentId: parentCommentId,
      });

    if (!files.files || files.files.length === 0) return [];

    const replies = await Promise.all(
      files.files.map(async (file: { cid: string }) => {
        try {
          const response = await this.pinata.gateways.public.get(file.cid);
          return response.data as unknown as DAOCommentData;
        } catch (error) {
          console.error(`Failed to fetch reply ${file.cid}:`, error);
          return null;
        }
      })
    );

    return replies
      .filter((r): r is DAOCommentData => r !== null)
      .sort((a: DAOCommentData, b: DAOCommentData) => a.createdAt - b.createdAt);
  }

  async getReplyCount(commentId: string): Promise<number> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.COMMENTS);

    const files = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'comment',
        parentCommentId: commentId,
      });

    return files.files?.length || 0;
  }

  async toggleReaction(
    commentId: string,
    userAddress: string,
    reactionType: ReactionType
  ): Promise<DAOCommentData> {
    const comment = await this.getCommentById(commentId);
    if (!comment) throw new Error('Comment not found');

    const normalizedAddress = userAddress.toLowerCase();
    const allReactionTypes: ReactionType[] = ['like', 'love', 'laugh', 'sad', 'angry', 'celebrate'];

    // Remove from all other reaction types if present
    allReactionTypes.forEach((type) => {
      if (type !== reactionType && comment.reactions[type]) {
        comment.reactions[type] = comment.reactions[type].filter(
          (addr: string) => addr.toLowerCase() !== normalizedAddress
        );
      }
    });

    // Toggle current reaction
    const currentReactions = comment.reactions[reactionType] || [];
    const hasReacted = currentReactions.some((addr: string) => addr.toLowerCase() === normalizedAddress);

    if (hasReacted) {
      // Remove reaction
      comment.reactions[reactionType] = currentReactions.filter(
        (addr: string) => addr.toLowerCase() !== normalizedAddress
      );
    } else {
      // Add reaction
      comment.reactions[reactionType].push(normalizedAddress);
    }

    // Update timestamp and metadata
    comment.updatedAt = Date.now();

    // Re-upload the comment with updated reactions
    await this.uploadComment(comment);

    return comment;
  }

  async getCommentsByUser(userAddress: string): Promise<DAOCommentData[]> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.COMMENTS);

    const files = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'comment',
        author: userAddress.toLowerCase(),
      });

    if (!files.files || files.files.length === 0) return [];

    const comments = await Promise.all(
      files.files.map(async (file: { cid: string }) => {
        try {
          const response = await this.pinata.gateways.public.get(file.cid);
          return response.data as unknown as DAOCommentData;
        } catch (error) {
          console.error(`Failed to fetch comment ${file.cid}:`, error);
          return null;
        }
      })
    );

    return comments
      .filter((c): c is DAOCommentData => c !== null)
      .sort((a: DAOCommentData, b: DAOCommentData) => b.createdAt - a.createdAt);
  }

  // ==================== NOTIFICATIONS ====================

  async uploadNotification(notificationData: DAONotificationData): Promise<string> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.NOTIFICATIONS);

    const upload = await this.pinata.upload.public
      .json(notificationData)
      .name(`notification-${notificationData.notificationId}`)
      .keyvalues({
        type: 'notification',
        toUser: notificationData.toUser.toLowerCase(),
        fromUser: notificationData.fromUser.toLowerCase(),
        notificationType: notificationData.type,
        isRead: notificationData.isRead.toString(),
      })
      .group(groupId);

    console.log(`✅ Notification uploaded: ${upload.cid}`);
    return upload.cid;
  }

  async getNotificationsByUser(userAddress: string): Promise<DAONotificationData[]> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.NOTIFICATIONS);

    const files = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'notification',
        toUser: userAddress.toLowerCase(),
      });

    if (!files.files || files.files.length === 0) return [];

    const notifications = await Promise.all(
      files.files.map(async (file: { cid: string }) => {
        try {
          const response = await this.pinata.gateways.public.get(file.cid);
          return response.data as unknown as DAONotificationData;
        } catch (error) {
          console.error(`Failed to fetch notification ${file.cid}:`, error);
          return null;
        }
      })
    );

    return notifications
      .filter((n): n is DAONotificationData => n !== null)
      .sort((a: DAONotificationData, b: DAONotificationData) => b.createdAt - a.createdAt);
  }

  async getUnreadNotifications(userAddress: string): Promise<DAONotificationData[]> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.NOTIFICATIONS);

    const files = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'notification',
        toUser: userAddress.toLowerCase(),
        isRead: 'false',
      });

    if (!files.files || files.files.length === 0) return [];

    const notifications = await Promise.all(
      files.files.map(async (file: { cid: string }) => {
        try {
          const response = await this.pinata.gateways.public.get(file.cid);
          return response.data as unknown as DAONotificationData;
        } catch (error) {
          console.error(`Failed to fetch notification ${file.cid}:`, error);
          return null;
        }
      })
    );

    return notifications
      .filter((n): n is DAONotificationData => n !== null)
      .sort((a: DAONotificationData, b: DAONotificationData) => b.createdAt - a.createdAt);
  }

  async markNotificationAsRead(notificationId: string): Promise<DAONotificationData> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.NOTIFICATIONS);

    const files = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'notification',
      });

    // Find the notification by ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    const notificationFile = files.files?.find((_file: any) => {
      // Would need to fetch and check, or store notificationId in keyvalues
      // For now, we'll use a simpler approach
      return true; // TODO: Implement proper filtering
    });

    if (!notificationFile) throw new Error('Notification not found');

    const response = await this.pinata.gateways.public.get(notificationFile.cid);
    const notification = response.data as unknown as DAONotificationData;

    if (notification.notificationId !== notificationId) {
      throw new Error('Notification ID mismatch');
    }

    notification.isRead = true;
    await this.uploadNotification(notification);

    return notification;
  }

  // ==================== SENTIMENT ====================

  async uploadSentiment(sentimentData: DAOSentimentData): Promise<string> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.COMMENTS);

    const upload = await this.pinata.upload.public
      .json(sentimentData)
      .name(`sentiment-${sentimentData.proposalCID}`)
      .keyvalues({
        type: 'sentiment',
        proposalCID: sentimentData.proposalCID,
      })
      .group(groupId);

    console.log(`✅ Sentiment uploaded: ${upload.cid}`);
    return upload.cid;
  }

  async getSentiment(proposalCID: string): Promise<DAOSentimentData | null> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.COMMENTS);

    const files = await this.pinata.files.public
      .list()
      .group(groupId)
      .keyvalues({
        type: 'sentiment',
        proposalCID: proposalCID,
      });

    if (!files.files || files.files.length === 0) return null;

    const latest = files.files.sort((a: { created_at: string }, b: { created_at: string }) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    const response = await this.pinata.gateways.public.get(latest.cid);
    return response.data as unknown as DAOSentimentData;
  }

  // ==================== MEDIA ====================

  async uploadFile(file: File, type: 'avatar' | 'proposal-image'): Promise<{ cid: string; url: string }> {
    const groupId = await this.ensureGroup(DAO_FILE_GROUPS.MEDIA);

    const upload = await this.pinata.upload.public
      .file(file)
      .name(`${type}-${Date.now()}-${file.name}`)
      .keyvalues({
        type,
        mimeType: file.type,
      })
      .group(groupId);

    const url = `https://${this.gateway}/ipfs/${upload.cid}`;

    console.log(`✅ File uploaded: ${upload.cid}`);
    return { cid: upload.cid, url };
  }

  // ==================== UTILITY ====================

  async init(): Promise<void> {
    console.log('🔄 Initializing groups...');
    await Promise.all(
      Object.values(DAO_FILE_GROUPS).map(group => this.ensureGroup(group))
    );
    console.log('✅ Groups ready');
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.pinata.testAuthentication();
      console.log('🟢 IPFS connected');
      return true;
    } catch (error) {
      console.error('❌ IPFS connection failed:', error);
      return false;
    }
  }
}

// Singleton
let ipfsService: DAOIPFSService | null = null;

export const getIPFSService = (): DAOIPFSService => {
  if (!ipfsService) {
    ipfsService = new DAOIPFSService();
  }
  return ipfsService;
};

export default DAOIPFSService;
