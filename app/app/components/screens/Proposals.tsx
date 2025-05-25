import { useState, useCallback } from "react";
import { useGetAllProposals } from "@/app/app/hooks/useGetAllProposals";
import Post from "../Post";
import ErrorBoundary from "../ErrorBoundary";

const ITEMS_PER_PAGE = 5;

const ProposalsHome = () => {
  const [page, setPage] = useState(1);
  const { 
    proposals, 
    isLoading,
    isRefreshing,
    error, 
    totalCount, 
    hasMore,
    refreshProposals
  } = useGetAllProposals(ITEMS_PER_PAGE, page);

  const loadMoreProposals = useCallback(() => {
    setPage(prevPage => prevPage + 1);
  }, []);

  // Handle error state
  if (error && !isLoading && proposals.length === 0) {
    return (
      <div className="w-full px-2 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error.message || 'Failed to load proposals'}</span>
          <div className="mt-3">
            <button 
              onClick={refreshProposals}
              className="bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded transition-colors"
            >
              {isRefreshing ? 'Retrying...' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <main className="w-full px-2 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
        <div className="flex flex-col w-full gap-y-5">
          {/* Header with refresh button */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Proposals</h1>
            <button
              onClick={refreshProposals}
              disabled={isRefreshing}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                />
              </svg>
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Initial loading state */}
          {isLoading && proposals.length === 0 && (
            <div className="flex justify-center items-center py-10">
              <div className="animate-pulse flex space-x-4 w-full">
                <div className="flex-1 space-y-6 py-1">
                  <div className="h-40 bg-gray-200 rounded"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Proposals list */}
          <div className="flex w-full gap-y-3">
            <div className="flex flex-col w-full gap-3">
              {proposals.map((proposal) => (
                <Post
                  key={proposal.id}
                  id={proposal.id}
                  title={proposal.title}
                  postBy="Amarachi2944"
                  postImage={true}
                  postComments={286}
                  postStatus={"active"}
                  postDislikes={20}
                  profilePic={true}
                  postLikes={100}
                  description={proposal.summary}
                  postCreationDate={proposal.startDate}
                  postStartDate={proposal.startDate}
                  postEndDate={proposal.endDate}
                  postVotes={Number(proposal.yesVotes) + Number(proposal.noVotes) + Number(proposal.abstainVotes)}
                />
              ))}
            </div>
          </div>

          {/* Loading more indicator */}
          {isLoading && proposals.length > 0 && (
            <div className="flex justify-center my-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#1D54E1]"></div>
            </div>
          )}

          {/* Load more button */}
          {hasMore && !isLoading && (
            <div className="flex justify-center my-6">
              <button
                onClick={loadMoreProposals}
                disabled={isLoading || isRefreshing}
                className={`px-6 py-2 rounded-md ${
                  isLoading || isRefreshing
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#1D54E1] text-white hover:bg-[#1848c0] transition-colors"
                }`}
              >
                {isLoading ? "Loading..." : "Load More Proposals"}
              </button>
            </div>
          )}

          {/* No proposals message */}
          {!isLoading && proposals.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No proposals found. Be the first to create one!
            </div>
          )}

          {/* Pagination info */}
          {totalCount > 0 && (
            <div className="text-center text-sm text-gray-500 mb-4">
              Showing {proposals.length} of {totalCount} proposals
            </div>
          )}
        </div>
      </main>
    </ErrorBoundary>
  );
};

export default ProposalsHome;
