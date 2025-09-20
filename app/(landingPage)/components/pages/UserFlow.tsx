import React from 'react'
import { UserFlowContent } from "@/app/(landingPage)/lib/user-flow"


const UserFlow = () => {
  return (
    <section className='flex justify-center w-full'>
        <main className='flex flex-col items-center max-w-screen-2xl w-full px-4 md:px-10 pt-10 md:pt-20 gap-y-6 md:gap-y-4'>
            <div className='flex flex-col items-center gap-y-4 text-center w-full md:w-3/5 lg:w-2/5'>
                <h2 className='text-2xl md:text-3xl lg:text-4xl font-semibold'>How <span className='text-[#003CB1]'>DAOit</span> works?</h2>
                <p className='text-sm md:text-base text-gray-600'>Discover how DAOit empowers you to learn, govern, and grow in a decentralized education ecosystem</p>
            </div>


            {/* Mobile: Simple vertical layout, Desktop: Complex flow layout */}
            <div className="w-full relative pt-10 md:pt-20">
              {/* Mobile Layout */}
              <div className="flex flex-col gap-y-8 md:hidden">
                {UserFlowContent.map((item, index) => (
                  <div key={index} className="w-full">
                    <div className="bg-white rounded-[18px] shadow-lg p-4 flex flex-col gap-y-4">
                      <p className="text-[#003CB1] text-lg font-medium">Step 0{index === 2 ? index + 2 : index === 3 ? index : index + 1}</p>
                      <div className="flex items-start gap-x-3">
                        <img src={item.icon} alt={`${item.heading} icon`} className="w-8 h-8 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-[#241B00] mb-2">{item.heading}</h3>
                          <ul className="list-disc pl-4 text-sm text-gray-700 flex flex-col gap-y-1">
                            {item.listItems?.map((text, i) => (
                              <li key={i}>{text}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* Step connector for mobile */}
                    {index < UserFlowContent.length - 1 && (
                      <div className="flex justify-center py-4">
                        <div className="w-0.5 h-8 bg-[#1D54E1] opacity-50"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex flex-col gap-y-32 relative">
                {UserFlowContent.map((item, index) => (
                  <div
                    key={index}
                    className={`flex w-full ${index !== UserFlowContent.length-1 ? "justify-between" : "justify-center lg:ml-48"} items-center relative ${index != 0 && index != 5 && index != UserFlowContent.length-1 && "lg:-mt-40"} z-[${index + 1}] ${
                      index % 2 !== 0 && index <= 4 ? "flex-row-reverse" : index > 4 && index % 2 === 0 ? "flex-row-reverse" :  "flex-row"
                    }`}
                  >
                    {/* Card */}
                    <div className="w-[90%] md:w-[70%] lg:w-[40%] bg-white rounded-[18px] shadow-[0_0_350px_80px_rgba(0,0,0,0.1)] p-4 md:p-6 flex flex-col justify-center items-start gap-y-4 relative">
                      <p className="text-[#003CB1] text-lg md:text-xl lg:text-2xl font-medium">Step 0{index === 2 ? index + 2 : index === 3 ? index : index + 1}</p>
                      <div className="flex items-center gap-x-3 md:gap-x-4 w-full lg:w-4/5">
                        <img src={item.icon} alt={`${item.heading} icon`} className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" />
                        <h2 className="text-lg md:text-xl lg:text-[30px] font-semibold text-[#241B00] leading-tight">{item.heading}</h2>
                      </div>
                      <ul className="list-disc pl-5 text-sm md:text-base lg:text-lg text-gray-700 flex flex-col gap-y-2">
                        {item.listItems?.map((text, i) => (
                          <li key={i}>{text}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Connector path area (optional) */}
                    <div className="hidden lg:block w-[30%] h-full relative">
                      {/* You can inject SVGs or divs to simulate the blue dashed paths */}
                    </div>
                  </div>
                ))}
              </div>

              {/* SVG Paths - Only show on large screens */}
              <svg width="578" height="326" viewBox="0 0 578 326" fill="none" xmlns="http://www.w3.org/2000/svg" className='hidden xl:block absolute top-[9%] transform rotate-6 left-[26%] z-[-1]'>
                <path d="M1 121.764C6 133.764 71.5 382.264 301 311.764C530.5 241.264 215.5 155.264 342.5 48.2642C444.1 -37.3358 541.167 12.5975 577 48.2642" stroke="#1D54E1" strokeWidth="2" strokeDasharray="17 17"/>
              </svg>

              <svg width="289" height="583" viewBox="0 0 289 583" fill="none" xmlns="http://www.w3.org/2000/svg" className='hidden xl:block absolute top-[15%] transform -rotate-12 right-[4%] z-[-1]'>
                <path d="M49.1994 1.50444C61.8462 4.51413 317.636 29.291 284.876 267.13C252.115 504.968 116.684 207.85 31.449 350.373C-36.739 464.392 28.1227 552.189 69.077 581.835" stroke="#1D54E1" strokeWidth="2" strokeDasharray="17 17"/>
              </svg>

              <svg width="604" height="367" viewBox="0 0 604 367" fill="none" xmlns="http://www.w3.org/2000/svg" className='hidden xl:block absolute top-[27%] transform right-[22%] z-[-1]'>
                <path d="M602.869 245.733C594.728 254.635 467.023 449.939 236.581 323.179C6.13807 196.419 364.572 212.908 252.726 84.1748C163.249 -18.8115 47.3957 -3.69976 0.653539 16.7294" stroke="#1D54E1" strokeWidth="2" strokeDasharray="17 17"/>
              </svg>

              <svg width="204" height="368" viewBox="0 0 204 368" fill="none" xmlns="http://www.w3.org/2000/svg" className='hidden xl:block absolute top-[32%] transform left-[5%] z-[-1]'>
                <path d="M0.677453 364.805C7.51697 364.906 135.061 389.753 190.771 234.408C246.482 79.0631 94.0559 245.211 96.6282 141.737C98.6861 58.9577 155.395 13.7945 183.492 1.56028" stroke="#1D54E1" strokeWidth="2" strokeDasharray="17 17"/>
              </svg>

              <svg width="184" height="278" viewBox="0 0 184 278" fill="none" xmlns="http://www.w3.org/2000/svg" className='hidden xl:block absolute top-[55%] transform left-[7%] z-[-1]'>
                <path d="M1.7561 0.0424805C-1.28947 60.3021 30.7104 200.049 183.075 276.962" stroke="#1D54E1" strokeWidth="2" strokeDasharray="17 17"/>
              </svg>

              <svg width="289" height="167" viewBox="0 0 289 167" fill="none" xmlns="http://www.w3.org/2000/svg" className='hidden xl:block absolute top-[68%] transform left-[39%] z-[-1]'>
                <path d="M1.5 0.5C25.9363 55.6667 117.478 166 288.154 166" stroke="#1D54E1" strokeWidth="2" strokeDasharray="17 17"/>
              </svg>

              <svg width="455" height="389" viewBox="0 0 455 389" fill="none" xmlns="http://www.w3.org/2000/svg"  className='hidden xl:block absolute top-[79%] transform -rotate-[20deg] right-[3%] z-[-1]'>
                <path d="M1.16945 347.049C9.72964 351.379 155.261 461.061 320.934 299.442C486.607 137.822 192.367 253.644 259.18 124.772C312.63 21.6755 411.87 -0.422962 454.809 1.41492" stroke="#1D54E1" strokeWidth="2" strokeDasharray="17 17"/>
              </svg>
            </div>

        </main>
    </section>
  )
}

export default UserFlow