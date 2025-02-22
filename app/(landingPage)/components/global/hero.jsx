"use client"


import React, { useState } from "react";
// import { ReactSVG } from "react-svg";
// import arrow from "../../../../public/sideArrow.svg";
import { Link } from "react-router-dom";
// import Modal from "../../../utilies/modal";
// import coin from "../../../../public/coinbase.svg";
// import meta from "../../../../public/metamask.svg";
// import Phantom from "../../../../public/phantom.svg";

const HeroSection = () => {
  const [activeModal, setActiveModal] = useState(null);
  const closeModal = () => setActiveModal(null);

  return (
    <div className="flex justify-center relative">
      {/* <div className="absolute inset-0 bg-header-pattern bg-no-repeat bg-left-top transform scale-x-[-1] bg-[length:150%]"></div> */}
      <main className="flex justify-between max-w-screen-2xl w-full py-10 px-10">
        <section className="flex justify-center flex-col w-1/2">
          <h1 className="text-5xl md:text-5xl font-bold text-[#102325]">
            <span className="text-[#BA8100]">Building</span> a Collaborative Learning Community through Open & Inclusive Decision-Making
          </h1>
          <p className="mt-4 text-lg">
          Join our Educational Decentralized Autonomous Organization (DAO)  to Learn, Collaborate, and Grow. We are Focus on  Empowering Students, Educators, and Administrators In a Transparent, Open and Collaborative Decision-making Process.
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
                {/* <ReactSVG src={arrow} /> */}
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

        <img src="/LandingPage/heroImage.png" alt="Hero Image" className="w-[40%]" />
      </main>
      {/* <Modal
        isOpen={activeModal === "wallet"}
        onClose={closeModal}
        title="Choose a wallet"
      >
        <div className="flex flex-col justify-center items-center z-50">
          <Link to="/app">
            <button className="flex items-center justify-center w-[350px] px-4 py-2 bg-[#494445] my-1 rounded-lg">
              <span className="flex gap-2 items-center">
                <ReactSVG src={coin} />
                Coinbase
              </span>
            </button>
          </Link>
          <Link to="/app">
            <button className="flex items-center justify-center w-[350px] px-4 py-2 bg-[#494445] my-1 rounded-lg">
              <span className="flex gap-2 items-center">
                <ReactSVG src={meta} /> Metamask
              </span>
            </button>
          </Link>
          <Link to="/app">
            <button className="flex items-center justify-center w-[350px] px-4 py-2 bg-[#494445] my-1 rounded-lg">
              <span className="flex gap-2 items-center">
                <ReactSVG src={Phantom} /> Phantom
              </span>
            </button>
          </Link>
        </div>
      </Modal> */}
    </div>
  );
};

export default HeroSection;
