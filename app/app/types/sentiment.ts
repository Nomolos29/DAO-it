export interface Comment {
    id: string;
    author: string;
    content: string;
    timestamp: string;
    sentiment: 'positive' | 'negative' | 'neutral';
  }
  
  export interface SentimentAnalysis {
    proposalId: string;
    overallSentiment: 'positive' | 'negative' | 'neutral';
    sentimentScore: number;
    breakdown: {
      positive: number;
      negative: number;
      neutral: number;
    };
    keyThemes: string[];
    insights: string[];
    comments: Comment[];
    timestamp: string;
  }
  
  export interface ProposalWithSentiment {
    id: string;
    title: string;
    summary: string;
    sentimentAnalysis: SentimentAnalysis;
  }
