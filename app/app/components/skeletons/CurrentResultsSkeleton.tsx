import React from 'react';

const CurrentResultsSkeleton = () => {
  return (
    <div className="py-3 w-full flex flex-col gap-y-3 animate-pulse">
      <section className="flex flex-col gap-y-5 rounded-[12px] bg-white p-[15px]">
        {/* Title */}
        <div className="h-7 bg-gray-200 rounded w-40" />

        <div className="w-full flex flex-col gap-y-2">
          {/* Vote option skeletons - 3 items */}
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex flex-col border-[#EDEDED] border rounded-[10px] p-3 gap-y-[12px]"
            >
              {/* Vote title */}
              <div className="h-5 bg-gray-200 rounded w-16" />

              {/* Credits and percentage */}
              <div className="flex w-full items-center text-sm justify-between">
                <div className="h-6 bg-gray-200 rounded w-24" />
                <div className="h-6 bg-gray-200 rounded w-12" />
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#DADADA] h-[10px] rounded-full overflow-hidden">
                <div className="bg-gray-300 h-full w-0" />
              </div>
            </div>
          ))}
        </div>

        {/* Vote button skeleton */}
        <div className="w-full h-14 bg-gray-200 rounded-[10px]" />
      </section>
    </div>
  );
};

export default CurrentResultsSkeleton;
