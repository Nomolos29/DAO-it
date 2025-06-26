"use client"


import { HiArrowTurnRightDown } from "react-icons/hi2";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import { introduction } from "../../lib/documentation"
import slugify from "slugify";
import { useState } from 'react';
import Link from "next/link";
import { InnerPageHeroHeader } from "../../components";




const DocumentationPage = () => {

    const[ open, setOpen ] = useState(false)

    return (
        <section className="flex flex-col items-center w-full">
            <InnerPageHeroHeader highLightText="Developers" rightSideHeading="Community" paragraph='Join the Movement for Transparent and Collaborative Education. "Shape the future of learning through innovation and collective decision-making”.' />

            <div className="flex flex-col px-10 max-w-screen-2xl md:flex-row w-full gap-x-10 py-20">

                <section className={`p-5 border bg-white rounded-lg flex flex-col gap-y-10 w-full md:w-[30%] h-screen md:h-fit overflow-y-scroll md:overflow-hidden fixed md:relative md:hidden z-50 ${open ? "top-[0%] pb-10" : "top-[92%]"}`} onClick={() => {setOpen(!open)}}>
                    <h3 className="font-bold text-lg flex justify-between items-center" >ON THIS PAGE {open ? <FaAngleDown /> : <FaAngleUp />}</h3>
                    <div className={`flex-col gap-y-10 ${open ? "flex" : "hidden"}`}>
                        {introduction.map((term, index) => (
                            <Link key={index} href={`#${slugify(term.heading)}`} scroll={false} onClick={() => {setOpen(!open)}}>
                                <div className="flex items-center w-full justify-between gap-x-5">
                                    <span className="text-lg w-[90%] text-[#707070] hover:text-black cursor-pointer line-clamp-1">
                                        {term.heading}
                                    </span>
                                    <HiArrowTurnRightDown className="text-lg w-[20px]" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className={`p-5 border bg-white rounded-lg md:flex flex-col gap-y-10 w-[30%] h-fit hidden`}>
                    <h3 className="font-bold text-[22px] pb-3" >ON THIS PAGE</h3>
                    <div className={`flex flex-col gap-y-10`}>
                        {introduction.map((term, index) => (
                            <Link key={index} href={`#${slugify(term.heading)}`} scroll={false}>
                                <div className="flex items-center w-full justify-between gap-x-5">
                                    <span className="text-xl w-[90%] text-[#707070] hover:text-black cursor-pointer line-clamp-1">
                                        {term.heading}
                                    </span>
                                    <HiArrowTurnRightDown className="text-lg w-[20px]" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <main className="flex flex-col w-full md:w-[70%] gap-y-4 px-5 md:px-0">
                {introduction.map((term, index) => (
                    <div key={index} id={slugify(term.heading)} className={`${index === 0 ? "pt-0" : "pt-10 md:pt-14"}`}>
                        <span className={`w-[90%] text-black font-bold text-3xl`}>
                            {term.heading}
                        </span>

                        <div className="flex flex-col gap-y-5 text-lg md:text-xl pt-5">
                            {term.contents.map((content, index) => (
                                <p key={index} className={`${content.important ? "uppercase font-medium" : ""}`}>{content.text}</p>
                            ))}
                        </div>
                    </div>
                ))}
                </main> 
            </div>
        </section>
    )
}

export default DocumentationPage