// import WalletButton from "@/components/walletButton";
import Header from "../layout/Header";
import Button from "./Button";

const HeroSection = () => {

  return (
    <div className="flex flex-col justify-center items-center overflow-hidden relative bg-[url(/LandingPage/heroBGImage.png)] bg-fit bg-no-repeat bg-cover w-full">
      <Header />
      {/* <div className="absolute inset-0 bg-header-pattern bg-no-repeat bg-left-top transform scale-x-[-1] bg-[length:150%]"></div> */}
      <main className="flex flex-col-reverse md:flex-row items-center text-center md:text-left justify-between max-w-screen-2xl w-full py-6 px-4 md:px-10 md:pb-36 md:pt-20">
        <section className="flex justify-center gap-y-5 md:gap-y-7 flex-col w-full md:w-1/2 z-[1] mt-6 md:mt-0">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#102325]">
            <span className="text-[#1D54E1]">Building</span> a Collaborative Learning Community through Open & Inclusive Decision-Making
          </h1>
          <p className="text-base sm:text-lg md:text-xl">
          Join our Educational Decentralized Autonomous Organization (DAO)  to Learn, Collaborate, and Grow. We are Focus on  Empowering Students, Educators, and Administrators In a Transparent, Open and Collaborative Decision-making Process.
          </p>
          <div className="flex justify-center md:justify-start">
            <Button fullWidth />
          </div>
          {/* <WalletButton /> */}
        </section>

        <div className="w-full sm:w-[80%] md:w-[40%] relative z-[1] mb-4 md:mb-0">
          <img src="/LandingPage/heroImageNew.png" alt="Hero Image" width={0} height={0} className="w-full" />

          <div>
            <div className="w-[40px] h-[40px] sm:w-[65px] sm:h-[65px] border-[8px] sm:border-[12px] border-[#EAE4FA] bg-[#D6D5FF] rounded-full absolute top-[-5px] left-[-5px] z-10" />
            <div className="w-[40px] h-[40px] sm:w-[65px] sm:h-[65px] border-[8px] sm:border-[12px] border-[#EAE4FA] bg-[#D6D5FF] rounded-full absolute bottom-[-10px] right-[-10px] z-10" />
          </div>
        </div>
      </main>

      <svg
        className="absolute lg:bottom-[-25%]  left-0 w-full transform -rotate-3 scale-x-[-1]"
        viewBox="0 0 1140 350"
        preserveAspectRatio="none"
      >
        <path
          fill="#ffffff"
          d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,213.3C840,224,960,224,1080,197.3C1200,171,1320,117,1380,90.7L1440,64L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        />
      </svg>
    </div>
  );
};

export default HeroSection;
