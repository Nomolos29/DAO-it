import React from 'react'

const WhatMakesUniqueContent = [
    {
        icon: "/LandingPage/what-makes-daoit-unique/home.png",
        heading: "Decentralized Educational Governance",
        details: "Empower every stakeholder—students, teachers, administrators—to propose, vote, and shape institutional change transparently."
    },
    {
        icon: "/LandingPage/what-makes-daoit-unique/clock.png",
        heading: "Real-time Crisis Response",
        details: "GIS-linked sensors and smart contracts enable instant community-led responses to emergencies affecting schools."
    },
    {
        icon: "/LandingPage/what-makes-daoit-unique/coins.png",
        heading: "Token-Based Incentives & Financial Inclusion",
        details: "Earn DAOit tokens for learning, proposing, voting, and contributing redeemable for scholarships, grants, or influence."
    },
    {
        icon: "/LandingPage/what-makes-daoit-unique/brain.png",
        heading: "AI-Driven Insight & Sentiment Analysis",
        details: "Dashboards visualize how your community feels, behaves, and engages fueling smarter, people-first decisions."
    }
]

const WhatMakesDaoitUnique = () => {
  return (
    <section className='flex justify-center w-full bg-[url(/LandingPage/what-makes-daoit-unique/what-makes-it-unique.png)] bg-center bg-contain bg-no-repeat px-4 sm:px-5 md:px-10 pt-[22%] pb-[15%]'>
        <main className='flex flex-col max-w-screen-2xl w-full border-[4px] bg-gradient-to-tr from-white/10 to-white/20 border-white rounded-[18px] p-4 sm:p-6 md:p-[36px] gap-y-6 md:gap-y-10'>
            <h2 className='text-xl sm:text-[24px] font-medium'>What Makes <span className='text-[#003CB1]'>DAOit</span> Unique?</h2>

            <div className='flex flex-col md:flex-row gap-y-6 md:gap-y-0 md:gap-x-4'>
                {WhatMakesUniqueContent.map((item, index) => (
                    <div key={index} className='flex justify-between gap-x-5'>
                        <div className='flex flex-col justify-between gap-x-4 h-auto md:h-[240px]'>
                            <img src={item.icon} alt={`${item.heading} icon`} className='w-10 h-10 md:w-12 md:h-12' />
                            <div className='flex flex-col gap-y-2 justify-between h-full mt-4 md:mt-6'>
                                <h3 className='text-base sm:text-lg md:text-[20px] font-semibold text-[#2E3035]'>{item.heading}</h3>
                                <p className='text-sm md:text-[16px] text-[#5B5E65]'>{item.details}</p>
                            </div>
                        </div>

                        {WhatMakesUniqueContent.length != (index+1) && <div className='hidden md:block w-[1px] h-full bg-[#D6CDCD]' />}
                    </div>
                ))}
            </div>
        </main>
    </section>
  )
}

export default WhatMakesDaoitUnique