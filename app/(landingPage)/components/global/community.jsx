import React from "react";
import { Link } from "react-router-dom";

const JoinCommunity = () => {
  return (
    <section className="w-full flex justify-center items-center bg-[url('/LandingPage/joinCommunityBg.jpg')]">
      <main className="w-full h-[650px] flex justify-center items-center text-center  text-white bg-[#000000BD]">
        <div className="w-[845px] flex flex-col gap-y-5">
          <h2 className="text-2xl md:text-[48px] font-bold">
            Join the Daoit Communtity
          </h2>
          <p className="mt-10 text-[22px]">
            Looking to learn more about Doait? No worries, get access to the best resource available on order to get educated and become part of the community. 
          </p>
          <div className="mt-6 flex justify-center gap-x-[32px]">
            <Link to="#">
              <button className="bg-gradient-to-r from-[#F8B51C] to-[#FEE539] hover:bg-yellow-600 text-black text-md py-3 rounded-[8px] shadow-md shadow-[#F8B51C33] w-[200px] h-[54px]">
                Join us on Discord
              </button>
            </Link>

            <Link to="#">
              <button className="bg-gradient-to-r from-[#F8B51C] to-[#FEE539] hover:bg-yellow-600 text-black text-md py-3 rounded-[8px] shadow-md shadow-[#F8B51C33] w-[200px] h-[54px]">
                Join us on X
              </button>
            </Link>
          </div>
        </div>
      </main>
    </section>
  );
};

export default JoinCommunity;
