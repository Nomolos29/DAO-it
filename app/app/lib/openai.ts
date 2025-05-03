import OpenAI from 'openai';

// A single instance of the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Allow usage in browser environment
});

export default openai;