import React from "react";

const ProposalCard = ({
  title,
  description,
  avatar,
  username,
  votes,
  voteBreakdown,
  timeRemaining,
  status,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "opened":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "pending":
        return "bg-yellow-500 hover:bg-yellow-600 text-[#494445]";
      case "closed":
        return "bg-gray-800 hover:bg-gray-900 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };
  const getActivityStyles = () => {
    switch (activity) {
      case "yes":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "no":
        return "bg-[#E27525]  text- text-white";
      case "abstain":
        return "bg-gray-800 hover:bg-gray-900 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const calculatePercentage = (voteCount) => {
    return votes === 0 ? 0 : Math.round((voteCount / votes) * 100);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt="User avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm text-gray-600 font-mono">
            {username ? `${username.slice(0, 6)}...${username.slice(-4)}` : 'Anonymous'}
          </span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      </div>

      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

      <div className="space-y-3">
        {voteBreakdown && (
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Yes</span>
                <div className="flex gap-2">
                  <span>{calculatePercentage(voteBreakdown.yes)}%</span>
                  <span className="text-gray-500">
                    ({voteBreakdown.yes} votes)
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded">
                <div
                  className="h-1.5 bg-green-500 rounded"
                  style={{ width: `${calculatePercentage(voteBreakdown.yes)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>No</span>
                <div className="flex gap-2">
                  <span>{calculatePercentage(voteBreakdown.no)}%</span>
                  <span className="text-gray-500">
                    ({voteBreakdown.no} votes)
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded">
                <div
                  className="h-1.5 bg-red-500 rounded"
                  style={{ width: `${calculatePercentage(voteBreakdown.no)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Abstain</span>
                <div className="flex gap-2">
                  <span>{calculatePercentage(voteBreakdown.abstain)}%</span>
                  <span className="text-gray-500">
                    ({voteBreakdown.abstain} votes)
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded">
                <div
                  className="h-1.5 bg-gray-400 rounded"
                  style={{ width: `${calculatePercentage(voteBreakdown.abstain)}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-sm text-gray-600 pt-2">
          <div>
            <span>Total Votes: {votes}</span>
            {voteBreakdown?.totalScore && (
              <span className="ml-4">
                Score: {voteBreakdown.totalScore.toFixed(2)}
              </span>
            )}
          </div>
          <span>{timeRemaining}</span>
        </div>
      </div>
    </div>
  );
};

export default ProposalCard;
