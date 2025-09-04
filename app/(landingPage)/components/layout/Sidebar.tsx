"use client"

import { useState } from "react";

interface AccordionProp {
  isOpen: boolean;
}

const AccordionIcon: React.FC<AccordionProp> = ({ isOpen }) => (
  <svg
    className={`w-5 h-5 transform transition-transform duration-200 ${
      isOpen ? "rotate-180" : ""
    }`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const Sidebar = () => {
  const [expandedSections, setExpandedSections] = useState({
    introduction: false,
    smartContracts: false,
    resources: false,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev],
    }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={toggleMobileMenu}
      >
        {isMobileMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:static top-0 left-0 h-full z-40 bg-white overflow-y-auto border-r border-gray-200 transition-all duration-300 ${isMobileMenuOpen ? 'w-[70%] sm:w-[50%]' : 'w-0 md:w-64 overflow-hidden md:overflow-visible'} p-0 md:p-4`}>
        <ul className="space-y-4 p-4">
          <li>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("introduction")}
            >
              <h3 className="text-lg font-semibold text-gray-700">
                Introduction
              </h3>
              <AccordionIcon isOpen={expandedSections.introduction} />
            </div>
            {expandedSections.introduction && (
              <ul className="mt-2 space-y-2">
                <li className="text-gray-600 hover:text-gray-800">Overview</li>
                <li className="text-gray-600 hover:text-gray-800">
                  Mission and Values
                </li>
                <li className="text-gray-600 hover:text-gray-800">
                  DAOit Whitepaper
                </li>
              </ul>
            )}
          </li>

          <li>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("smartContracts")}
            >
              <h3 className="text-lg font-semibold text-gray-700">
                Smart Contract Modules
              </h3>
              <AccordionIcon isOpen={expandedSections.smartContracts} />
            </div>
            {expandedSections.smartContracts && (
              <ul className="mt-2 space-y-2">
                <li className="text-gray-600 hover:text-gray-800">
                  Smart Contract Integration
                </li>
                <li className="text-gray-600 hover:text-gray-800">
                  Voting Mechanism
                </li>
                <li className="text-gray-600 hover:text-gray-800">
                  Financial Literacy
                </li>
                <li className="text-gray-600 hover:text-gray-800">
                  Collaborative Tools
                </li>
                <li className="text-gray-600 hover:text-gray-800">
                  Liquidity Pools
                </li>
                <li className="text-gray-600 hover:text-gray-800">Governance</li>
                <li className="text-gray-600 hover:text-gray-800">
                  Environmental Tools
                </li>
              </ul>
            )}
          </li>

          <li>
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection("resources")}
            >
              <h3 className="text-lg font-semibold text-gray-700">Resources</h3>
              <AccordionIcon isOpen={expandedSections.resources} />
            </div>
            {expandedSections.resources && (
              <ul className="mt-2 space-y-2">
                <li className="text-gray-600 hover:text-gray-800">
                  Help and Support
                </li>
                <li className="text-gray-600 hover:text-gray-800">
                  Social Channels
                </li>
                <li className="text-gray-600 hover:text-gray-800">
                  Terms and Policy
                </li>
                <li className="text-gray-600 hover:text-gray-800">Security</li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
