import React from 'react'


interface ImageBoxProps {
    icon?: string;
    reverse?: boolean;
    heading?: string;
    listItem?: boolean;
    subHeading?: string;
    items?: string[]
    image?: string; 
}

const ImageBox = ({reverse, heading, listItem, items, icon, subHeading, image}: ImageBoxProps) => {
  return (
    <section className='flex justify-self-center max-w-screen-2xl w-full px-4 md:px-10'>
        <main className={`flex w-full flex-col md:flex-row justify-between items-center ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 md:gap-10 py-6 md:py-10`}>
            <article className='w-full md:w-[35%] h-full flex flex-col justify-center items-start gap-y-4 mt-0 md:-mt-52'>
                <p className='text-[#003CB1] text-xl md:text-2xl font-medium'>{subHeading}</p>
                <div className='flex items-center gap-x-3 md:gap-x-6 w-full bg-[url(/LandingPage/heroBGImage.png)] bg-fit bg-no-repeat bg-cover rounded-xl p-2 md:p-3'>
                    <img src={icon} alt={heading + " icon"} className='w-8 h-8 md:w-auto md:h-auto' />
                    <h2 className='text-2xl md:text-[36px] font-semibold text-[#241B00]'>{heading}</h2>
                </div>
                {listItem && 
                items?.map((item, index) => (
                    <ul typeof='list-item' className='list-disc pl-5 w-full' key={index}>
                        <li key={index} className='text-base md:text-lg'>{item}</li>
                    </ul>
                ))}
            </article>

            <div className='w-full md:w-fit h-full relative flex mt-6 md:mt-0'>
                <img src={image} alt={heading + "image"} className='w-full md:w-auto' />
                <div className='absolute bg-gradient-to-t from-white from-[35%] to-transparent z-10 h-full w-full top-0'></div>
            </div>
        </main>
    </section>
  )
}

export default ImageBox