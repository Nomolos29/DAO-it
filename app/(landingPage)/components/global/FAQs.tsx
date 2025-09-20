"use client"


import React, { useState } from "react";

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is DAOIt?",
      answer: "Looking to learn more about Doait? No worries, get access to the best resource available on order to get educated and become part of the community. "
    },
    {
      question: "How does DAOIt work?",
      answer: "Looking to learn more about Doait? No worries, get access to the best resource available on order to get educated and become part of the community. "
    },
    {
      question: "What role does AI play in DAOIt?",
      answer: "Looking to learn more about Doait? No worries, get access to the best resource available on order to get educated and become part of the community. "
    },
    {
      question: "Is DAOIt secure?",
      answer: "Looking to learn more about Doait? No worries, get access to the best resource available on order to get educated and become part of the community. "
    },
    {
      question: "How does voting work?",
      answer: "Looking to learn more about Doait? No worries, get access to the best resource available on order to get educated and become part of the community. "
    },
    {
      question: "Do I need technical knowledge?",
      answer: "Looking to learn more about Doait? No worries, get access to the best resource available on order to get educated and become part of the community. "
    },
    {
      question: "Can students participate?",
      answer: "Looking to learn more about Doait? No worries, get access to the best resource available on order to get educated and become part of the community. "
    },
    {
      question: "How does DAOIt promote financial inclusion?",
      answer: "Looking to learn more about Doait? No worries, get access to the best resource available on order to get educated and become part of the community. "
    },
    {
      question: "What sustainability features does DAOIt have?",
      answer: "Looking to learn more about Doait? No worries, get access to the best resource available on order to get educated and become part of the community. "
    },
    {
      question: "How can I get started?",
      answer: "Looking to learn more about Doait? No worries, get access to the best resource available on order to get educated and become part of the community."
    }
  ];

  const toggleFAQ = (index: number | null) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full flex justify-center bg-[url('/LandingPage/FaqBg.svg')] bg-fixed bg-cover bg-top">
      <div className="px-4 md:px-10 max-w-screen-2xl w-full max-h-none lg:max-h-[500px] flex flex-col lg:flex-row gap-8 lg:gap-x-20 justify-between bg-transparent py-16">
        <div className="flex flex-col items-start w-full lg:w-2/6">
          <p className="text-xl md:text-2xl lg:text-[30px] text-[#002887] font-medium">Got Questions?</p>
          <h2 className="text-2xl md:text-3xl lg:text-[36px] font-semibold mb-6">We got answers</h2>
        </div>
        <div className="flex flex-col gap-y-4 w-full px-0 lg:px-5 transition-all overflow-y-auto lg:overflow-y-scroll duration-500 max-h-[400px] lg:max-h-none">
          {faqs.map((faq, index) => (
            <div
              key={index}
              onClick={() => toggleFAQ(index)}
              className={`rounded-2xl overflow-visible transition-all duration-300 cursor-pointer ${
                activeIndex === index ? "bg-blue-800 text-white" : "bg-gray-100 text-black"
              }`}
            >
              <div className="flex justify-between items-center px-6 h-20">
                <p className="text-xl font-medium">{faq.question}</p>
                <span>{activeIndex === index ? "-" : "+"}</span>
              </div>

              <div
                className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
                  activeIndex === index
                    ? "max-h-[200px] opacity-100 py-5"
                    : "max-h-0 opacity-0 py-0"
                }`}
              >
                <p className="text-base">{faq.answer}</p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default FAQs;
