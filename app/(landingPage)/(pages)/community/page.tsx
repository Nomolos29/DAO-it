import React from 'react'
import { Button, FAQs, InnerPageHeroHeader } from '../../components'

const Features = [
  {
    title: "Smart Contract Integration",
    text: "Discover an automated governance, proposal creation, voting contract, and decision-making processes via blockchain smart contracts.",
  },
  {
    title: "DAOit Impact on Sustainable Environmental Practices ",
    text: "Blockchain-based climate management tools for tracking carbon emissions, Carbon Credits Trading and educating users on sustainability practices.",
  },
  {
    title: "DAOit Impact on Sustainable Environmental Practices",
    text: "Blockchain-based climate management tools for tracking carbon emissions, Carbon Credits Trading and educating users on sustainability practices.",
  }
]

const Community = () => {
  return (
    <div className='flex flex-col items-center'>
        <InnerPageHeroHeader highLightText='Building' rightSideHeading='Together' paragraph='Join the Movement for Transparent and Collaborative Education. "Shape the future of learning through innovation and collective decision-making”.' />

        <main className='flex flex-col items-center w-full max-w-screen-2xl py-10 gap-y-10'>
            <section className="flex justify-center items-center text-center flex-col pt-16 w-full px-4 md:w-[1180px]">
                <h1 className="text-2xl md:text-5xl font-semibold text-[#102325]">
                    Join the Daoit Community
                </h1>
                <p className="mt-4 text-base md:text-lg w-full md:w-4/6">
                    Looking to learn more about Daoit? No worries, get access to the best resource available in order to get educated and become part of the community.
                </p>
                <div className="mt-6 flex flex-col md:flex-row gap-4 md:gap-6 w-full md:w-auto justify-center">
                    <Button text='Join us on Discord' href='#' className="w-full md:w-auto" />
                    <Button text='Join us on X' href='#' className="w-full md:w-auto" />
                </div>
            </section>

            <section className="flex justify-center w-full">
                <div className='flex flex-col items-center pb-10 w-full max-w-screen-2xl mx-auto px-5 py-10 gap-y-20'>
                    {Features.map((feature, index) => (
                        <div key={index} className="w-full md:w-1/3 flex flex-col text-center">
                            <h2 className="text-xl md:text-2xl text-[#102325]">{feature.title}</h2>
                            <p className="mt-4 text-[#474747]">{feature.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            <FAQs />
        </main>
    </div>
  )
}

export default Community