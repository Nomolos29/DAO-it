"use client";

import React, { useState, useEffect } from "react";
import star from "../assets/StarsIcon.svg";
import Link from "next/link";
import { IoInformationCircle } from "react-icons/io5";
import { ImExit } from "react-icons/im";
import { TiTickOutline } from "react-icons/ti";
import { Modal } from "../components";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import {
  getContract,
  prepareContractCall,
  createThirdwebClient,
  waitForReceipt,
} from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { DAOIT } from "../lib/constants";
import { toast } from "react-toastify";

// Thirdweb client and contract setup
const client = createThirdwebClient({
  clientId: "58cdb2d58aaf66e7872b6eb45c258fdd",
});

const daoitContract = getContract({
  address: DAOIT,
  chain: sepolia,
  client,
});

const CreateProposal = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [proposalId, setProposalId] = useState("");
  const [proposalTitle, setProposalTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<{
    proposalTitle: string;
    structuredProposal: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    loading: boolean;
    error: string | null;
  }>({ loading: false, error: null });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const account = useActiveAccount();
  const { mutate: sendTransaction, isPending: proposalLoading } =
    useSendTransaction();

  const generateProposalId = (address: string) => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 5);
    return `prop_${
      address ? address.slice(-4) : "anon"
    }_${timestamp}_${randomStr}`;
  };

  useEffect(() => {
    if (account) {
      setWalletAddress(account.address);
      setProposalId(generateProposalId(account.address));
    }
  }, [account]);

  const generateProposalStructure = async () => {
    if (!proposalTitle) {
      toast.error("Please enter a proposal title first");
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch(
        "https://api.craftthefuture.xyz/webhook/daoitaiproposal",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: proposalTitle }),
        }
      );
      if (!response.ok) throw new Error("Failed to fetch AI suggestions");
      const data = await response.json();
      console.log("AI response data:", data);
      if (data.proposal_tittle && data.structured_proposal) {
        setAiSuggestion({
          proposalTitle: data.proposal_tittle,
          structuredProposal: data.structured_proposal,
        });
      } else {
        toast.error("Invalid AI response format");
      }
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast.error("Failed to generate AI suggestions");
    } finally {
      setIsGenerating(false);
    }
  };

  const createProposalOnChain = async (title: string, description: string) => {
    try {
      const proposalTx = await prepareContractCall({
        contract: daoitContract,
        method:
          "function createProposal(string memory title, string memory _description)",
        params: [title, description],
      });
      const txHash = (await sendTransaction(
        proposalTx
      )) as unknown as `0x${string}`;
      setSubmitStatus({ loading: false, error: null });
      setShowSuccess(true);
      waitForReceipt({
        transactionHash: txHash,
        client,
        chain: sepolia,
      }).then((receipt) => {
        console.log("Receipt received:", receipt);
      });
      return true;
    } catch (error) {
      console.error("Error in createProposalOnChain:", error);
      throw error;
    }
  };

  const onSubmit = async () => {
    setSubmitStatus({ loading: true, error: null });
    setShowConfirmation(false);
    try {
      toast.info("Please sign the transaction with your wallet");
      await createProposalOnChain(proposalTitle, description);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setSubmitStatus({ loading: false, error: errorMessage });
      toast.error("Submission failed: " + errorMessage);
    }
  };

  // Function to format the structured_proposal
  const formatStructuredProposal = (text: string) => {
    const sections = text.split(/(?=[A-Z][a-z]+:)/).filter(Boolean); // Split by section headers like "Abstract:", "Rationale:", etc.
    return sections.map((section, index) => {
      const [header, content] = section.split(/:\s*/, 2);
      if (!content) return null;

      // Handle numbered lists in "Specifications" section
      if (header === "Specifications") {
        const items = content.split(/\d+\.\s/).filter(Boolean);
        return (
          <div key={index} className="mb-4">
            <h5 className="font-medium text-yellow-800">{header}:</h5>
            <ol className="list-decimal list-inside text-gray-600">
              {items.map((item, i) => (
                <li key={i}>{item.trim()}</li>
              ))}
            </ol>
          </div>
        );
      }

      return (
        <div key={index} className="mb-4">
          <h5 className="font-medium text-yellow-800">{header}:</h5>
          <p className="text-gray-600">{content.trim()}</p>
        </div>
      );
    });
  };

  const inputStyle =
    "px-4 border border-[#CECECE] rounded-[10px] outline-none bg-transparent flex items-center text-[#474747]";
  const labelStyle = "text-[#494445] text-[14px]";
  const container = "flex flex-col gap-y-2";

  return (
    <main className="w-full flex justify-center pb-20">
      <div className="w-[750px] flex flex-col gap-y-10">
        <div className="flex justify-between items-center pb-10">
          <div className="relative group cursor-pointer">
            <IoInformationCircle className="text-2xl hover:text-[#474747]" />
            <div className="flex flex-col gap-y-2 p-[12px] shadow-md opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-[10px] w-[300px] text-[#474747] absolute top-[-12px] left-[-12px]">
              <IoInformationCircle className="text-2xl" />
              <p className="text-[14px]">
                Submit your idea for voting. A fee is required to ensure serious
                and thoughtful proposals.
              </p>
            </div>
          </div>
          <Link
            href="/app"
            className="flex py-5 items-center transition-all duration-500 hover:text-[#474747] gap-2 cursor-pointer"
          >
            Home <ImExit className="text-2xl" />
          </Link>
        </div>

        <h2 className="text-[28px] text-[#474747]">
          Create and publish a proposal
        </h2>

        <form className="flex flex-col gap-y-5">
          <div className={container}>
            <label htmlFor="walletAddress" className={labelStyle}>
              Connected wallet address
            </label>
            <input
              type="text"
              id="walletAddress"
              value={walletAddress}
              className={`${inputStyle} h-[50px]`}
              disabled
            />
          </div>

          <div className={container}>
            <label htmlFor="proposalId" className={labelStyle}>
              Proposal ID
            </label>
            <input
              type="text"
              id="proposalId"
              value={proposalId}
              className={`${inputStyle} h-[50px]`}
              disabled
            />
          </div>

          <div className={container}>
            <div className="flex w-full justify-between items-end -mt-3">
              <label htmlFor="proposalTitle" className={labelStyle}>
                Proposal Title
              </label>
              <button
                type="button"
                onClick={generateProposalStructure}
                disabled={isGenerating}
                className="text-lg h-[40px] flex items-center justify-between rounded-[10px] w-[210px] bg-gradient-to-tr from-[#F8B51C] px-4 to-[#FEE539] text-[#474747] transition-colors duration-700"
              >
                {isGenerating ? (
                  "Generating..."
                ) : (
                  <>
                    <img src={star} alt="Star Icon" width={20} />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              id="proposalTitle"
              value={proposalTitle}
              onChange={(e) => setProposalTitle(e.target.value)}
              className={`${inputStyle} h-[50px]`}
            />
            {/* AI Suggestion Display Below Title */}
            {aiSuggestion && (
              <div className="p-4 mt-2 border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <h4 className="text-sm font-medium text-yellow-800">
                      AI Suggestion
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setProposalTitle(aiSuggestion.proposalTitle);
                        setDescription(aiSuggestion.structuredProposal);
                        setAiSuggestion(null);
                      }}
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-yellow-700 bg-yellow-100 rounded-md hover:bg-yellow-200"
                    >
                      Insert Suggestion
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiSuggestion(null)}
                      className="text-yellow-600 hover:text-yellow-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      AI
                    </button>
                  </div>
                </div>
                <div className="prose-sm prose text-gray-600 max-w-none">
                  <div className="mb-4">
                    <h5 className="font-medium text-yellow-800">
                      Suggested Title:
                    </h5>
                    <p className="text-gray-600">
                      {aiSuggestion.proposalTitle}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-yellow-800">
                      Suggested Description:
                    </h5>
                    {formatStructuredProposal(aiSuggestion.structuredProposal)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={container}>
            <label htmlFor="shortDescription" className={labelStyle}>
              Short Description/Summary
            </label>
            <textarea
              id="shortDescription"
              rows={4}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div className={container}>
            <label htmlFor="description" className={labelStyle}>
              Description
            </label>
            <textarea
              id="description"
              rows={10}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={inputStyle}
            />
          </div>

          <div className="flex justify-between w-full gap-x-5">
            <div className={`${container} w-1/2`}>
              <label htmlFor="startDate" className={labelStyle}>
                Start date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`${inputStyle} h-[50px]`}
              />
            </div>
            <div className={`${container} w-1/2`}>
              <label htmlFor="endDate" className={labelStyle}>
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`${inputStyle} h-[50px]`}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowConfirmation(true)}
            disabled={
              submitStatus.loading ||
              !walletAddress ||
              !proposalTitle ||
              !shortDescription ||
              !description ||
              !startDate ||
              !endDate
            }
            className="text-lg text-white h-[54px] flex items-center justify-center bg-[#1B1B1B] rounded-[10px] w-full border border-[#F8B51C] hover:bg-gradient-to-tr from-[#F8B51C] to-[#FEE539] hover:text-[#474747] transition-colors duration-700 cursor-pointer disabled:opacity-50"
          >
            {submitStatus.loading || proposalLoading
              ? "Submitting..."
              : "Create proposal"}
          </button>
        </form>

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
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
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
            <Link href="/app">
              <button className="flex bg-gradient-to-r from-[#F8B51C] to-[#FEE539] text-white items-center justify-center w-[350px] px-4 py-2 my-1 rounded-lg">
                <span className="flex items-center gap-2">View</span>
              </button>
            </Link>
          </div>
        </Modal>
      </div>
    </main>
  );
};

export default CreateProposal;
