"use client"


import React, { useState } from "react";

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
      <div className="px-10 max-w-screen-2xl w-full flex flex-col items-center bg-transparent pt-16">
        <h2 className="text-[40px] font-bold mb-6">Frequently Asked Question</h2>
        <div className="space-y-4 w-full">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="pt-4 cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <p className="text-[22px] font-medium w-[850px]">{faq.question}</p>
                <span className="text-xl">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </div>
              {activeIndex === index && (
                <p className="mt-2 text-[#777777] border-l-[7px] py-3 px-7 border-[#F8B51C] text-lg w-[850px]">
                  {faq.answer}.
                </p>
              )}
            </div>
          ))}
        </div>


        <div className="mt-6 flex items-center w-full justify-center text-[26px] font-bold pt-20 pb-5">
          <h4>&qout;NOTE: The DOAit platform adheres to all data privacy laws of it&apos;s users&qout;</h4>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
