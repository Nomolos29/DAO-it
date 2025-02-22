const VoteItem = ({ label, imageSrc, address, credits }) => {
  return (
    <div className="p-4 border-b border-b-[#E6E6E6EE] ">
      <div className="text-lg font-semibold text-gray-900 pb-4">{label}</div>

      <div className="flex items-center space-x-4">
        <div>
          <img
            src={imageSrc}
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </div>

        <div className="text-gray-400 text-sm font-medium flex-1">
          {address}
        </div>

        <div className="text-gray-800 font-semibold text-lg">
          {credits}
          <span className="text-gray-500 text-sm"> credits</span>
        </div>
      </div>
    </div>
  );
};

export default VoteItem;
