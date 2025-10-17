import React from 'react';

const ProposalDetailsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-3 animate-pulse">
      {/* Post header skeleton */}
      <div className="rounded-[10px] flex flex-col gap-y-[19px]">
        <section className="flex justify-between items-center">
          <div className="flex items-center gap-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex flex-col gap-y-1">
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="h-3 bg-gray-200 rounded w-24" />
            </div>
          </div>
          {/* Status badge */}
          <div className="w-[84px] h-7 bg-gray-200 rounded-[5px]" />
        </section>

        {/* Image */}
        <div className="w-full h-[202px] bg-gray-200 rounded" />

        {/* Content */}
        <section className="flex flex-col gap-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </section>

        {/* Footer */}
        <section className="flex justify-between items-center">
          <div className="flex items-center gap-x-3">
            <div className="h-5 bg-gray-200 rounded w-24" />
            <div className="h-5 bg-gray-200 rounded w-20" />
            <div className="h-5 bg-gray-200 rounded w-24" />
          </div>
        </section>
      </div>

      {/* Proposal details content skeleton */}
      <div className="bg-white rounded-[10px] p-4 flex flex-col gap-y-4">
        <div className="h-6 bg-gray-200 rounded w-48" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-4/5" />
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailsSkeleton;
