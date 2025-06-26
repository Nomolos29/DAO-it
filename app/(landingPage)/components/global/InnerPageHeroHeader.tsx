import React from 'react'
import Button from './Button'
import Header from '../layout/Header'

interface InnerPageHeroHeaderProps {
    leftSideHeading?: string;
    rightSideHeading?: string;
    highLightText?: string;
    paragraph?: string;
    buttonText?: string;
    buttonHref?: string;
}

const InnerPageHeroHeader:React.FC<InnerPageHeroHeaderProps> = ({leftSideHeading, rightSideHeading, highLightText, paragraph, buttonHref, buttonText}) => {
  return (
    <header className="flex flex-col justify-center items-center relative overflow-hidden bg-[url(/LandingPage/heroBGImage.png)] bg-fit bg-no-repeat bg-cover w-full">
      <Header />
      <main className="flex flex-col-reverse md:flex-row text-center md:text-left justify-between max-w-screen-2xl w-full py-10 md:px-10 md:pt-28 md:pb-40">
        <section className="flex justify-center gap-y-10 flex-col w-[calc(100vw-30px)] md:w-1/2">
          <h1 className="text-2xl md:text-3xl font-medium text-[#102325] w-full md:w-4/6">{leftSideHeading || ''}
            <span className="text-[#1D54E1]"> {highLightText}</span> {rightSideHeading || ''}
          </h1>
          <Button href={buttonHref} text={buttonText} />
        </section>

        <div className="w-1/2 flex justify-end">
            <p className='w-[75%]'>{paragraph}</p>
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
    </header>
  )
}

export default InnerPageHeroHeader