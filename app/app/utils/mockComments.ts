import { Comment } from '../types/sentiment';

const POSITIVE_TEMPLATES = [
  "This proposal is exactly what our DAO needs! The {aspect} is particularly well thought out.",
  "I'm excited about this initiative. The {aspect} could really make a difference.",
  "Great proposal! The {aspect} addresses a key issue we've been facing.",
  "I fully support this. The {aspect} is innovative and practical.",
  "This aligns perfectly with our DAO's vision. The {aspect} is especially promising.",
];

const NEGATIVE_TEMPLATES = [
  "I have concerns about the {aspect}. It seems unrealistic given our current resources.",
  "The {aspect} needs more thought. This could create unintended consequences.",
  "I'm skeptical about the {aspect}. Have we considered alternative approaches?",
  "This proposal overlooks important considerations in the {aspect}.",
  "The {aspect} seems rushed. We need more detailed planning.",
];

const NEUTRAL_TEMPLATES = [
  "The {aspect} has both pros and cons that need careful consideration.",
  "I'd like to see more details about the {aspect} before forming an opinion.",
  "The {aspect} is interesting, but we should explore all options.",
  "This proposal raises important questions about the {aspect}.",
  "The {aspect} needs more community discussion before moving forward.",
];

const ASPECTS = [
  "timeline", "budget allocation", "implementation strategy", 
  "community impact", "technical approach", "governance model",
  "resource requirements", "risk assessment", "team structure",
  "milestone planning"
];

const AUTHORS = [
  "dao_member_1", "crypto_enthusiast", "governance_expert",
  "tech_lead_42", "community_voice", "validator_node",
  "defi_builder", "web3_pioneer", "blockchain_dev",
  "token_holder_99"
];

export function generateMockComments(proposalTitle: string, count: number = 10): Comment[] {
  const comments: Comment[] = [];
  
  const sentimentDistribution = {
    positive: Math.floor(count * 0.4),
    negative: Math.floor(count * 0.3),
    neutral: Math.floor(count * 0.3)
  };
  
  const total = sentimentDistribution.positive + sentimentDistribution.negative + sentimentDistribution.neutral;
  if (total < count) {
    sentimentDistribution.positive += count - total;
  }
  
  let sentimentArray: ('positive' | 'negative' | 'neutral')[] = [];
  
  for (let i = 0; i < sentimentDistribution.positive; i++) sentimentArray.push('positive');
  for (let i = 0; i < sentimentDistribution.negative; i++) sentimentArray.push('negative');
  for (let i = 0; i < sentimentDistribution.neutral; i++) sentimentArray.push('neutral');
  
  sentimentArray = sentimentArray.sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < count; i++) {
    const sentiment = sentimentArray[i];
    const aspect = ASPECTS[Math.floor(Math.random() * ASPECTS.length)];
    const author = AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
    
    let templates;
    switch (sentiment) {
      case 'positive':
        templates = POSITIVE_TEMPLATES;
        break;
      case 'negative':
        templates = NEGATIVE_TEMPLATES;
        break;
      default:
        templates = NEUTRAL_TEMPLATES;
    }
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    const content = template.replace('{aspect}', aspect);
    
    comments.push({
      id: `comment_${Date.now()}_${i}`,
      author: author,
      content: content,
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      sentiment: sentiment
    });
  }
  
  return comments.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
