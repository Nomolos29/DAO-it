
import { useState } from "react";
import Card from "../Card";
import { IoIosPerson } from "react-icons/io";
import { HiChatBubbleOvalLeft } from "react-icons/hi2";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import Modal from "../Modal";
// import { Proposals } from "../../lib/ScreenData";
import Link from "next/link";
import { useGetAllProposals } from "@/app/app/hooks/useGetAllProposals";

const IntendingProposals = () => {
  const [postComment, setPostComment] = useState(false);
  const { proposals, isLoading, error } = useGetAllProposals();

  // Handle loading state
  if (isLoading) {
    return <div>Loading proposals...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error fetching proposals: {error.message}</div>;
  }

  return (
    <main className="w-full px-2 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
      <div className="flex flex-col w-full h-[10px] gap-y-5">
       
       <Card>
          <div className="flex w-full gap-y-3">
            <div className="flex flex-col w-full gap-3">
              {proposals?.map((proposal, index) => (
                <div
                  key={index}
                  className="flex w-full flex-col h-fit gap-y-5 rounded-lg bg-[#F8F8F8] p-[30px]"
                >
                  {/* Placeholder for proposer (not stored in contract) */}
                  <div className="text-lg text-[#474747]">Username234</div>

                  <article className="flex flex-col gap-y-4">
                    <Link href={`/app/proposals/${proposal.id.toString()}`}>
                      <h3 className="text-lg text-[#474747]">
                        {proposal.title}
                      </h3>
                    </Link>
                    <p className="text-md text-[#777777]">{proposal.summary}</p>

                    <section className="flex w-full justify-between items-center">
                      <div className="flex items-center gap-x-3 text-[14px] text-[#474747]">
                        <span
                          onClick={() => setPostComment(true)}
                          className="cursor-pointer flex items-center"
                        >
                          <HiChatBubbleOvalLeft className="text-lg" />0{" "}
                          {/* Comments not in contract */}
                        </span>
                        <span className="flex gap-x-1">
                          <BiSolidLike className="text-lg hover:text-yellow-500 bg-clip-text" />
                          0 {/* Likes not in contract */}
                        </span>
                        <span className="flex gap-x-1">
                          <BiSolidDislike className="text-lg" />0{" "}
                          {/* Dislikes not in contract */}
                        </span>
                      </div>

                      <div className="flex items-center gap-x-3 text-[#494445] text-[12px]">
                        <span>
                          {Number(proposal.yesVotes) +
                            Number(proposal.noVotes) +
                            Number(proposal.abstainVotes)}{" "}
                          votes
                        </span>
                        <span>
                          {new Date(
                            Number(proposal.endDate) * 1000
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </section>
                  </article>

                  {/* Comment Modal */}
                  <Modal
                    isOpen={postComment}
                    onClose={() => setPostComment(false)}
                    bgDarkened
                  >
                    <div className="w-[500px] flex flex-col gap-y-4">
                      <p className="text-[12px]">
                        Replying to{" "}
                        <span className="text-[#8A5A00]">username234</span>
                      </p>
                      <div className="flex flex-col gap-y-5 rounded-lg">
                        <div className="text-lg text-[#474747]">
                          Username234
                        </div>
                        <article className="flex flex-col gap-y-4">
                          <h3 className="text-lg text-[#474747]">
                            {proposal.title}
                          </h3>
                          <p className="text-md text-[#777777]">
                            {proposal.summary}
                          </p>
                          <section className="flex w-full justify-between items-center">
                            <div className="flex items-center gap-x-3 text-[14px] text-[#474747]">
                              <span
                                onClick={() => setPostComment(true)}
                                className="cursor-pointer"
                              >
                                <HiChatBubbleOvalLeft />0
                              </span>
                              <span>0</span>
                              <span>0</span>
                            </div>
                            <div className="flex items-center gap-x-3 text-[#494445] text-[12px]">
                              <span>
                                {Number(proposal.yesVotes) +
                                  Number(proposal.noVotes) +
                                  Number(proposal.abstainVotes)}
                              </span>
                              <span>
                                {new Date(
                                  Number(proposal.endDate) * 1000
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </section>
                        </article>
                      </div>
                      <div className="flex bg-[#F8F8F8] items-center w-full max-h-[100px] h-full px-5 gap-x-3 rounded-full cursor-pointer">
                        <div className="flex justify-center items-center rounded-full overflow-hidden">
                          <IoIosPerson className="text-[#ABABAB] text-2xl" />
                        </div>
                        <textarea
                          placeholder="Write a comment..."
                          className="w-full bg-transparent outline-none cursor-pointer"
                        />
                      </div>
                    </div>
                  </Modal>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default IntendingProposals;
