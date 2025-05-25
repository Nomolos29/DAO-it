"use client";

import React, { useState, useEffect, ErrorInfo, ReactNode } from 'react';
import Link from 'next/link';
import { SentimentDashboard } from '../components/SentimentDashboard';
import { getAllSentimentAnalyses } from '../services/sentimentStorage';
import { SentimentAnalysis } from '../types/sentiment';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: ReactNode, fallback: ReactNode },
  { hasError: boolean, error: Error | null }
> {
  constructor(props: { children: ReactNode, fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Loading component
const LoadingState = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <div className="bg-gray-100 rounded-lg h-64"></div>
      </div>
      <div className="col-span-9">
        <div className="bg-gray-100 rounded-lg h-96"></div>
      </div>
    </div>
  </div>
);

// Error component
const ErrorState = ({ message }: { message: string }) => (
  <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
    <h3 className="text-lg font-medium mb-2">Error Loading Sentiment Dashboard</h3>
    <p>{message}</p>
    <div className="mt-4">
      <Link
        href="/app"
        className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
      >
        Return to Dashboard
      </Link>
    </div>
  </div>
);

export default function SentimentDashboardPage() {
  const [analyses, setAnalyses] = useState<SentimentAnalysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SentimentAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalyses() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
          throw new Error('Cannot access sentiment analyses in server-side environment');
        }
        
        const storedAnalyses = await getAllSentimentAnalyses();
        setAnalyses(storedAnalyses);
        
        if (storedAnalyses.length > 0) {
          setSelectedAnalysis(storedAnalyses[0]);
        }
      } catch (err) {
        console.error('Error loading sentiment analyses:', err);
        setError(`Failed to load sentiment analyses: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAnalyses();
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <main className="w-full px-[24px] pb-20 pt-5 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <LoadingState />
        </div>
      </main>
    );
  }

  // Show error state
  if (error) {
    return (
      <main className="w-full px-[24px] pb-20 pt-5 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Proposal Sentiment Analysis</h1>
          <ErrorState message={error} />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full px-[24px] pb-20 pt-5 overflow-auto">
      <div className="max-w-7xl mx-auto">
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

            {/* Sentiment Dashboard with Error Boundary */}
            <div className="col-span-9">
              {selectedAnalysis && (
                <ErrorBoundary fallback={
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-red-600 mb-2">Error Displaying Dashboard</h3>
                    <p className="text-gray-600 mb-4">There was a problem displaying the sentiment dashboard for this proposal.</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Try Again
                    </button>
                  </div>
                }>
                  <SentimentDashboard
                    analysis={selectedAnalysis}
                    proposalTitle={`Proposal ${selectedAnalysis.proposalId.slice(-8)}`}
                  />
                </ErrorBoundary>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
