import React from "react";

interface Community {
  name: string;
  members: string;
}

interface CommunitySectionProps {
  title: string;
  communities: Community[];
  showMoreText: string;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({
  title,
  communities,
  showMoreText,
}) => {
  return (
    <div className="w-full flex flex-col gap-y-1 pt-6">
      <h2 className="text-lg text-[#474747] mb-4">{title}</h2>
      <div className="space-y-4 rounded-lg border p-3 w-full">
        {communities.map((community, index) => (
          <div key={index} className="flex justify-between items-center w-full">
            <div>
              <h3 className="font-semibold text-[#474747] text-md">{community.name}</h3>
              <p className="text-sm text-[#ABABAB]">{community.members}</p>
            </div>
            <button type="button" className="text-sm text-white h-[25px] flex items-center justify-center bg-[#1B1B1B] w-[70px] rounded-full border border-[#F8B51C]">
              Joined
            </button>
          </div>
        ))}

        <button type="button">{showMoreText}</button>
      </div>
    </div>
  );
};

const CommunityList: React.FC = () => {
  const yourCommunities: Community[] = [
    { name: "KBM Community", members: "2.5k members" },
    { name: "Al School Community", members: "2.5k members" },
    { name: "Techfare Al Community", members: "2.5k members" },
  ];

  const relevantCommunities: Community[] = [
    { name: "KBM Community", members: "2.5k members" },
    { name: "Al Community", members: "2.5k members" },
    { name: "Tech Community", members: "2.5k members" },
  ];

  return (
    <div className="bg-white w-full">
      <CommunitySection
        title="Your communities"
        communities={yourCommunities}
        showMoreText="Show more"
      />
      <CommunitySection
        title="Relevant communities"
        communities={relevantCommunities}
        showMoreText="Show more"
      />
    </div>
  );
};

export default CommunityList;