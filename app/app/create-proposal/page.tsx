"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { IoInformationCircle } from "react-icons/io5";
import { TiTickOutline } from "react-icons/ti";
import Link from "next/link";
import { useActiveAccount } from "thirdweb/react";
import { analyzeSentiment } from '../services/sentimentAnalysis';
import { saveSentimentAnalysis } from '../services/sentimentStorage';
import { SentimentAnalysis } from '../types/sentiment';
import { Modal } from "../components";
import { useCreateProposal } from "../hooks/useCreateProposal";
import { FaArrowLeftLong } from "react-icons/fa6";
import openai from "../lib/openai";
import { v4 as uuidv4 } from 'uuid';

export interface ApiProposal {
  proposalId: string;
  proposalTitle: string;
  proposalSummary: string;
  proposalDetails: string;
  proposalStatus: string;
  privateStatus: string;
  proposalType: string;
  abdoptionOption: string;
  fundRaiserOption: string;
  imageFilePath: string[];
  createdAt: string;
  endDate: string;
  reactions: string[]; // Specify proper type if reactions have structure
  userId: string;
}

// Types definitions
export interface ProposalState {
  id: string;
  title: string;
  visibility: string;
  targetLocation: string;
  proposalContent: string;
  proposalType: string;
  summary: string;
  startDate: string;
  endDate: string;
  walletAddress: string;
  destinationAddress?: string;
}

interface SectionData {
  id: string;
  label: string;
  required: boolean;
}

interface ReflectionQuestion {
  id: string;
  label: string;
  placeholder: string;
}

interface SectionsState {
  [key: string]: string;
}

interface ReflectionsState {
  [key: string]: string;
}

interface SubmitStatusState {
  loading: boolean;
  error: string | null;
}

// Content sections definition
const PROPOSAL_SECTIONS: SectionData[] = [
  { id: "background", label: "Background", required: true },
  { id: "objective", label: "Objective", required: true },
  { id: "specifications", label: "Specifications", required: true },
  { id: "timeline", label: "Timeline", required: true },
  { id: "impact", label: "Impact", required: true },
];

// Reflection questions definition
const REFLECTION_QUESTIONS: ReflectionQuestion[] = [
  {
    id: "personal",
    label: "Why is this proposal important to you?",
    placeholder: "Share your personal motivation for this proposal..."
  },
  {
    id: "alignment",
    label: "How does this proposal align with the DAO's goals?",
    placeholder: "Explain how this proposal supports the DAO's mission..."
  },
  {
    id: "experience",
    label: "What relevant experience do you bring to this proposal?",
    placeholder: "Describe any experience or expertise you have related to this topic..."
  },
];

// Generates a unique proposal ID
// const generateProposalId = (address: string): string => {
//   const timestamp = Date.now().toString(36);
//   const randomStr = Math.random().toString(36).substring(2, 5);
//   return `prop_${address ? address.slice(-4) : "anon"}_${timestamp}_${randomStr}`;
// };

const CreateProposal = () => {
  const account = useActiveAccount();
  const { createProposal, isLoading: proposalLoading } = useCreateProposal();

  // Basic form state
  const [proposal, setProposal] = useState<ProposalState>({
    id: "",
    title: "",
    visibility: "Public",
    targetLocation: "None",
    proposalType: "Abdoption",
    proposalContent: "",
    summary: "",
    startDate: "",
    endDate: "",
    walletAddress: "",
    destinationAddress: "",
  });

  // Section content state - centralized
  const [sections, setSections] = useState<SectionsState>({});
  const [reflections, setReflections] = useState<ReflectionsState>({});
  const [activeSectionId, setActiveSectionId] = useState<string>("background");

  // AI integration state
  const [aiContributions, setAiContributions] = useState<SectionsState>({});
  const [userModifiedSections, setUserModifiedSections] = useState<Set<string>>(new Set());
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [originalityScore, setOriginalityScore] = useState<number>(100);

  // UI state
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatusState>({ loading: false, error: null });

  // Sentiment analysis state
  const [sentimentAnalysis, setSentimentAnalysis] = useState<SentimentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);



  // Set wallet address and generate proposal ID when account loads
  useEffect(() => {
    if (account) {
      setProposal(prev => ({
        ...prev,
        walletAddress: account.address,
        id: uuidv4().toUpperCase(), // Generate a new UUID for the proposal ID
      }));
    }
  }, [account]);

  // Calculate the proposal's originality score
  const calculateOriginalityScore = useCallback((): number => {
    const aiSectionCount = Object.keys(aiContributions).length;
    if (aiSectionCount === 0) return 100;

    const userModifiedCount = userModifiedSections.size;
    const score = Math.round((userModifiedCount / aiSectionCount) * 100);

    // Ensure score is at least 10, even if nothing is modified
    const finalScore = Math.max(score, 10);
    setOriginalityScore(finalScore);

    return finalScore;
  }, [aiContributions, userModifiedSections]);

  // Calculate originality score whenever sections or AI contributions change
  useEffect(() => {
    calculateOriginalityScore();
  }, [sections, aiContributions, userModifiedSections, calculateOriginalityScore]);

  // Update the completed sections set
  const updateCompletedSections = useCallback((): void => {
    const newCompletedSections = new Set<string>();

    // Check each section - if it has meaningful content, mark it as completed
    Object.entries(sections).forEach(([sectionId, content]) => {
      // Check if content has substantial text (not just whitespace)
      if (content && content.trim().length > 20) {  // Minimum 20 chars for "substantial"
        newCompletedSections.add(sectionId);
      }
    });

    setCompletedSections(newCompletedSections);
  }, [sections]);

  // Check for completed sections whenever sections change
  useEffect(() => {
    updateCompletedSections();
  }, [updateCompletedSections]);

  // Handle basic form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setProposal(prev => ({ ...prev, [name]: value }));
  };

  // Handle select input changes
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setProposal(prev => ({ ...prev, [name]: value }));
  };

  // Handle section content changes
  const handleSectionChange = (sectionId: string, content: string): void => {
    // Update section content
    setSections(prev => ({ ...prev, [sectionId]: content }));

    // Check if this is a significant modification from AI content
    const aiContent = aiContributions[sectionId];
    if (aiContent && content !== aiContent) {
      const diffPercentage = calculateDiffPercentage(aiContent, content);
      if (diffPercentage > 30) {
        setUserModifiedSections(prev => {
          const newSet = new Set(prev);
          newSet.add(sectionId);
          return newSet;
        });
      }
    }
  };

  // Handle reflection changes
  const handleReflectionChange = (questionId: string, content: string): void => {
    setReflections(prev => ({ ...prev, [questionId]: content }));
  };

  // Generate AI content for a section
  const generateSectionContent = async (sectionId: string): Promise<string | null> => {
    if (!proposal.title) {
      toast.error("Please enter a proposal title first");
      return null;
    }

    setIsGeneratingAI(true);

    try {
      // Different prompts based on the section
      const sectionPrompts: Record<string, string> = {
        background: `Create a brief Background section (2-3 paragraphs) for a proposal titled "${proposal.title}" that provides context about the problem or opportunity.`,
        objective: `Create a concise Objective section (1-2 paragraphs) for a proposal titled "${proposal.title}" with clear, measurable goals.`,
        specifications: `Create a detailed Specifications section for a proposal titled "${proposal.title}" as a numbered list with 3-5 key implementation details.`,
        timeline: `Create a practical Timeline section for a proposal titled "${proposal.title}" with 3-4 major milestones and rough timeframes.`,
        impact: `Create an Impact section (2-3 paragraphs) for a proposal titled "${proposal.title}" describing expected benefits and outcomes. Include relevant statistics and examples of impact.`,
      };

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a proposal writing assistant that helps create structured, professional DAO proposals. Provide only the requested section with concise, useful content. Format as plain text."
          },
          { role: "user", content: sectionPrompts[sectionId] }
        ],
        max_tokens: 250,
        temperature: 0.7,
      });

      const content = completion.choices[0].message.content;

      if (content) {
        // Store AI contribution and update section content
        setAiContributions(prev => ({ ...prev, [sectionId]: content }));
        setSections(prev => ({ ...prev, [sectionId]: content }));
        return content;
      }

      throw new Error("Failed to generate content");
    } catch (error: unknown) {
      toast.error(`OpenAI API error:, ${error}`);
      const errorMessage = error instanceof Error ? error.message : "Failed to generate section content";
      toast.error(errorMessage);
      return null;
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Calculate difference percentage between two text strings
  const calculateDiffPercentage = (original: string, modified: string): number => {
    if (!original) return 100;

    const originalWords = original.toLowerCase().split(/\s+/);
    const modifiedWords = modified.toLowerCase().split(/\s+/);

    const commonWords = originalWords.filter((word: string) =>
      word.length > 3 && modifiedWords.includes(word)
    ).length;

    const maxWords = Math.max(originalWords.length, modifiedWords.length);
    const differentWords = maxWords - commonWords;

    return Math.round((differentWords / maxWords) * 100);
  };

  // Compile the full proposal description from sections and reflections
  const compileFullProposal = (): string => {
    // Add all sections
    let fullProposal = "";

    PROPOSAL_SECTIONS.forEach(section => {
      const content = sections[section.id];
      if (content) {
        fullProposal += `# ${section.label}\n${content}\n\n`;
      }
    });

    // Add reflections
    fullProposal += "## Personal Reflections\n";
    REFLECTION_QUESTIONS.forEach(question => {
      const answer = reflections[question.id] || "";
      fullProposal += `**${question.label}** ${answer}\n\n`;
    });

    return fullProposal.trim();
  };

  // Validate the proposal before submission
  const validateProposal = (): boolean => {
    // Check basic fields
    if (!proposal.title || !proposal.summary || !proposal.summary) {
      toast.error("Please complete all required fields");
      return false;
    }

    // Check required sections
    const missingSections = PROPOSAL_SECTIONS
      .filter(section => section.required && !sections[section.id])
      .map(section => section.label);

    if (missingSections.length > 0) {
      toast.error(`Missing required sections: ${missingSections.join(", ")}`);
      return false;
    }

    // Check reflections
    const missingReflections = REFLECTION_QUESTIONS
      .filter(question => !reflections[question.id])
      .map(question => question.label);

    if (missingReflections.length > 0) {
      toast.error("Please complete all reflection questions");
      return false;
    }
    // Check originality score
    if (originalityScore < 40) {
      toast.error("Your proposal needs more originality. Please personalize AI-generated content");
      return false;
    }

    return true;
  };

  const now = new Date()
  // const currentDate = now.toISOString().slice(0, 12);
  const startDate = new Date(now.setDate(now.getDate() + 7)).toISOString().slice(0, 10);
  const endDate = new Date(now.setDate(now.getDate() + 21)).toISOString().slice(0, 10);

  // Submit the proposal to the blockchain
  const handleSubmit = async (): Promise<void> => {
    if (!validateProposal()) return;

    setSubmitStatus({ loading: true, error: null });
    setShowConfirmation(false);

    try {
      // Compile full proposal
      const fullProposal = compileFullProposal();

      await createProposal({
        id: proposal.id,
        title: proposal.title,
        summary: proposal.summary,
        visibility: proposal.visibility,
        targetLocation: proposal.targetLocation,
        proposalType: proposal.proposalType,
        proposalContent: fullProposal,
        startDate: proposal.startDate || startDate,
        endDate: proposal.endDate || endDate,
        destinationAddress: proposal.destinationAddress,
        walletAddress: proposal.walletAddress
      });

      setSubmitStatus({ loading: false, error: null });

      // Run sentiment analysis
      setIsAnalyzing(true);

      try {
        const analysis = await analyzeSentiment(
          proposal.id,
          proposal.title,
          proposal.summary,
          fullProposal
        );

        setSentimentAnalysis(analysis);
        saveSentimentAnalysis(analysis);
      } catch (error) {
        toast.error(`Sentiment analysis failed: ${error}`);
      } finally {
        setIsAnalyzing(false);
      }


      setShowSuccess(true);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setSubmitStatus({ loading: false, error: errorMessage });
      toast.error("Submission failed: " + errorMessage);
    }
  };


  // Styling classes
  const inputStyle = "px-4 border border-[#CECECE] rounded-[10px] outline-none bg-transparent flex items-center text-[#474747]";
  const labelStyle = "text-[#494445] text-[16px]";
  const container = "flex flex-col gap-y-2 bg-white p-[16px] rounded-[10px]";

  return (
    <main className="w-full flex gap-x-10 px-[30px] pb-20 pt-5">
      <div className="w-[75%] flex flex-col">
        <div className="flex flex-col gap-y-7 pb-10">
          {/* Header */}
        <Link
            href="/app"
            className="flex py-5 items-center w-[120px] h-[50px] justify-center bg-[#F7F3FF] transition-all duration-500 text-[#1D54E1] hover:bg-[#1D54E1] hover:text-white rounded-[10px] gap-2 font-medium text-md cursor-pointer"
          >
            <FaArrowLeftLong /> Home
          </Link>
          <div className="relative group h-[50px] flex items-center cursor-pointer px-[10px] w-full rounded-[10px] overflow-hidden">
            <IoInformationCircle className="text-3xl text-[#1D54E1]" />
            <div className="flex gap-x-2  shadow-md h-full px-[10px] transition-all duration-500 items-center w-full opacity-0 group-hover:opacity-100  hover:bg-white hover:text-[#474747] absolute top-0 left-0">
              <IoInformationCircle className="text-3xl text-[#1D54E1]" />
              <p className="text-md">
                Submit your idea for voting. A fee is required to ensure serious
                and thoughtful proposals.
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-[30px] text-[#2E3035] font-semibold mb-5">
          Create and publish a proposal
        </h2>

        {/* Originality Score */}
        <div className={`mb-6 ${container}`}>
          <div className={`flex justify-between items-center mb-1`}>
            <h3 className="text-[16px] text-[#474747]">Originality Score</h3>
            <span className={`font-medium ${
              originalityScore >= 70 ? "text-green-600" :
              originalityScore >= 40 ? "text-yellow-600" :
              "text-red-600"
            }`}>{originalityScore}%</span>
          </div>

          <div className="h-2 w-full bg-gray-200 rounded-full">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                originalityScore >= 70 ? "bg-green-500" :
                originalityScore >= 40 ? "bg-yellow-500" :
                "bg-red-500"
              }`}
              style={{ width: `${originalityScore}%` }}
            />
          </div>

          {originalityScore < 40 && (
            <p className="mt-1 text-sm text-red-600">
              Your proposal has too much AI-generated content. Please personalize AI-generated content.
            </p>
          )}

          {originalityScore >= 40 && originalityScore < 70 && (
            <p className="mt-1 text-sm text-yellow-600">
              Getting better! Continue personalizing your proposal to increase your score.
            </p>
          )}

          {originalityScore >= 70 && (
            <p className="mt-1 text-sm text-green-600">
              Great job! Your proposal shows strong originality.
            </p>
          )}
        </div>

        {/* Proposal Form */}
        <form className="flex flex-col gap-y-5">
          {/* Wallet Address */}
          <div className={container}>
            <label htmlFor="walletAddress" className={labelStyle}>
              Connected wallet address
            </label>
            <input
              type="text"
              id="walletAddress"
              name="walletAddress"
              value={proposal.walletAddress}
              className={`px-4 border border-[#1D54E11A] rounded-[10px] outline-none flex items-center text-[#1D54E1] h-[50px] bg-[#1D54E11A] cursor-not-allowed`}
              disabled
            />
          </div>

          {/* Proposal ID */}
          <div className={container}>
            <label htmlFor="id" className={labelStyle}>
              Proposal ID
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={proposal.id}
              className={`px-4 border border-[#1D54E11A] rounded-[10px] outline-none flex items-center text-[#1D54E1] h-[50px] bg-[#1D54E11A] cursor-not-allowed`}
              disabled
            />
          </div>

          {/* Proposal Title */}
          <div className={container}>
            <label htmlFor="title" className={labelStyle}>
              Proposal Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={proposal.title}
              onChange={handleInputChange}
              className={`${inputStyle} h-[50px]`}
              placeholder="Enter a clear, descriptive title..."
            />
          </div>

          <div className={`${container} w-full`}>
            <label htmlFor="proposalStatus" className={labelStyle}>
              Proposal status
            </label>
            <section className="flex gap-x-5 w-full">
              <select name="proposalStatus" id="proposalStatus" defaultValue="Select proposal status" title="Proposal status" className={`${inputStyle} w-full h-[50px] pr-2 bg-transparent`} onChange={handleSelectChange}>
                <option
                  value="Public"
                  className={`mr-3 h-[50px]`}
                >Public</option>

                <option
                  value="Private"
                  className={`mr-3 h-[50px]`}
                >Private</option>
              </select>
              <select name="proposalType" id="proposalType" defaultValue="Select proposal type" title="Proposal type" className={`${inputStyle} w-full h-[50px] pr-2 bg-transparent`} onChange={handleSelectChange}>
                <option
                  value="Abdoption"
                  className={`${inputStyle} h-[50px]`}
                >Abdoption</option>

                <option
                  value="Fund Raising"
                  className={`${inputStyle} h-[50px]`}
                >Fund Raising</option>
              </select>
            </section>
          </div>

          <section className={`transition-all duration-300 ${proposal.proposalType === "Fund Raising" ? "flex w-full" : "hidden"}`}>
            <div className={container + " w-full"}>
              <label htmlFor="title" className={labelStyle}>
                Destination wallet (will only appear if it&apos;s a fundraising proposal)
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={proposal.destinationAddress}
                onChange={handleInputChange}
                className={`${inputStyle} h-[50px]`}
                placeholder="Enter the destination wallet address..."
              />
            </div>
          </section>

          {/* Short Description/Summary */}
          <div className={container}>
            <label htmlFor="summary" className={labelStyle}>
              Short Description/Summary
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={3}
              maxLength={2000}
              minLength={850}
              value={proposal.summary}
              onChange={handleInputChange}
              className={inputStyle}
              placeholder="Write a brief summary of your proposal (1 or 2 sentences)..."
            />
            <p className="text-sm text-gray-500 mt-1">
              This should be written in your own words and will appear in proposal listings.
            </p>
          </div>

          {/* Section Builder */}
          <div className={`mb-6 rounded-lg p-4 ${container}`}>
            <h3 className="text-[18px] text-[#474747] mb-4">Proposal Builder</h3>

            {/* Section tabs */}
            <div className="flex mb-4 overflow-x-auto pb-2">
              {PROPOSAL_SECTIONS.map(section => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSectionId(section.id)}
                  className={`px-3 py-2 rounded-md mr-2 text-sm whitespace-nowrap
                    ${activeSectionId === section.id
                      ? "bg-white text-[#1D54E1] shadow-md"
                      : "bg-[#1D54E11A] text-gray-700"}
                    ${completedSections.has(section.id) ? "border-l-4 border-[#1D54E1]" : ""}
                  `}
                >
                  {section.label}
                  {completedSections.has(section.id) && " ✓"}
                </button>
              ))}
            </div>

            {/* Active section editor */}
            {activeSectionId && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-[#474747]">
                    {PROPOSAL_SECTIONS.find(s => s.id === activeSectionId)?.label}
                  </h4>

                  <button
                    type="button"
                    onClick={() => generateSectionContent(activeSectionId)}
                    disabled={isGeneratingAI}
                    className="text-sm flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-100"
                  >
                    {isGeneratingAI ? (
                      <span className="flex items-center">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Working...
                      </span>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 16L12 8M8 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Get Ideas
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  value={sections[activeSectionId] || ""}
                  onChange={(e) => handleSectionChange(activeSectionId, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md min-h-[200px]"
                  placeholder={`Write your ${PROPOSAL_SECTIONS.find(s => s.id === activeSectionId)?.label.toLowerCase()} content here...`}
                />

                {aiContributions[activeSectionId] && !userModifiedSections.has(activeSectionId) && (
                  <div className="mt-2 p-2 bg-yellow-50 text-yellow-700 text-sm rounded flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    <span>This section uses AI-generated content. Personalize it with your own ideas to increase your originality score.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preview of Complete Proposal */}
          <div className={container}>
            <div className="flex justify-between items-center">
              <label className={labelStyle}>
                Complete Proposal Preview
              </label>
              <span className="text-sm text-gray-500">
                {completedSections.size} of {PROPOSAL_SECTIONS.length} sections completed
              </span>
            </div>
            <div className="border border-gray-300 rounded-md p-4 max-h-[300px] overflow-y-auto bg-gray-50">
              {PROPOSAL_SECTIONS.map(section => {
                const content = sections[section.id];
                if (!content) return null;

                return (
                  <div key={section.id} className="mb-4">
                    <h5 className="font-medium text-[#474747] mb-2">{section.label}</h5>
                    <div className="whitespace-pre-line text-gray-700">{content}</div>
                  </div>
                );
              })}

              {Object.keys(reflections).length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <h5 className="font-medium text-[#474747] mb-2">Personal Reflections</h5>
                  {REFLECTION_QUESTIONS.map(question => {
                    const answer = reflections[question.id];
                    if (!answer) return null;

                    return (
                      <div key={question.id} className="mb-2">
                        <p className="text-sm font-medium text-gray-600">{question.label}</p>
                        <p className="text-gray-700">{answer}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Reflection Questions */}
          <div className="mb-6 border-t border-gray-200 pt-6">
            <div className="flex items-center mb-4">
              <h3 className="text-[18px] text-[#474747]">Personal Reflections</h3>
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">Required</span>
            </div>

            <p className="text-gray-600 text-sm mb-4">
              These questions require your personal input and cannot be generated with AI.
              Your answers help the DAO community understand your perspective.
            </p>

            <div className="space-y-4">
              {REFLECTION_QUESTIONS.map(question => (
                <div className={`${container} gap-y-2`} key={question.id}>
                  <label className="block text-[#494445] text-[14px] mb-2">
                    {question.label}
                  </label>
                  <textarea
                    value={reflections[question.id] || ""}
                    onChange={(e) => handleReflectionChange(question.id, e.target.value)}
                    className={inputStyle}
                    rows={3}
                    placeholder={question.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="flex justify-between w-full gap-x-5">
            <div className={`${container} w-1/2`}>
              <label htmlFor="startDate" className={labelStyle}>
                Start date
              </label>
              <input
                type="text"
                id="startDate"
                name="startDate"
                value={startDate} // Format date to YYYY-MM-DD
                disabled
                className={`px-4 border border-[#1D54E11A] rounded-[10px] outline-none flex items-center text-[#1D54E1] h-[50px] bg-[#1D54E11A] cursor-not-allowed`}
              />
            </div>
            <div className={`${container} w-1/2`}>
              <label htmlFor="endDate" className={labelStyle}>
                End Date
              </label>
              <input
                type="text"
                id="endDate"
                name="endDate"
                value={endDate} // Format date to YYYY-MM-DD
                disabled
                className={`px-4 border border-[#1D54E11A] rounded-[10px] outline-none flex items-center text-[#1D54E1] h-[50px] bg-[#1D54E11A] cursor-not-allowed`}
              />
            </div>
          </div>

        </form>

        {/* Confirmation Modal */}
        <Modal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          bgDarkened
        >
          <div className="p-4 text-center">
            <p className="text-[#474747] mb-4">
              Are you sure you want to proceed with creating this proposal?
            </p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitStatus.loading}
                className="px-4 py-2 text-white bg-[#F8B51C] rounded flex items-center justify-center min-w-[80px]"
              >
                {submitStatus.loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </Modal>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          bgDarkened
        >
          <div className="p-4 flex flex-col items-center justify-center">
            <div className="p-2 h-fit border rounded-full shadow-md bg-[#60CF0B]">
              <TiTickOutline className="text-2xl text-white" />
            </div>
            <p className="text-[#474747] mt-2">Proposal posted successfully</p>

            {isAnalyzing && (
              <div className="flex items-center gap-2 mt-4">
                <div className="w-5 h-5 border-2 border-[#1D54E1] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[#474747]">Analyzing sentiment...</span>
              </div>
            )}

            {sentimentAnalysis && !isAnalyzing && (
              <div className="mt-4 text-center">
                <p className="text-[#474747] mb-2">Sentiment Analysis Complete!</p>
                <p className={`font-semibold ${
                  sentimentAnalysis.overallSentiment === 'positive' ? 'text-green-600' :
                  sentimentAnalysis.overallSentiment === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  Overall Sentiment: {sentimentAnalysis.overallSentiment.toUpperCase()}
                </p>
              </div>
            )}

            <div className="flex gap-4 mt-4">
              <Link href="/app">
                <button className="flex bg-gradient-to-r from-[#F8B51C] to-[#FEE539] text-white items-center justify-center px-6 py-2 rounded-lg">
                  <span className="flex items-center gap-2">View Proposals</span>
                </button>
              </Link>

              {sentimentAnalysis && (
                <Link href="/app/sentiment-dashboard">
                  <button className="flex bg-[#1D54E1] text-white items-center justify-center px-6 py-2 rounded-lg">
                    <span className="flex items-center gap-2">View Analysis</span>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </Modal>
      </div>

      <section className="w-[25%] flex flex-col gap-y-5">
        <section className="flex flex-col bg-white p-5 rounded-[10px]">
          <div className="pb-3 border-b-[1px] border-[#D5D5D5]">
            <h3 className="text-[20px] text-[#232426] font-medium">How to create a proposal</h3>
          </div>

          <section className="p-2">
            <div className="flex flex-col gap-y-2">
              <h3 className="text-[16px] font-medium">Important notes</h3>
              <p className="text-[16px] text-[#5B5E65]">
                Proposals are subject to review and may require additional
                information. Ensure you have all necessary details before
                submission.
              </p>
            </div>
          </section>
        </section>

        <div className="flex flex-col gap-y-[10px] p-[15px] bg-white rounded-[10px] w-full">
          <button type="button" className="text-[#1D54E1] w-full flex items-center h-[50px] justify-center bg-[#1D54E11A] rounded-[10px]">Preview proposal</button>


          {/* Submit Button */}
          <button
            type="button"
            onClick={() => {
              if (validateProposal()) {
                setShowConfirmation(true);
              }
            }}
            disabled={submitStatus.loading || proposalLoading}
            className="text-lg text-white h-[54px] flex items-center justify-center bg-[#1D54E1] rounded-[10px] w-full hover:bg-[#1D54E1] transition-colors duration-700 cursor-pointer disabled:opacity-50"
          >
            {submitStatus.loading || proposalLoading
              ? "Submitting..."
              : "Create proposal"}
          </button>
        </div>
      </section>
    </main>
  );
};

export default CreateProposal;
