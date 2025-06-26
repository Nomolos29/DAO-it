import React from "react";
import { HeroSection, FAQs, GlobalLearning, WhatIsDaoIt, AboutDaoIt, WhatMakesDaoitUnique, UserFlow, WhoIsDaoitFor } from "../components";



const Home = () => {
  return (
    <div className="flex flex-col items-center overflow-hidden">
      <HeroSection />
      <WhatIsDaoIt />
      <AboutDaoIt />
      <WhatMakesDaoitUnique />
      <UserFlow />
      <WhoIsDaoitFor />
      <FAQs />
      <GlobalLearning />
    </div>
  );
}

export default Home;
