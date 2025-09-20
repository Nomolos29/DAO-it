import React from 'react'

interface DisplayCardProps {
    image: string,
    heading: string,
    description: string,
    listItem: string[]
}

const DisplayCard = ({image, heading, description, listItem}: DisplayCardProps) => (
    <main className='flex flex-col md:flex-row items-center gap-4 md:gap-x-6 lg:gap-x-10 w-full h-full border-[4px] border-white rounded-xl p-4 md:p-6 bg-[#F7F3FF]'>
        <img src={image} alt={heading} className='w-20 h-20 md:w-1/4 md:h-full object-contain flex-shrink-0' />
        <div className='text-[#5B5E65] text-sm md:text-base lg:text-lg w-full md:w-3/4 flex flex-col gap-y-2 text-center md:text-left'>
            <h3 className='text-lg md:text-xl lg:text-[30px] font-medium text-[#2E3035] leading-tight'>{heading}</h3>
            <p className='leading-relaxed'>{description}</p>
            <ul className='list-disc ml-0 md:ml-4 text-left'>
                {listItem.map((item, idx) => (
                    <li key={idx} className='leading-relaxed'>{item}</li>
                ))}
            </ul>
        </div>
    </main>
);


const WhoIsDaoitFor = () => {
  return (
    <section className='flex justify-center flex-col items-center w-full bg-[url(/LandingPage/WhoIsDaoitFor.png)] bg-center bg-contain bg-no-repeat pt-20 md:pt-40 pb-20 md:pb-60'>
        <h2 className='text-2xl md:text-3xl lg:text-[48px] font-semibold text-center py-[4%] px-4'>Who is DAOit for?</h2>

        {/* Mobile: Single column, Desktop: Two column grid */}
        <main className='flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-3 max-w-screen-2xl w-full px-4 md:px-10'>
            {/* Mobile: All cards in single column */}
            <div className='flex flex-col gap-6 lg:hidden'>
                <DisplayCard
                    image="/LandingPage/who-is-daoit-for/Educators.png"
                    heading="Educators & Admins"
                    description="Innovative leaders reimagining how schools are run."
                    listItem={[
                        "Transparent governance of budgets and resources",
                        "Real-time crisis response and collaboration tools",
                        "Protection and monetization of original content"
                    ]}
                />
                <DisplayCard
                    image="/LandingPage/who-is-daoit-for/Students.png"
                    heading="Students"
                    description="Empowered learners shaping their own education journey."
                    listItem={[
                        "Influence school decisions",
                        "Earn tokens for learning and participating",
                        "Build skills in Web3, governance, and collaboration"
                    ]}
                />
                <DisplayCard
                    image="/LandingPage/who-is-daoit-for/PolicyMaker.png"
                    heading="Policy Makers & NGOs"
                    description="Change-makers driving equitable and inclusive reform."
                    listItem={[
                        "Scalable models for education policy testing",
                        "Real-time data for decision-making and accountability",
                        "Community-funded initiatives and SDG alignment"
                    ]}
                />
                <DisplayCard
                    image="/LandingPage/who-is-daoit-for/Researcher.png"
                    heading="Researchers & Data Analysts"
                    description="Analysts seeking to decode behavior and transform systems."
                    listItem={[
                        "Access to anonymized, crowdsourced education data",
                        "Tools for sentiment and trend analysis",
                        "Transparent data provenance for reliable insights"
                    ]}
                />
            </div>

            {/* Desktop: Two column grid layout */}
            <div className='hidden lg:flex flex-col gap-3'>
                <div className='h-fit'>
                    <DisplayCard
                        image="/LandingPage/who-is-daoit-for/Educators.png"
                        heading="Educators & Admins"
                        description="Innovative leaders reimagining how schools are run."
                        listItem={[
                            "Transparent governance of budgets and resources",
                            "Real-time crisis response and collaboration tools",
                            "Protection and monetization of original content"
                        ]}
                    />
                </div>
                <div className='h-1/2'>
                    <DisplayCard
                        image="/LandingPage/who-is-daoit-for/PolicyMaker.png"
                        heading="Policy Makers & NGOs"
                        description="Change-makers driving equitable and inclusive reform."
                        listItem={[
                            "Scalable models for education policy testing",
                            "Real-time data for decision-making and accountability",
                            "Community-funded initiatives and SDG alignment"
                        ]}
                    />
                </div>
            </div>
            <div className='hidden lg:flex flex-col h-full gap-3'>
                <div className='h-2/5'>
                    <DisplayCard
                        image="/LandingPage/who-is-daoit-for/Students.png"
                        heading="Students"
                        description="Empowered learners shaping their own education journey."
                        listItem={[
                            "Influence school decisions",
                            "Earn tokens for learning and participating",
                            "Build skills in Web3, governance, and collaboration"
                        ]}
                    />
                </div>
                <div className='h-3/5'>
                    <DisplayCard
                        image="/LandingPage/who-is-daoit-for/Researcher.png"
                        heading="Researchers & Data Analysts"
                        description="Analysts seeking to decode behavior and transform systems."
                        listItem={[
                            "Access to anonymized, crowdsourced education data",
                            "Tools for sentiment and trend analysis",
                            "Transparent data provenance for reliable insights"
                        ]}
                    />
                </div>
            </div>
        </main>
    </section>
  )
}

export default WhoIsDaoitFor