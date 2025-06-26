"use client"


import React from "react";
import { UserFlowContent } from "@/app/(landingPage)/lib/user-flow"
import { InnerPageHeroHeader } from "../../components";
import ImageBox from "../../components/global/ImageBox";



const HowItWorksPage = () => (
  <section className="flex justify-center items-center w-full">
    <main className="flex flex-col items-center w-full">
      <InnerPageHeroHeader leftSideHeading="Learn how" highLightText="DAOit" rightSideHeading="works step after step" paragraph="Join our Educational Decentralized Autonomous Organization (DAO)  to Learn, Collaborate, and Grow. We are Focus on  Empowering Students, Educators, and Administrators. Understand, Participate, and Lead with DAOIT. See how our platform enables a new era of educational governance." />

      <section className="flex flex-col w-full max-w-screen-2xl items-center gap-y-10">
        {UserFlowContent.map((step, index) => (
          <div key={index} className={`${index != 0 && "-mt-[13%]"} w-full`}>
            <ImageBox
              reverse={index % 2 === 1}
              heading={step.heading}
              icon={step.icon}
              image={step.imageUrl}
              listItem={true}
              items={step.listItems}
              subHeading={"Step " + (index + 1)}
            />
          </div>
        ))}
      </section>

      <section className="flex flex-col items-center w-full bg-[url(/LandingPage/communityExploration.png)] bg-left-top bg-no-repeat py-20 mb-10 -mt-40 px-10 z-10">
        <main className="flex flex-col items-center w-full max-w-screen-2xl px-4 py-6 md:px-10 gap-y-10">
          <h2 className="text-[30px] text-[#232426] font-medium text-center w-2/5">Learn about <span className="text-[#003CB1]">DAOit</span> Verification and Community Exploration</h2>

          <article className="flex flex-col gap-y-8 w-full">
            <div className="flex justify-between items-center w-full gap-x-36">
              <h3 className="text-4xl w-2/5">✅ Verify Your Identity</h3>
              <p className="w-3/5">DAOit is built on trust, transparency, and collaboration. To fully access the platform&apos;s core features , such as governance participation, funding opportunities, and advanced community tools , you&apos;ll need to complete a one-time identity verification process. This ensures that every participant is genuine, reducing spam, bots, and bad actors. It also helps build a reputation layer that supports long-term growth, accountability, and peer trust across the ecosystem.</p>
            </div>

            <div className="flex justify-between items-center gap-y-4 w-full gap-x-36">
              <h3 className="text-4xl w-2/5 leading-relaxed">🌐 Explore, Join & Build Communities</h3>
              <div className="w-3/5">
                <p>DAOit is more than a platform, it&apos;s a network of decentralized learning communities.</p>
                <ul className="list-disc pl-5 my-4">
                  <li>🔍 Explore existing communities aligned with your interests, whether in tech, policy, art, or science.</li>
                  <li>🤝 Join communities and collaborate with like-minded peers to co-learn, co-build, and co-govern.</li>
                  <li>🛠️ Build your own DAO if you have a vision for something new. You can launch a community around a course, project, mission, or field of study.</li>
                  <li>🌿 Create sub-communities within a larger DAO, like study groups, departments, regional chapters, or special interest circles.</li>
                </ul>
                <p>Every community on DAOit is a living ecosystem, where members can vote, share resources, run projects, and grow together, socially, intellectually, and economically.</p>
              </div>
            </div>
          </article>
        </main>
      </section>
    </main>
  </section>
);

export default HowItWorksPage;
