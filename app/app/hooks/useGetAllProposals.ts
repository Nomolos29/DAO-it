/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useProposalService, PaginationParams } from "../services/proposalService";
import { useReadContract } from "thirdweb/react";
import { daoitContract } from "../lib/constants";
import { resolveMethod } from "thirdweb";
import { showErrorWithDetails, isCanceledError } from "../utils/toast";
import { cancelAllRequests } from "../services/apiClient";

export interface Proposal {
  id: number | string;
  title: string;
  description: string;
  summary: string;
  startDate: number; // Timestamp when voting starts
  endDate: number; // Timestamp when voting ends
  yesVotes: number; // Total votes for Yes
  noVotes: number; // Total votes for No
  abstainVotes: number; // Total votes for Abstain
}

// Cache for proposals to prevent unnecessary refetches
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
let proposalsCache: {
  data: Proposal[] | null;
  timestamp: number;
  params?: { limit: number; page: number; };
} = {
  data: null,
  timestamp: 0
};

export function useGetAllProposals(limit = 10, page = 1) {
  const [backendProposals, setBackendProposals] = useState<any[]>([]);
  const [isBackendLoading, setIsBackendLoading] = useState(false);
  const [backendError, setBackendError] = useState<Error | null>(null);
  const [paginatedProposals, setPaginatedProposals] = useState<Proposal[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const proposalService = useProposalService();

  // Check if cache is valid for current pagination
  const isCacheValid = useMemo(() => {
    return (
      proposalsCache.data !== null &&
      Date.now() - proposalsCache.timestamp < CACHE_EXPIRY_TIME &&
      proposalsCache.params?.limit === limit &&
      proposalsCache.params?.page === page
    );
  }, [limit, page]);

  // Get proposals from blockchain with caching
  const { data: blockchainData, isLoading: isBlockchainLoading, error: blockchainError } = useReadContract({
    contract: daoitContract,
    // @ts-ignore: Ignore type error for this line
    method: resolveMethod("getAllProposals"), // DO NOT EDIT THIS
    // Skip fetching if we have valid cache
    enabled: !isCacheValid,
  });

  // Process blockchain proposals with memoization
  const blockchainProposals = useMemo(() => {
    // Use cache if valid
    if (isCacheValid && proposalsCache.data) {
      return proposalsCache.data.filter(p => p.id.toString().includes('blockchain'));
    }

    const proposals: Proposal[] = [];
    if (blockchainData) {
      try {
        if (Array.isArray(blockchainData)) {
          blockchainData.forEach((item) => {
            const proposal: Proposal = {
              id: `blockchain-${Number(item.id || 0)}`,
              title: item.title || "",
              description: item.description || "",
              summary: item.summary || "",
              startDate: Number(item.startDate || 0),
              endDate: Number(item.endDate || 0),
              yesVotes: Number(item.yesVotes || 0),
              noVotes: Number(item.noVotes || 0),
              abstainVotes: Number(item.abstainVotes || 0),
            };
            proposals.push(proposal);
          });
        }
      } catch (transformError) {
        console.error("Error transforming blockchain proposal data:", transformError);
        showErrorWithDetails(transformError, "Processing Blockchain Data");
      }
    }
    return proposals;
  }, [blockchainData, isCacheValid]);

  // Get proposals from backend API with caching and pagination
  const fetchBackendProposals = useCallback(async (forceRefresh = false) => {
    // Skip fetching if we have valid cache and not forcing refresh
    if (isCacheValid && proposalsCache.data && !forceRefresh) {
      const backendOnly = proposalsCache.data.filter(p => !p.id.toString().includes('blockchain'));
      setBackendProposals(backendOnly);
      return;
    }

    try {
      setIsBackendLoading(true);
      
      // Set up pagination parameters
      const paginationParams: PaginationParams = {
        page,
        pageSize: limit,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      };
      
      const result = await proposalService.getAllProposals(paginationParams);
      const processedResults = Array.isArray(result) ? result : [];
      setBackendProposals(processedResults);
    } catch (error) {
      // Only set error and show toast if it's not a canceled request
      if (!isCanceledError(error)) {
        console.error("Error fetching proposals from backend:", error);
        setBackendError(error instanceof Error ? error : new Error(String(error)));
        showErrorWithDetails(error, "Fetching Proposals");
      }
    } finally {
      setIsBackendLoading(false);
      setIsRefreshing(false);
    }
  }, [proposalService, isCacheValid, page, limit]);

  // Use a ref to track if the component is mounted
  const isMountedRef = useRef(true);
  
  // Set up cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Initial fetch with cleanup
  useEffect(() => {
    // Only fetch if mounted
    if (isMountedRef.current) {
      fetchBackendProposals();
    }
    
    // Cleanup function to cancel pending requests when dependencies change
    return () => {
      cancelAllRequests();
    };
  }, [fetchBackendProposals]);

  // Merge and paginate proposals
  useEffect(() => {
    // If we have valid cache, use it directly
    if (isCacheValid && proposalsCache.data) {
      const start = (page - 1) * limit;
      const end = start + limit;
      setPaginatedProposals(proposalsCache.data.slice(start, end));
      setTotalCount(proposalsCache.data.length);
      return;
    }

    // Process backend proposals
    const processedBackendProposals = backendProposals.map(backendProposal => ({
      id: `backend-${backendProposal.id || backendProposal.proposalId}`,
      title: backendProposal.title || backendProposal.proposalTitle || "",
      description: backendProposal.description || backendProposal.proposalDetails || "",
      summary: backendProposal.summary || backendProposal.proposalSummary || "",
      startDate: backendProposal.startDate || backendProposal.createdAt || Date.now(),
      endDate: backendProposal.endDate || 0,
      yesVotes: backendProposal.yesVotes || 0,
      noVotes: backendProposal.noVotes || 0,
      abstainVotes: backendProposal.abstainVotes || 0,
    }));

    // Merge proposals from both sources
    const mergedProposals = [...blockchainProposals, ...processedBackendProposals];
    
    // Sort by newest first
    mergedProposals.sort((a, b) => Number(b.startDate) - Number(a.startDate));
    
    // Update cache with current pagination params
    proposalsCache = {
      data: mergedProposals,
      timestamp: Date.now(),
      params: { limit, page }
    };
    
    // Paginate results
    const start = (page - 1) * limit;
    const end = start + limit;
    setPaginatedProposals(mergedProposals.slice(start, end));
    setTotalCount(mergedProposals.length);
  }, [blockchainProposals, backendProposals, limit, page, isCacheValid]);

  // Function to refresh data
  const refreshProposals = useCallback(() => {
    setIsRefreshing(true);
    // Clear cache
    proposalsCache = {
      data: null,
      timestamp: 0
    };
    // Fetch fresh data
    fetchBackendProposals(true);
  }, [fetchBackendProposals]);

  const isLoading = isBlockchainLoading || isBackendLoading;
  const error = blockchainError || backendError;

  return {
    proposals: paginatedProposals,
    isLoading,
    isRefreshing,
    error,
    totalCount,
    page,
    limit,
    hasMore: totalCount > page * limit,
    loadMore: () => {
      // This function can be used to load the next page
      return page + 1;
    },
    refreshProposals
  };
}
