import React from "react";
import Card from "@/components/card";
import vote from "../../../../public/vote.svg";
import Link from "next/link";
// import collaborate from "../../../../../public/colab.svg";
// import proposal from "../../../../../public/LandingPage/proposal.png"
// import wallet from "../../../../public/Group 17.svg";
// import arrow from "../../../../public/sideArrow.svg";

const HowItWorks = () => {
  const cards = [
    {
      title: "Connect Wallet",
      description:
        "To join the DAOIt you have to connect your wallet either Metamask, wallet connect and form of decentralized wallet which you have.",
      Icon: '/LandingPage/wallet.svg',
    },

    {
      title: "Proposals and  Voting",
      description:
        "Create proposals, discuss and vote on new learning modules, school policies, learning methods which allows inclusivity of all participants in decision making.",
      Icon: vote,
    },

    {
      title: " Creation Proposal",
      description:
        "Allow creation of proposal on smart contract based on new learning modules, school policies, learning methods and others. Proposal submissions, recording the proposal details which include it’s description, expiration date.",
      Icon: '/LandingPage/proposal.png',
    },

    {
      title: "Proposal Execution ",
      description:
        "Upon the conclusion of a vote, the smart contract automatically triggers the proposed action which ensures auditability and effectives of proposals.",
      Icon: '/LandingPage/proposal.png',
    }
  ];

  return (
    <section className="flex justify-center">
      <div className="relative z-10 ">
        <div className="max-w-screen-2xl w-full px-10 flex flex-col items-center gap-y-5">
          <div className="flex flex-col items-center text-center w-[790px] py-10 gap-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              How <span className="text-[#BA8100]">DAOIt</span> Works
            </h2>
            <p className="text-[#777777] text-lg">We&apos;ve simplified the entire process, so you can focus on what truly matters—collaborating, voting, and shaping the future of education with ease.</p>
          </div>


          <div className="flex flex-wrap justify-between w-[90%] gap-10 py-5 relative">
            {cards.map((card, index) => (
              <div key={index} className="w-[45%] h-[440px] z-10">
                <Card
                  key={index}
                  title={card.title}
                  description={card.description}
                  svgSrc={card.Icon}
                />
              </div>
            ))}

            <span className="h-[500px] w-[500phow-it-worksx] rounded-full bg-[#fff8c6] absolute blur-[50px] right-[30%] top-[25%]"></span>
          </div>

          <Link href="/how-it-works">
            <button type="button" className="flex rounded-[8px] justify-center items-center bg-gradient-to-br from-[#3E4141] to-[#F8B91E] p-[1px] mt-8">
              <div className="flex items-center gap-4 justify-center bg-white px-5 py-3 h-full w-full rounded-[5px]">
                <p className="text-black">Show more</p>
                {/* <ReactSVG src={arrow} /> */}
              </div>
            </button>
          </Link>

        </div>
        {/* <div className="py-16 px-8">
          <div className="flex flex-col md:flex-row items-center md:gap-5 md:space-x-8">
            <div className="text-center md:text-left max-w-2xl">
              <h3 className="text-[40px] font-bold mb-4 text-yellow-600">
                Promotion of sustainable practices and climate awareness in
                education
              </h3>
              <p className="text-gray-600 text-2xl">
                DAOIt integrates blockchain tools for tracking carbon emissions
                and trading carbon credits, supporting educational institutions
                in adopting sustainable practices. The platform educates
                participants on the environmental impact of blockchain,
                advocating for energy-efficient models like Proof of Stake
                (PoS).
              </p>
            </div>
            <ReactSVG src={global} />
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default HowItWorks;
