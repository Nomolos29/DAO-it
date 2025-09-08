import React from 'react'

interface DisplayCardProps {
    image: string,
    heading: string,
    description: string,
    listItem: string[]
}

const DisplayCard = ({image, heading, description, listItem}: DisplayCardProps) => (
    <main className='flex flex-col md:flex-row items-center gap-y-4 md:gap-x-10 w-full h-full border-[4px] border-white rounded-xl p-4 md:p-6 bg-[#F7F3FF]'>
        <img src={image} alt={heading} className='w-1/2 md:w-1/4 h-auto md:h-full' />
        <div className='text-[#5B5E65] text-base md:text-lg w-full md:w-3/4 flex flex-col gap-y-2'>
            <h3 className='text-xl sm:text-2xl md:text-[30px] font-medium text-[#2E3035] text-center md:text-left'>{heading}</h3>
            <p className='text-center md:text-left'>{description}</p>
            <ul className='list-disc ml-4'>
                {listItem.map((item, idx) => (
                    <li key={idx} className='text-sm md:text-base'>{item}</li>
                ))}
            </ul>
        </div>
    </main>
);


const WhoIsDaoitFor = () => {
  return (
    <section className='flex justify-center flex-col items-center w-full bg-[url(/LandingPage/WhoIsDaoitFor.png)] bg-center bg-contain bg-no-repeat pt-20 md:pt-40 pb-30 md:pb-60'>
        <h2 className='text-3xl md:text-[48px] font-semibold text-center py-[4%]'>Who is DAOit for?</h2>
        <main className='grid grid-cols-1 md:grid-cols-2 gap-3 h-auto md:h-[570px] max-w-screen-2xl w-full px-4 md:px-10'>
            <div className='flex flex-col grid-cols-1 gap-3'>
                <div className='h-fit'>
                    <DisplayCard
                    image="/LandingPage/who-is-daoit-for/Educators.png"
                    heading="Educators & Admins"
                    description="Innovative leaders reimagining how schools are run."
                    listItem={
                        [
                            "Transparent governance of budgets and resources",
                            "Real-time crisis response and collaboration tools",
                            "Protection and monetization of original content"
                        ]
                    }
                  />
                </div>
                <div className='h-auto md:h-1/2'>
                    <DisplayCard
                    image="/LandingPage/who-is-daoit-for/PolicyMaker.png"
                    heading="Policy Makers & NGOs"
                    description="Change-makers driving equitable and inclusive reform."
                    listItem={
                        [
                            "Scalable models for education policy testing",
                            "Real-time data for decision-making and accountability",
                            "Community-funded initiatives and SDG alignment"
                        ]
                    }
                  />
                </div>
            </div>
            <div className='flex flex-col grid-cols-1 h-full gap-3'>
                <div className='h-auto md:h-2/5'>
                    <DisplayCard
                    image="/LandingPage/who-is-daoit-for/Students.png"
                    heading="Students"
                    description="Empowered learners shaping their own education journey."
                    listItem={
                        [
                            "Influence school decisions",
                            "Earn tokens for learning and participating",
                            "Build skills in Web3, governance, and collaboration"
                        ]
                    }
                  />
                </div>
                <div className='h-auto md:h-3/5'>
                    <DisplayCard
                    image="/LandingPage/who-is-daoit-for/Researcher.png"
                    heading="Researchers & Data Analyts"
                    description="Analysts seeking to decode behavior and transform systems."
                    listItem={
                        [
                            "Access to anonymized, crowdsourced education data",
                            "Tools for sentiment and trend analysis",
                            "Transparent data provenance for reliable insights"
                        ]
                    }
                  />
                </div>
            </div>
        </main>
    </section>
  )
}

export default WhoIsDaoitFor