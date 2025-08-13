
import ReactMarkdown from 'react-markdown';

interface ProposalDetailProps {
  fullDescription: string;
  yesVotes: number;
  noVotes: number;
  abstainVotes: number;
}


const ProposalDetail: React.FC<ProposalDetailProps> = ({
  yesVotes,
  noVotes,
  abstainVotes,
  fullDescription
}) => {
  // const [status, setStatus] = useState("Active")
  console.log("Proposal Details:", fullDescription);

  const status: string = "Active";
  return (

      <main className="flex h-full flex-col gap-y-3">
        <div className="flex flex-col gap-y-3 w-full h-full p-1">

          {/* Proposal Header Section */}
          <section className="bg-[#F8F8F8] rounded-[10px] p-[30px] flex flex-col gap-y-5">
            <div>
              <p className="font-medium">Proposal by:</p>
              <div>
                <h5>Username234</h5>
              </div>
            </div>

            {/* <p className='font-medium'>Proposal ID: {id}</p> */}

            <div>
              <p>Status</p>
              <div
                className={`border px-[10px] py-[4px] w-fit rounded-[8px] ${
                  status === "Active"
                    ? "border-[#60CF0B]"
                    : status === "Closed"
                    ? "border-[#FF0000]"
                    : "border-[#FFA500]"
                }`}
              >
                {status}
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="bg-[#F8F8F8] rounded-[10px] p-[20px]">
            <h3>Timeline</h3>
            <div className="flex flex-col gap-y-4">
              {/* <span>
                <p>Start date</p>
                <h4>{new Date(postCreationDate * 1000).toLocaleDateString()}</h4>
              </span> */}

              <div className="w-[65px] h-[1px] bg-[#777777]"></div>

              {/* <span>
                <p>End date</p>
                <h4>{new Date(postEndDate * 1000).toLocaleDateString()}</h4>
              </span> */}
            </div>
          </section>

          {/* Voting Results Section */}
          <section className="bg-[#F8F8F8] rounded-[10px] p-[20px]">
            <h3>Voting Results</h3>
            <div className="mt-3">
              <div className="flex justify-between mb-2">
                <span>Yes Votes: {yesVotes}</span>
                <span>No Votes: {noVotes}</span>
                <span>Abstain: {abstainVotes}</span>
              </div>
              {/* Add a progress bar here if you want */}
            </div>
          </section>

          {/* Proposal Details Section */}
          <section className="bg-[#F8F8F8] rounded-[10px] p-[20px]">
            <h3 className='text-2xl font-semibold mb-5'>Full Proposal Details</h3>
            <ReactMarkdown>{fullDescription}</ReactMarkdown>
          </section>
        </div>
      </main>

  );
};

export default ProposalDetail;
