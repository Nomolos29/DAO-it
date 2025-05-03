import openai from '../lib/openai';
import { SentimentAnalysis } from '../types/sentiment';
import { generateMockComments } from '../utils/mockComments';

export async function analyzeSentiment(
  proposalId: string,
  proposalTitle: string,
  proposalSummary: string,
  proposalDescription: string
): Promise<SentimentAnalysis> {
  const comments = generateMockComments(proposalTitle, 15);
  
  const analysisContent = `
Analyze the sentiment of this DAO proposal and its community feedback:

PROPOSAL:
Title: ${proposalTitle}
Summary: ${proposalSummary}
Description: ${proposalDescription}

COMMUNITY COMMENTS:
${comments.map(c => `- ${c.author}: "${c.content}" [${c.sentiment}]`).join('\n')}

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
    if (!content) throw new Error('No content received from OpenAI');
    
    const result = JSON.parse(content);
    
    const analysis: SentimentAnalysis = {
      proposalId,
      overallSentiment: result.overallSentiment || 'neutral',
      sentimentScore: typeof result.sentimentScore === 'number' ? result.sentimentScore : 0,
      breakdown: {
        positive: result.breakdown?.positive || 33,
        negative: result.breakdown?.negative || 33,
        neutral: result.breakdown?.neutral || 34,
      },
      keyThemes: Array.isArray(result.keyThemes) ? result.keyThemes : [
        'Implementation Strategy',
        'Resource Allocation', 
        'Timeline Concerns',
        'Community Impact',
        'Technical Approach'
      ],
      insights: Array.isArray(result.insights) ? result.insights : [
        'Mixed community response with valid concerns raised',
        'Strong support for the core concept but implementation questions remain',
        'Timeline appears ambitious according to several community members',
        'Resource allocation needs more detailed planning',
        'Technical approach requires further community discussion'
      ],
      comments: comments,
      timestamp: new Date().toISOString()
    };
    
    return analysis;
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    return {
      proposalId,
      overallSentiment: 'neutral',
      sentimentScore: 0,
      breakdown: {
        positive: 40,
        negative: 30,
        neutral: 30,
      },
      keyThemes: [
        'Implementation Timeline', 
        'Resource Allocation', 
        'Community Impact',
        'Technical Feasibility',
        'Governance Considerations'
      ],
      insights: [
        'Community shows mixed reactions to the proposal',
        'Concerns raised about implementation feasibility',
        'Strong support for addressing the underlying problem',
        'Timeline and resource allocation need clarification',
        'Technical approach requires more detailed explanation'
      ],
      comments: comments,
      timestamp: new Date().toISOString()
    };
  }
}
