import { SentimentAnalysis, ProposalWithSentiment } from '../types/sentiment';

const STORAGE_KEY = 'dao_sentiment_analysis';

export function saveSentimentAnalysis(analysis: SentimentAnalysis): void {
  const existing = getAllSentimentAnalyses();
  const updated = existing.filter(a => a.proposalId !== analysis.proposalId);
  updated.push(analysis);
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getSentimentAnalysis(proposalId: string): SentimentAnalysis | null {
  const analyses = getAllSentimentAnalyses();
  return analyses.find(a => a.proposalId === proposalId) || null;
}

export function getAllSentimentAnalyses(): SentimentAnalysis[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getProposalsWithSentiment(): ProposalWithSentiment[] {
  const analyses = getAllSentimentAnalyses();
  return analyses.map(analysis => ({
    id: analysis.proposalId,
    title: `Proposal ${analysis.proposalId}`,
    summary: 'Summary not available',
    sentimentAnalysis: analysis
  }));
}
