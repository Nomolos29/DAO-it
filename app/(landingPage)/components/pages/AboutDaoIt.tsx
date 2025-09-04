import React from 'react'

const AboutContent = [
    "DAOit is a Web3 powered platform transforming how educational communities govern, learn, and grow.",
    "Born from a vision to democratize school decision-making, DAOit now empowers institutions with tools for decentralized governance, financial inclusion, crisis response, and AI-backed insights.",
    "Through blockchain, smart contracts, and AI, DAOit creates trust-driven, equitable, and resilient learning ecosystems where every voice counts from students to policymakers."
]

const AboutDaoIt = () => {
  return (
    <section className='w-full flex justify-center'>
        <main className='flex flex-col md:flex-row justify-between items-center md:items-end w-full max-w-screen-2xl mx-auto px-4 md:px-10 py-6 md:py-10 gap-y-6 md:gap-x-10'>
            <div className='relative w-full md:w-1/2 h-full'>
                <img src="/LandingPage/homePageAboutFrame.png" alt="About DAOit section image" className='w-full h-auto' />
                <img src="/LandingPage/AboutSectionHome.png" alt="" className='absolute bottom-0 left-[10%] w-4/5 md:w-auto' />
                <div className="w-[45px] h-[45px] md:w-[65px] md:h-[65px] border-[8px] md:border-[12px] border-white bg-[#D6D5FF] rounded-full absolute top-[-5px] left-[-5px] z-10" />
            </div>

            <article className='flex flex-col w-full md:w-1/2 gap-y-3 md:gap-y-4'>
                {AboutContent.map((content, index) => (
                    <ul key={index} className='list-disc'>
                        <li key={index} className='text-lg sm:text-xl md:text-2xl font-medium text-[#5B5E65] mb-2 md:mb-4'>
                            {content}
                        </li>
                    </ul>
                ))}
            </article>
        </main>
    </section>
  )
}

export default AboutDaoIt