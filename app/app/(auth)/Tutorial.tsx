"use client"

import React, { useState } from 'react'
import FullHeader from '../components/layout/FullHeader'
import Link from 'next/link'
import QuizModal, { Question } from '../components/modals/QuizModal'
import AuthLanding from './AuthLanding'

const TutorialPage = () => {
  const [startQuiz, setStartQuiz] = useState<boolean>(false);
  const [passedQuiz, setPassedQuiz] = useState<boolean>(false);

  const TutorialQuestions:Question[] = [
    {
      question: "What must you do before you can sign up on the platform?",
      answers: ["Invite three friends", "Complete a course", "Watch a video and pass a quiz", "Connect your crypto wallet"],
      correctAnswer: "Watch a video and pass a quiz"
    }, 
    {
      question: "Why must you do before you can sign up on the platform?",
      answers: ["Invite three friends", "Complete a course", "Watch a video and pass a quiz", "Connect your crypto wallet"],
      correctAnswer: "Watch a video and pass a quiz"
    },
    {
      question: "What should you do before you can sign up on the platform?",
      answers: ["Invite three friends", "Complete a course", "Watch a video and pass a quiz", "Connect your crypto wallet"],
      correctAnswer: "Watch a video and pass a quiz"
    }
  ]

  setPassedQuiz(true)
  
  return (
    <div className='w-full relative'>
      {passedQuiz ? 
        (<AuthLanding />) :
        <div className='w-full relative'>
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

          <QuizModal isOpen={startQuiz} onClose={() => {setStartQuiz(false)}} questions={TutorialQuestions} />
        </div>
      }
    </div>

    
  )
}

export default TutorialPage