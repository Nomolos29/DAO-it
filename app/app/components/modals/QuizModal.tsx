import React, { useState } from 'react'
import Modal, { ModalProps } from './Modal'
import { HiOutlineArrowNarrowLeft, HiOutlineArrowNarrowRight } from 'react-icons/hi';
import { PiMaskSadFill } from "react-icons/pi";
import { GiPartyPopper } from 'react-icons/gi';
import Image from 'next/image';
import logo from "@/public/appImages/lightLogo.png"

export type Question = {
    question: string;
    answers: string[];
    correctAnswer: string;
}

interface QuizModalProps extends ModalProps {
    questions: Question[];
    onQuizComplete: (didPass: boolean) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, questions, onQuizComplete }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [correctAnswers, setCorrectAnswers] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<number>(1);
    const [answeredQuestions, setAnsweredQuestions] = useState<{[key: number]: string}>({});
    const [activeModal, setActiveModal] = useState<"default" | "questions" | "passed" | "failed">("questions");

    const buttonStyle = "h-[50px] w-[203px] flex items-center justify-center rounded-[10px]";

    const handleNextQuestion = () => {
        // Check if the selected answer is correct for the current question
        const currentQ = questions[currentQuestion - 1];
        if (selectedAnswer === currentQ.correctAnswer) {
            setCorrectAnswers(prev => prev + 1);
        }
        
        // Store the answer for this question
        setAnsweredQuestions(prev => ({
            ...prev,
            [currentQuestion]: selectedAnswer
        }));
        
        // Reset selection and move to next question
        setSelectedAnswer("");
        setCurrentQuestion(prev => prev + 1);
    };

    const handlePreviousQuestion = () => {
        // When going back, restore the previously selected answer if it exists
        setSelectedAnswer(answeredQuestions[currentQuestion - 1] || "");
        setCurrentQuestion(prev => prev - 1);
    };

    const handleFinish = () => {
        // Check the last question's answer
        const currentQ = questions[currentQuestion - 1];
        if (selectedAnswer === currentQ.correctAnswer) {
            setCorrectAnswers(prev => prev + 1);
        }
        
        // Close the modal or show results
        setSelectedAnswer("");
        setCurrentQuestion(1);
        setCorrectAnswers(0);
        setAnsweredQuestions({});

        // Check if the user passed or failed
        
        setActiveModal((correctAnswers/questions.length*100) >= 80 ? 'passed' : 'failed');
    };

    const handleCloseAllModals = () => {
        setActiveModal('questions');
        onClose();
    };

    const handleSendResult = () => {
        onQuizComplete(true)
    }

    return (
        <>
        <Modal isOpen={isOpen && activeModal === "questions"} bgBlured onClose={onClose}>
            <main className='w-[90%] md:w-[85%] xl:w-[900px] flex flex-col justify-between p-[30px] gap-y-10 rounded-[20px] relative'>
                <div className='flex items-center gap-x-1'>
                    {questions.map((_, index) => (
                        <div key={index} className={`h-[3px] w-[100px] ${currentQuestion >= index + 1 ? "bg-[#4C69F8]" : "bg-[#E0E2EA]"}`}></div>
                    ))}
                </div>

                <div className='absolute top-0 right-3 z-0 w-[50%] h-full flex items-center justify-center'>
                    <Image src={logo} alt='logo' width={1000} height={1000} />
                </div>

                <div className='relative w-[80%] h-[230px] z-[2]'>
                    <p>Question {currentQuestion} of {questions.length}</p>

                    {questions.map((question, index) => (
                        <div key={index} className={`flex flex-col gap-y-7 absolute top-10 justify-between left-0 w-full h-full ${currentQuestion === index + 1 ? 'block' : 'hidden'}`}>
                            <h1 className='text-[24px]'>{question.question}</h1>

                            <div className='flex flex-col gap-y-3 items-start'>
                                {question.answers.map((answer, i) => (
                                    <label htmlFor={`${index}-${i}`} key={i} className='flex gap-x-3 items-center text-lg font-normal text-[#2E3035]'>
                                        <input 
                                            id={`${index}-${i}`} 
                                            type='radio' 
                                            name={`answer-${index}`} 
                                            value={answer} 
                                            className='h-5 w-5 cursor-pointer' 
                                            onChange={() => setSelectedAnswer(answer)}
                                            checked={selectedAnswer === answer || answeredQuestions[currentQuestion] === answer}
                                        />
                                        {answer}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className='w-full flex justify-between items-center mt-14 z-[2]'>
                    {currentQuestion > 1 ? 
                        <button 
                            type='button' 
                            className={`${buttonStyle} bg-[#1D54E11A] text-[#1D54E1] gap-x-2`} 
                            onClick={handlePreviousQuestion}
                        >
                            <HiOutlineArrowNarrowLeft className='text-xl' />
                            Previous
                        </button> 
                        : <div></div> /* Empty div to maintain space */}
                    
                    {currentQuestion < questions.length ? 
                        <button 
                            type='button' 
                            className={`${buttonStyle} bg-[#1D54E11A] text-[#1D54E1] gap-x-2 ${selectedAnswer ? "cursor-pointer" : "cursor-not-allowed"}`} 
                            onClick={handleNextQuestion}
                            disabled={!selectedAnswer}
                        >
                            Next
                            <HiOutlineArrowNarrowRight className='text-xl' />
                        </button> 
                        : 
                        <button 
                            type='button' 
                            className={`${buttonStyle} text-white bg-[#1D54E1] ${selectedAnswer ? "cursor-pointer" : "cursor-not-allowed"}`}
                            onClick={handleFinish}
                            disabled={!selectedAnswer}
                        >
                            Finish
                        </button>
                    }
                </div>
            </main>
        </Modal>

        <Modal isOpen={activeModal === "passed"} bgBlured onClose={() => setActiveModal("default")}>
            <main className="w-[450px] flex flex-col items-center text-center gap-y-4 px-[30px]">
                <GiPartyPopper className='text-[100px] text-[#1D54E1]' />
    
                <h3 className='text-xl font-semibold text-[#2E3035]'>Congrats! You&apos;re In!</h3>
    
                <p className='text-[#5B5E65]'>Now you can create your account and start exploring a world where knowledge meets ownership</p>
    
                <button 
                type='button'
                className="bg-[#1D54E1] text-white w-full px-4 py-[15px] rounded-[10px]"
                onClick={handleSendResult}
                >
                    Create my account
                </button>
            </main>
        </Modal>

        <Modal isOpen={activeModal === "failed"} bgBlured onClose={() => setActiveModal("questions")}>
            <main className='w-[450px] flex flex-col items-center text-center gap-y-4 px-[30px]'>
                <PiMaskSadFill className='text-[100px] text-red-400' />
                <h3 className='text-xl font-semibold text-[#2E3035]'>Sorry, you didn&apos;t pass the quiz</h3>
    
                <p className='text-[#5B5E65]'>You need to get at least 80% of the answers correct to pass the quiz. Please try again.</p>
    
                <button 
                type='button'
                className="bg-[#1D54E1] text-white w-full px-4 py-[15px] rounded-[10px]"
                onClick={handleCloseAllModals}
                >
                    Back to video
                </button>
            </main>
        </Modal>
        </>
    )
}

export default QuizModal