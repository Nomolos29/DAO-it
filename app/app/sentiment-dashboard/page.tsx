"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { SentimentDashboard } from '../components/SentimentDashboard';
import { getAllSentimentAnalyses } from '../services/sentimentStorage';
import { SentimentAnalysis } from '../types/sentiment';

export default function SentimentDashboardPage() {
  const [analyses, setAnalyses] = useState<SentimentAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SentimentAnalysis | null>(null);

  useEffect(() => {
    const storedAnalyses = getAllSentimentAnalyses();
    setAnalyses(storedAnalyses);
    if (storedAnalyses.length > 0) {
      setSelectedAnalysis(storedAnalyses[0]);
    }
  }, []);

  return (
    <main className="w-full px-[24px] pb-20 pt-5">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/app"
          className="inline-flex py-5 items-center px-6 h-[50px] justify-center bg-[#F7F3FF] transition-all duration-500 text-[#1D54E1] hover:bg-[#1D54E1] hover:text-white rounded-[10px] gap-2 font-medium text-md cursor-pointer mb-8"
        >
          <FaArrowLeftLong /> Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Proposal Sentiment Analysis</h1>

        {analyses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No sentiment analyses available yet.</p>
            <Link
              href="/app/create-proposal"
              className="inline-flex items-center px-6 py-3 bg-[#1D54E1] text-white rounded-lg hover:bg-[#1640a1]"
            >
              Create a Proposal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Proposal List */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Analyzed Proposals</h2>
                <div className="space-y-2">
                  {analyses.map((analysis) => (
                    <button
                      key={analysis.proposalId}
                      onClick={() => setSelectedAnalysis(analysis)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedAnalysis?.proposalId === analysis.proposalId
                          ? 'bg-[#F7F3FF] text-[#1D54E1]'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <p className="font-medium">Proposal {analysis.proposalId.slice(-8)}</p>
                      <p className={`text-sm ${
                        analysis.overallSentiment === 'positive' ? 'text-green-600' :
                        analysis.overallSentiment === 'negative' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {analysis.overallSentiment.charAt(0).toUpperCase() + analysis.overallSentiment.slice(1)}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sentiment Dashboard */}
            <div className="col-span-9">
              {selectedAnalysis && (
                <SentimentDashboard
                  analysis={selectedAnalysis}
                  proposalTitle={`Proposal ${selectedAnalysis.proposalId.slice(-8)}`}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
