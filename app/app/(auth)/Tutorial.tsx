"use client"

import React, { useState } from 'react'
import FullHeader from '../components/layout/FullHeader'
import Link from 'next/link'
import QuizModal, { Question } from '../components/modals/QuizModal'
import AuthLanding from './AuthLanding'

const TutorialPage = () => {
  const [startQuiz, setStartQuiz] = useState<boolean>(false);
  const [passedQuiz, setPassedQuiz] = useState<boolean>(false);

  const handleQuizCompletion = (didPass: boolean) => {
    setPassedQuiz(didPass);
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

  // useEffect(() => {
  //   setPassedQuiz(true)
  // }, [])
  
  return (
    <div className='w-full relative'>
      {passedQuiz ? 
        (<AuthLanding />) :
        <div className='w-full relative pt-14'>
          <FullHeader />

          <main className='flex flex-col items-center w-full gap-y-20 px-7 py-14 min-h-screen'>
            <div className='flex items-center w-full justify-between gap-x-[50px]'>
              <div className='w-[40%] flex flex-col gap-y-5'>
                <h1 className='text-[48px] font-semibold text-[#2E3035]'><span className='text-[#1D54E1]'>Discover</span> How Learning Meets the Blockchain</h1>

                <Link href="#">
                  <button type='button' className='w-[185px] text-white h-[45px] flex justify-center items-center rounded-[10px] bg-[#1D54E1]'>Contact us</button>
                </Link>
              </div>

              <p className='text-lg font-normal text-[#2E3035] w-[40%]'>
                Before you join, take a quick tour of how our platform works. Watch a short video to learn how you can learn, contribute, and earn in a decentralized education system. Once you&apos;re done, pass a short quiz to unlock your sign-up.
              </p>
            </div>

            <div className='flex flex-col gap-y-3 items-center justify-center w-full h-full'>
              <video className='w-[80%] h-[80%]' controls>
                <source src="../assets/tutorialVideo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              <div className='flex items-center gap-x-5 justify-center w-full h-full'>
                <button 
                  type='button' 
                  className='w-[400px] text-[#1D54E1] h-[50px] flex justify-center items-center rounded-[10px] bg-[#1D54E11A]'
                  onClick={() => setStartQuiz(true)}
                  >Start Quiz</button>

                
                {/* <button type='button' className='w-[400px] text-white h-[50px] flex justify-center items-center rounded-[10px] bg-[#1D54E1]'>Start Quiz</button> */}
              </div>
            </div>
          </main>

          <QuizModal isOpen={startQuiz} onClose={() => {setStartQuiz(false)}} questions={TutorialQuestions} onQuizComplete={() => handleQuizCompletion} />
        </div>
      }
    </div>

    
  )
}

export default TutorialPage