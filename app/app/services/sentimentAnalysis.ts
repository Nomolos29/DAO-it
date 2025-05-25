import openai from '../lib/openai';
import { SentimentAnalysis, Comment } from '../types/sentiment';
import { useCommentService } from './commentService';

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

/**
 * Analyzes sentiment for a proposal based on its comments
 * @throws Will throw an error if the analysis fails or if called in a server-side context
 */
export async function analyzeSentiment(
  proposalId: string,
  proposalTitle: string,
  proposalSummary: string,
  proposalDescription: string
): Promise<SentimentAnalysis> {
  // Ensure we're on the client side
  if (!isClient) {
    throw new Error('Sentiment analysis can only be performed in client-side environment');
  }

  // Validate inputs
  if (!proposalId) {
    throw new Error('Proposal ID is required for sentiment analysis');
  }

  console.log(`Starting sentiment analysis for proposal ${proposalId}`);
  
  // Try to get real comments from the API
  let comments: Comment[] = [];
  try {
    const commentService = useCommentService();
    console.log('Fetching comments for sentiment analysis...');
    const commentsResponse = await commentService.getAllComments(proposalId);
    
    // Map API comments to our internal format
    if (commentsResponse && Array.isArray(commentsResponse)) {
      comments = commentsResponse.map(c => ({
        id: c.id || c.commentId || `comment-${Math.random()}`,
        author: c.author || c.userId || 'Anonymous',
        content: c.text || c.commentText || c.content || '',
        timestamp: c.createdAt || new Date().toISOString(),
        sentiment: 'neutral' // Default, will be updated by analysis
      }));
      console.log(`Fetched ${comments.length} comments for analysis`);
    } else {
      console.warn('Comments response is not an array or is empty');
    }
  } catch (error) {
    console.error('Error fetching comments for sentiment analysis:', error);
    throw new Error(`Failed to fetch comments: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  // If no comments were found, use a default message
  if (comments.length === 0) {
    console.warn('No comments found, using default comment');
    comments = [
      {
        id: `default-comment-${Date.now()}`,
        author: 'System',
        content: 'No comments available for this proposal yet.',
        timestamp: new Date().toISOString(),
        sentiment: 'neutral'
      }
    ];
  }
  
  const analysisContent = `
Analyze the sentiment of this DAO proposal and its community feedback:

PROPOSAL:
Title: ${proposalTitle}
Summary: ${proposalSummary}
Description: ${proposalDescription}

COMMUNITY COMMENTS:
${comments.map(c => `- ${c.author}: "${c.content}"`).join('\n')}

Please provide a JSON response with exactly this structure:
{
  "overallSentiment": "positive" or "negative" or "neutral",
  "sentimentScore": number between -1 and 1,
  "breakdown": {
    "positive": percentage as number,
    "negative": percentage as number,
    "neutral": percentage as number
  },
  "keyThemes": ["theme1", "theme2", "theme3", "theme4", "theme5"],
  "insights": ["insight1", "insight2", "insight3", "insight4", "insight5"]
}`;

  try {
    console.log('Sending request to OpenAI for sentiment analysis...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "You are a sentiment analysis expert for DAO proposals. Analyze community feedback and provide insights in the exact JSON format requested. Always include all required fields with appropriate values." 
        },
        { role: "user", content: analysisContent }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }
    
    console.log('Received response from OpenAI, parsing result...');
    let result;
    try {
      result = JSON.parse(content);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError, 'Response content:', content);
      throw new Error('Failed to parse OpenAI response');
    }
    
    // Validate the result structure
    if (!result.overallSentiment || !result.breakdown || !result.keyThemes || !result.insights) {
      console.error('Invalid response structure from OpenAI:', result);
      throw new Error('OpenAI response is missing required fields');
    }
    
    const analysis: SentimentAnalysis = {
      proposalId,
      overallSentiment: result.overallSentiment,
      sentimentScore: typeof result.sentimentScore === 'number' ? result.sentimentScore : 0,
      breakdown: {
        positive: result.breakdown.positive || 0,
        negative: result.breakdown.negative || 0,
        neutral: result.breakdown.neutral || 0,
      },
      keyThemes: Array.isArray(result.keyThemes) ? result.keyThemes : [],
      insights: Array.isArray(result.insights) ? result.insights : [],
      comments: comments.map(c => ({
        ...c,
        sentiment: determineCommentSentiment(c.content, result)
      })),
      timestamp: new Date().toISOString()
    };
    
    console.log('Sentiment analysis completed successfully');
    return analysis;
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    throw new Error(`Sentiment analysis failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Helper function to determine sentiment of individual comments
function determineCommentSentiment(
  content: string, 
  result: any
): 'positive' | 'negative' | 'neutral' {
  // Simple heuristic - in a real implementation, this would be more sophisticated
  const lowerContent = content.toLowerCase();
  
  // Positive words
  const positiveWords = ['great', 'good', 'excellent', 'support', 'agree', 'like', 'helpful', 'innovative'];
  
  // Negative words
  const negativeWords = ['bad', 'poor', 'terrible', 'disagree', 'against', 'problem', 'issue', 'concern'];
  
  let positiveScore = 0;
  let negativeScore = 0;
  
  positiveWords.forEach(word => {
    if (lowerContent.includes(word)) positiveScore++;
  });
  
  negativeWords.forEach(word => {
    if (lowerContent.includes(word)) negativeScore++;
  });
  
  if (positiveScore > negativeScore) return 'positive';
  if (negativeScore > positiveScore) return 'negative';
  return 'neutral';
}
