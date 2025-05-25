import { SentimentAnalysis, ProposalWithSentiment } from '../types/sentiment';
import apiClient from './apiClient';
import { useProposalService } from './proposalService';

const STORAGE_KEY = 'dao_sentiment_analysis';

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

// Helper function to safely access localStorage
function safeLocalStorage() {
  if (!isClient) {
    throw new Error('Cannot access localStorage in server-side environment');
  }
  return window.localStorage;
}

// Save sentiment analysis
export async function saveSentimentAnalysis(analysis: SentimentAnalysis): Promise<void> {
  try {
    if (!isClient) {
      throw new Error('Cannot save sentiment analysis in server-side environment');
    }
    
    // Get existing analyses
    const existing = await getAllSentimentAnalyses();
    const updated = existing.filter(a => a.proposalId !== analysis.proposalId);
    updated.push(analysis);
    
    // Save to localStorage
    safeLocalStorage().setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Log success
    console.log(`Sentiment analysis saved for proposal ${analysis.proposalId}`);
  } catch (error) {
    console.error('Error saving sentiment analysis:', error);
    throw new Error(`Failed to save sentiment analysis: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Get sentiment analysis for a specific proposal
export async function getSentimentAnalysis(proposalId: string): Promise<SentimentAnalysis | null> {
  try {
    if (!isClient) {
      console.warn('Attempting to get sentiment analysis in server-side environment');
      return null;
    }
    
    const analyses = await getAllSentimentAnalyses();
    const analysis = analyses.find(a => a.proposalId === proposalId);
    
    if (!analysis) {
      console.warn(`No sentiment analysis found for proposal ${proposalId}`);
    }
    
    return analysis || null;
  } catch (error) {
    console.error(`Error getting sentiment analysis for proposal ${proposalId}:`, error);
    throw new Error(`Failed to get sentiment analysis: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Get all sentiment analyses
export function getAllSentimentAnalyses(): Promise<SentimentAnalysis[]> {
  return new Promise((resolve, reject) => {
    try {
      if (!isClient) {
        console.warn('Attempting to get all sentiment analyses in server-side environment');
        resolve([]);
        return;
      }
      
      const stored = safeLocalStorage().getItem(STORAGE_KEY);
      if (!stored) {
        resolve([]);
        return;
      }
      
      try {
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) {
          console.warn('Stored sentiment analyses is not an array, returning empty array');
          resolve([]);
          return;
        }
        
        resolve(parsed);
      } catch (parseError) {
        console.error('Error parsing stored sentiment analyses:', parseError);
        // If JSON parsing fails, clear the corrupted data
        safeLocalStorage().removeItem(STORAGE_KEY);
        reject(new Error(`Failed to parse stored sentiment analyses: ${parseError instanceof Error ? parseError.message : String(parseError)}`));
      }
    } catch (error) {
      console.error('Error getting all sentiment analyses:', error);
      reject(new Error(`Failed to get all sentiment analyses: ${error instanceof Error ? error.message : String(error)}`));
    }
  });
}

// Get proposals with sentiment analysis
export async function getProposalsWithSentiment(): Promise<ProposalWithSentiment[]> {
  try {
    if (!isClient) {
      throw new Error('Cannot get proposals with sentiment in server-side environment');
    }
    
    const proposalService = useProposalService();
    const analyses = await getAllSentimentAnalyses();
    
    // Try to get real proposal data
    const proposals = await proposalService.getAllProposals();
    
    if (!proposals || !Array.isArray(proposals)) {
      throw new Error('Failed to fetch proposals or received invalid data');
    }
    
    return proposals.map(proposal => {
      const proposalId = proposal.id || proposal.proposalId || 'unknown';
      if (!proposalId || proposalId === 'unknown') {
        console.warn('Proposal without ID found, using default ID');
      }
      
      const analysis = analyses.find(a => a.proposalId === proposalId);
      
      // Create a default empty sentiment analysis if none is found
      const defaultAnalysis: SentimentAnalysis = {
        proposalId: proposalId,
        overallSentiment: 'neutral',
        sentimentScore: 0,
        breakdown: {
          positive: 0,
          negative: 0,
          neutral: 100,
        },
        keyThemes: [],
        insights: [],
        comments: [],
        timestamp: new Date().toISOString()
      };
      
      return {
        id: proposalId,
        title: proposal.title || proposal.proposalTitle || `Proposal ${proposalId}`,
        summary: proposal.summary || proposal.proposalSummary || '',
        sentimentAnalysis: analysis || defaultAnalysis
      };
    });
  } catch (error) {
    console.error('Error getting proposals with sentiment:', error);
    throw new Error(`Failed to get proposals with sentiment: ${error instanceof Error ? error.message : String(error)}`);
  }
}
