import { useState } from "react";
// import Card from "../Card";
import { IoIosPerson } from "react-icons/io";
import { HiChatBubbleOvalLeft } from "react-icons/hi2";
import { BiSolidLike, BiSolidDislike } from "react-icons/bi";
import Modal from "../Modal";
// import { Proposals } from "../../lib/ScreenData";
import Link from "next/link";
import { useGetAllProposals } from "@/app/app/hooks/useGetAllProposals";

const ProposalsHome = () => {
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
// href="/app/create-proposal"
  return (
    <main className="w-full px-2 flex flex-col min-h-screen overflow-auto scrollbar-hide pt-[140px] h-full">
      <div className="flex flex-col w-full h-[10px] gap-y-5">
        <div className="flex w-full justify-between items-center">
          <select name="status" id="" title="Status" className="w-[200px] h-[50px] outline-none bg-[#F8F8F8] rounded-full px-5 text-[#474747] text-[14px] font-semibold">
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>

          <Link href="/app/create-proposal">
            <button
              type="button"
              className="flex items-center gap-x-3 h-[50px] border w-[178px] justify-between px-[12px] border-[#1D54E1] rounded-[10px] text-[#1D54E1] hover:bg-[#F7F3FF] hover:text-[#1D54E1] transition-colors duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.41797 0.0742188C2.19141 0.382812 1.31641 1.3125 1.07031 2.57031C0.988281 3 0.988281 17 1.07031 17.4297C1.28516 18.5234 1.96875 19.3672 2.96875 19.7773C3.48047 19.9883 3.59766 20 5.36328 20C6.89062 20 7.00391 19.9961 7.14062 19.9258C7.32422 19.832 7.44141 19.707 7.51953 19.5234C7.67578 19.1406 7.51562 18.7031 7.14062 18.5117C7.00781 18.4414 6.89453 18.4375 5.63672 18.4375C4.89062 18.4336 4.16016 18.418 4.01562 18.4023C3.33203 18.3125 2.78125 17.8086 2.65625 17.1523C2.60156 16.8633 2.60156 3.13672 2.65625 2.84766C2.78125 2.19141 3.33203 1.6875 4.01562 1.59766C4.35938 1.55469 13.5703 1.55469 13.9141 1.59766C14.5977 1.6875 15.1484 2.19141 15.2734 2.84766C15.2969 2.97656 15.3125 4.03906 15.3125 5.58203V8.10938L15.4023 8.28125C15.4492 8.375 15.5547 8.50391 15.6367 8.57031C15.7617 8.67188 15.8281 8.69141 16.0508 8.70312C16.4414 8.72656 16.7148 8.56641 16.8555 8.23438C16.9414 8.02344 16.9453 3.01562 16.8594 2.57031C16.6055 1.28516 15.707 0.347656 14.4609 0.0625C14.2148 0.0078125 13.625 0 8.9375 0.00390625C4.07031 0.00390625 3.67188 0.0117188 3.41797 0.0742188Z" fill="#1D54E1"/>
                <path d="M4.58985 4.75C4.05079 5.02734 3.98829 5.73047 4.46485 6.10937L4.61719 6.23047L8.91016 6.24219C13.0742 6.25 13.207 6.25 13.3516 6.17578C13.9375 5.875 13.9375 5.0625 13.3516 4.76172C13.2109 4.6914 13.0586 4.6875 8.95704 4.6875C5.1836 4.6875 4.69532 4.69531 4.58985 4.75Z" fill="#1D54E1"/>
                <path d="M4.58985 7.875C4.05079 8.15234 3.98829 8.85547 4.46485 9.23437L4.61719 9.35547L8.91016 9.36719C13.0742 9.375 13.207 9.375 13.3516 9.30078C13.9375 9 13.9375 8.1875 13.3516 7.88672C13.2109 7.8164 13.0586 7.8125 8.95704 7.8125C5.1836 7.8125 4.69532 7.82031 4.58985 7.875Z" fill="#1D54E1"/>
                <path d="M16.0195 10.6836C15.707 10.7735 15.4883 10.8789 15.2187 11.0703C15.0898 11.1641 13.9765 12.25 12.7461 13.4844L10.5156 15.7227L10.375 16.1719C9.54686 18.8711 9.51951 18.9649 9.51561 19.2266C9.5117 19.4571 9.52733 19.5039 9.62889 19.6563C9.6953 19.7461 9.8203 19.8633 9.90233 19.9102C10.1797 20.0664 10.3359 20.043 12.0976 19.5547C12.9805 19.3086 13.7617 19.0781 13.8359 19.043C13.9062 19.0078 14.9961 17.9453 16.2539 16.6875C18.5312 14.4102 18.5469 14.3906 18.707 14.0625C19.0664 13.3242 19.0703 12.6133 18.7148 11.8946C18.457 11.3711 17.9648 10.9375 17.4101 10.7422C17.0898 10.6289 16.3359 10.5977 16.0195 10.6836ZM16.9023 12.2696C17.1523 12.3633 17.3828 12.6953 17.3828 12.9688C17.3828 13.1446 17.2656 13.3906 17.1211 13.5235L17.0078 13.6328L16.4844 13.1055L15.9609 12.5821L16.0742 12.4571C16.1406 12.3906 16.2461 12.3125 16.3086 12.2813C16.4492 12.2188 16.75 12.211 16.9023 12.2696ZM14.4414 16.1992L13.0078 17.6367L12.2578 17.8438C11.8476 17.9571 11.5078 18.043 11.5039 18.0391C11.4961 18.0313 11.5937 17.6992 11.7148 17.293L11.9336 16.5625L13.3711 15.1289L14.8086 13.6953L15.3437 14.2305L15.8789 14.7656L14.4414 16.1992Z" fill="#1D54E1"/>
                <path d="M4.58985 11C4.05079 11.2812 3.98829 11.9805 4.46485 12.3594L4.61719 12.4805H7.38282H10.1484L10.3008 12.3594C10.7266 12.0195 10.7266 11.418 10.3008 11.0781L10.1484 10.957L7.42969 10.9453C5.01563 10.9375 4.69532 10.9453 4.58985 11Z" fill="#1D54E1"/>
              </svg>

              Create proposal
            </button>
          </Link>
        </div>


        <div className="flex w-full gap-y-3">
          <div className="flex flex-col w-full gap-3">
            {proposals?.map((proposal) => (
              <div
                key={proposal.id}
                className="flex w-full flex-col h-fit gap-y-5 rounded-lg bg-[#F8F8F8] p-[30px]"
              >
                {/* Placeholder for proposer (not stored in contract) */}
                <div className="text-lg text-[#474747]">Username234</div>

                <article className="flex flex-col gap-y-4">
                  <Link href={`/app/${proposal.id}`}>
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
                              <HiChatBubbleOvalLeft />
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

      </div>
    </main>
  );
};

export default ProposalsHome;
