import React from "react";

const ProgressBar = ({ label, credits, percentage }) => {
  return (
    <div className="flex flex-col space-y-1">
      <p className="text-lg ">{label}</p>

      <div className="flex items-center justify-between">
        <p>
          <span className="font-bold text-lg">{credits}</span>
          <span className="text-gray-400 font-light"> credits</span>
        </p>
        <p className="text-right text-lg font-semibold text-gray-600">
          {percentage}%
        </p>
      </div>

      <div className="w-full bg-[#CAB745] rounded-full h-3.5 overflow-hidden">
        <div
          className="h-full bg-[#6F6500] rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
