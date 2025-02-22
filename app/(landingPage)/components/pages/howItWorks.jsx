"use client"


import React from "react";
import { ReactSVG } from "react-svg";
import arrow from "../../../../public/sideArrow.svg";
import vote from "../../../../public/vote.svg";
import collaborate from "../../../../public/colab.svg";
import create from "../../../../public/idea.svg";
import execute from "../../../../public/join.svg";
import wallet from "../../../../public/wallet.svg";
import transparency from "../../../../public/transparency.svg";
import Card from "../../../../components/card";
import { Link } from "react-router-dom";

const cards = [
  {
    title: "Connect Wallet",
    description:
      "To join the DAOIt you have to connect your wallet either Metamask, wallet connect and form of decentralized wallet which you have.",
    Icon: wallet,
  },
  {
    title: "Creation Proposal",
    description:
      "Allow creation of proposal on smart contract based on new learning modules, school policies, learning methods and others. Proposal submissions, recording the proposal details which include it’s description, expiration date.",
    Icon: create,
  },
  {
    title: "Voting",
    description:
      "Enables the integration of blockchain-enabled voting methods such as quadratic voting, which ensures that participants with fewer tokens have a meaningful say in decisions, avoiding dominance by a single group.",
    Icon: vote,
  },
  {
    title: "Proposal Execution",
    description:
      "Upon the conclusion of a vote, the smart contract automatically triggers the proposed action which ensures auditability and effectives of proposals.",
    Icon: execute,
  },
  {
    title: "Collaboration Medium",
    description:
      "DAOIt introduces an inclusive participatory and a  global learning ecosystem, through decentralized finance (DeFi) tools, allowing participants to learn, contribute and interact with crypto wallets, trading platforms, and staking mechanisms.",
    Icon: collaborate,
  },
  {
    title: "Transparency & Auditability",
    description:
      "All transactions and decisions are recorded on a public blockchain. DAOIt aligns with global educational goals, particularly SDG 4.7, ensuring a transparent and auditable system by promoting inclusivity, peace and sustainability. ",
    Icon: transparency,
  },
];

const Works = () => (
  <section className="flex justify-center items-center w-full">
    <main className="flex flex-col items-center px-10 max-w-screen-2xl w-full">
      <section className="flex justify-center py-10 items-center text-center flex-col w-[1180px]">
        <h1 className="text-2xl md:text-5xl font-bold text-[#102325]">
          Your Guide to Decentralization
        </h1>
        <p className="mt-4 text-lg">
          Understand, Participate, and Lead with DAOIT. <br />See how our platform enables a new era of educational governance.
        </p>
        <div className="mt-6 flex gap-4">
          <Link to="/app">
            <button className="bg-gradient-to-r from-[#F8B51C] to-[#FEE539] hover:bg-yellow-600 text-black text-md py-3 rounded shadow-md shadow-[#F8B51C33] w-[200px] h-[54px]">
              Launch App
            </button>
          </Link>

          <button className="flex rounded-[8px] justify-center items-center w-[200px] h-[54px] bg-gradient-to-br from-[#3E4141] to-[#F8B91E] p-[1px]">
            <div className="flex items-center gap-4 justify-center bg-white h-full w-full rounded-[5px]">
              <p className="text-black">Explore Proposal</p>
              <ReactSVG src={arrow} />
            </div>
          </button>
        </div>
        <div className="mt-8">
          {/* <img
            src="/path/to/blockchain-image.png"
            alt="Blockchain graphic"
            className="mx-auto max-w-full"
          /> */}
        </div>
      </section>

      <div className="max-w-screen-2xl w-full px-10 flex flex-col items-center gap-y-5 pb-20">
          <div className="flex flex-col items-center text-center w-[800px] py-10 gap-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Take a Step at a Time
            </h2>
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

            <span className="h-[500px] w-[500px] rounded-full bg-[#fff8c6] absolute blur-[50px] right-[30%] top-[25%]"></span>
          </div>

          <button className="flex rounded-[8px] justify-center items-center bg-gradient-to-br from-[#3E4141] to-[#F8B91E] p-[1px] my-8">
            <div className="flex items-center gap-4 justify-center bg-white px-5 py-3 h-full w-full rounded-[5px]">
              <p className="text-black">Show more</p>
              <ReactSVG src={arrow} />
            </div>
          </button>

        </div>
    </main>
  </section>
);

export default Works;
