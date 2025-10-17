import React from 'react';

const PostSkeleton = () => {
  return (
    <div className="border-[#D5D5D5] border p-[15px] rounded-[10px] flex flex-col gap-y-[19px] animate-pulse">
      {/* Header section */}
      <section className="flex justify-between items-center">
        <div className="flex items-center gap-x-3">
          {/* Profile pic skeleton */}
          <div className="w-10 h-10 bg-gray-200 rounded-full" />

          <div className="flex flex-col gap-y-1">
            {/* Proposal by line */}
            <div className="flex items-center gap-x-2">
              <div className="h-4 bg-gray-200 rounded w-32" />
              <div className="h-4 bg-gray-200 rounded w-8" />
            </div>
            {/* Location line */}
            <div className="h-3 bg-gray-200 rounded w-24" />
          </div>
        </div>
      </section>

      {/* Content section */}
      <div className="flex flex-col gap-y-3">
        <section className="flex flex-col gap-y-2">
          {/* Title */}
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </section>

        {/* Image skeleton */}
        <section className="w-full h-[202px] bg-gray-200 rounded" />
      </div>

      {/* Footer section */}
      <section className="flex justify-between items-center">
        <div className="flex items-center gap-x-3">
          {/* Comments */}
          <div className="h-5 bg-gray-200 rounded w-24" />
          {/* Likes */}
          <div className="h-5 bg-gray-200 rounded w-20" />
          {/* Dislikes */}
          <div className="h-5 bg-gray-200 rounded w-24" />
        </div>

        <div className="flex items-center gap-x-3">
          {/* Ends in */}
          <div className="h-5 bg-gray-200 rounded w-28" />
        </div>
      </section>
    </div>
  );
};

export default PostSkeleton;
