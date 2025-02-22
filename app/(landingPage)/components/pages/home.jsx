import React from "react";
import { HeroSection, HowItWorks, FAQs, FeatureSection, JoinCommunity } from "./details";
function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />
      <HowItWorks />
      <span className="bg-[#777777] h-[1px] w-[570px] my-28"></span>
      <FeatureSection />
      <JoinCommunity />
      <FAQs />
    </div>
  );
}

export default Home;
