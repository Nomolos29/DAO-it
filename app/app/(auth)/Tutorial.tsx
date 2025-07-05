"use client"

import React, { useState } from 'react'
import FullHeader from '../components/layout/FullHeader'
import Link from 'next/link'
import QuizModal, { Question } from '../components/modals/QuizModal'

interface TutorialPageProps {
  loggedIn?: (action: "register" | "loggedIn") => void;
}

const TutorialPage = ({ loggedIn }: TutorialPageProps) => {
  const [startQuiz, setStartQuiz] = useState<boolean>(false);


  const handleQuizCompletion = () => {
    setStartQuiz(false);
  };

  const TutorialQuestions:Question[] = [
    {
      question: "What do users receive in return for their contributions?",
      answers: ["Free data", "DAOit tokens", "Online certificates", "Airtime  "],
      correctAnswer: "DAOit tokens"
    },
    {
      question: "What do DAOit tokens allow users to do?",
      answers: ["Buy goods in stores", "Withdraw cash", "Vote on decisions", "Send emails"],
      correctAnswer: "Vote on decisions"
    },
    {
      question: "What makes the voting system fair and transparent in DAOit?",
      answers: ["Manual counting", "Blockchain technology", "Student elections", "Government approval"],
      correctAnswer: "Blockchain technology"
    },
    {
      question: "Which of these is a result of collective action via DAOit?",
      answers: ["Faster syllabus completion", "Better snacks in school", "Policies that reflect real classroom needs", "Higher rent for schools"],
      correctAnswer: "Policies that reflect real classroom needs"
    },
    {
      question: "What does DAOit help eliminate in decision-making?",
      answers: ["Waiting time for meetings", "Complete a course", "Too much paperwork", "Delays and lack of representation"],
      correctAnswer: "Delays and lack of representation"
    }
  ]

  return (
    <div className='w-full relative'>
        <div className='w-full relative pt-20 md:pt-14'>
          <FullHeader />

          <main className='flex flex-col items-center w-full gap-y-10 md:gap-y-20 px-7 py-14 min-h-screen'>
            <div className='flex items-center w-full justify-between gap-x-[50px]'>
              <div className='w-full md:w-[50%] lg:w-[40%] flex items-center md:items-start flex-col gap-y-5 text-center md:text-left'>
                <h1 className='text-[28px] leading-tight md:text-[48px] font-semibold text-[#2E3035]'><span className='text-[#1D54E1]'>Discover</span> How Learning Meets the Blockchain</h1>

                <p className='text-lg flex md:hidden font-normal text-[#2E3035] w-full'>
                  Before you join, take a quick tour of how our platform works. Watch a short video to learn how you can learn, contribute, and earn in a decentralized education system. Once you&apos;re done, pass a short quiz to unlock your sign-up.
                </p>

                <Link href="#">
                  <button type='button' className='w-[185px] text-white h-[45px] flex justify-center items-center rounded-[10px] bg-[#1D54E1]'>Contact us</button>
                </Link>
              </div>

              <p className='text-lg hidden md:flex font-normal text-[#2E3035] w-[40%]'>
                Before you join, take a quick tour of how our platform works. Watch a short video to learn how you can learn, contribute, and earn in a decentralized education system. Once you&apos;re done, pass a short quiz to unlock your sign-up.
              </p>
            </div>

            <div className='flex flex-col gap-y-3 items-center justify-center w-full h-full'>
              <div className='relative w-full lg:w-[80%] h-[400px]'>
                <iframe
                  src={`https://www.youtube.com/embed/jsKfpMRPd6c?autoplay=1&rel=0`}
                  loading="lazy"
                  className='w-full h-full'
                  title='Onboarding Video'
                  allowFullScreen
                  frameBorder="0"
                />
              </div>

              <div className='flex items-center gap-x-5 justify-center w-full h-full mt-5'>
                <button
                  type='button'
                  className='w-[400px] text-[#1D54E1] h-[50px] flex justify-center items-center rounded-[10px] bg-[#1D54E11A]'
                  onClick={() => setStartQuiz(true)}
                  >Start Quiz</button>

                {/* <button type='button' className='w-[400px] text-white h-[50px] flex justify-center items-center rounded-[10px] bg-[#1D54E1]'>Start Quiz</button> */}
              </div>
            </div>
          </main>

          <QuizModal
            isOpen={startQuiz}
            onClose={() => {setStartQuiz(false)}}
            questions={TutorialQuestions}
            onQuizComplete={handleQuizCompletion}
            onLoginSuccess={(action) => loggedIn?.(action)}
          />
        </div>
    </div>


  )
}

export default TutorialPage