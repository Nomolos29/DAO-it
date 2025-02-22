

const FeatureSection = () => {
  return (
    <div className="px-10 relative pb-24">
      <div className="flex flex-col items-center md:gap-5 max-w-screen-2xl w-full">
        <div className="flex flex-col items-center text-center w-[800px] pb-10 gap-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            About <span className="text-[#ba8200b7]">DAOIt</span>
          </h2>
          <p className="text-[#777777] text-lg">DAOIt is a decentralized governance platform designed for educational institutions, using blockchain to enable transparent decision-making, financial inclusion, and collaborative learning.</p>
        </div>

        <section className="text-center md:text-left w-full py-[100px] relative px-[50px] bg-[#FFFCE7] overflow-hidden">
          <div className="flex justify-between w-full z-10">
            <span className="w-1/2 bg-[#ffd59a] h-fit rounded-[20px] p-[32px]">
              <h3 className="text-[40px] font-bold mb-4 text-[#241B00] leading-tight">
                Empowering Education Through Blockchain
              </h3>
              <p className="text-[#1B1B1B] text-xl">
                DAOIt is a decentralised governance platform designed for
                educational institutions, leveraging blockchain technology to
                facilitate democratic decision-making, financial inclusion, and
                collaborative learning. Aims to empower educators and students by
                providing them with tools for active participation, transparent
                governance, and hands-on blockchain experience.
              </p>
            </span>

            <img src="/LandingPage/blockChain.png" alt="block chain image representation" className="bg-contain -mt-12" />
          </div>

          <div className="flex justify-between w-full z-10">
            <img src="/LandingPage/recircle.png" alt="block chain image representation" className="bg-contain -mt-12 -mb-12" />

            <span className="w-1/2 bg-[#ffd59a] h-fit rounded-[20px] p-[32px]">
              <h3 className="text-[40px] font-bold mb-4 text-[#241B00] leading-tight">
                Promotion of sustainable practices and climate awareness in education
              </h3>
              <p className="text-[#1B1B1B] text-xl">
              DAOIt integrates blockchain tools for tracking carbon emissions and trading carbon credits, supporting educational institutions in adopting sustainable practices. The platform educates participants on the environmental impact of blockchain, advocating for energy-efficient models like Proof of Stake (PoS).
              </p>
            </span>
          </div>

          <div className="flex justify-between w-full z-10 pt-20">
            <span className="w-1/2 bg-[#ffd59a] h-fit rounded-[20px] p-[32px]">
              <h3 className="text-[40px] font-bold mb-4 text-[#241B00] leading-tight">
                AI-Powered Assistance
              </h3>
              <p className="text-[#1B1B1B] text-xl">
                DAOIt integrates AI to enhance efficiency and ease of use. Whether you are drafting a proposal, refining your ideas, or searching for relevant resources, AI helps streamline the process. With intelligent recommendations and automated assistance, users can create well-structured proposals, access valuable insights, and make informed decisions—faster and more effectively.
              </p>
            </span>

            <img src="/LandingPage/blockChain.png" alt="block chain image representation" className="bg-contain -mt-12" />
          </div>

          <img src="/LandingPage/bgImage.png" alt="block chain image representation" className="flex absolute top-0 z-0 -left-10" />

          <img src="/LandingPage/bgImage.png" alt="block chain image representation" className="flex absolute bottom-[250px] z-0 -right-[400px]" />
        </section>
      </div>
    </div>
  );
};

export default FeatureSection;
