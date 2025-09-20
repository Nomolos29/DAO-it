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
    <section className='flex justify-center w-full bg-[url(/LandingPage/what-makes-daoit-unique/what-makes-it-unique.png)] bg-center bg-contain bg-no-repeat px-4 md:px-5 lg:px-10 pt-[15%] md:pt-[22%] pb-[10%] md:pb-[15%]'>
        <main className='flex flex-col max-w-screen-2xl w-full border-[4px] bg-gradient-to-tr from-white/10 to-white/20 border-white rounded-[18px] p-4 md:p-6 lg:p-[36px] gap-y-6 lg:gap-y-10'>
            <h2 className='text-lg md:text-xl lg:text-[24px] font-medium text-center md:text-left'>What Makes <span className='text-[#003CB1]'>DAOit</span> Unique?</h2>

            {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-x-4'>
                {WhatMakesUniqueContent.map((item, index) => (
                    <div key={index} className='flex flex-col relative'>
                        <div className='flex flex-col gap-y-4 h-auto lg:h-[240px] p-4 lg:p-0'>
                            <img src={item.icon} alt={`${item.heading} icon`} className='w-10 h-10 md:w-12 md:h-12 mx-auto lg:mx-0' />
                            <div className='flex flex-col gap-y-2 text-center lg:text-left'>
                                <h3 className='text-base md:text-lg lg:text-[20px] font-semibold text-[#2E3035] leading-tight'>{item.heading}</h3>
                                <p className='text-sm md:text-base lg:text-[16px] text-[#5B5E65] leading-relaxed'>{item.details}</p>
                            </div>
                        </div>

                        {/* Divider - only show on desktop and not for last item */}
                        {WhatMakesUniqueContent.length !== (index + 1) && (
                            <div className='hidden lg:block absolute right-0 top-0 w-[1px] h-full bg-[#D6CDCD]' />
                        )}

                        {/* Mobile/Tablet horizontal divider */}
                        {WhatMakesUniqueContent.length !== (index + 1) && (
                            <div className='lg:hidden w-full h-[1px] bg-[#D6CDCD] mt-6' />
                        )}
                    </div>
                ))}
            </div>
        </main>
    </section>
  )
}

export default WhatMakesDaoitUnique