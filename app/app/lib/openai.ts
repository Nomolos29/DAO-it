import OpenAI from 'openai';

// Check if we're running on the client side
const isClient = typeof window !== 'undefined';

// Create a function to get the OpenAI client
const getOpenAIClient = () => {
  // Ensure we're on the client side
  if (!isClient) {
    throw new Error('OpenAI client can only be initialized in client-side environment');
  }

  // Check if API key is available
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Please check your environment variables.');
  }

  try {
    // Create and return the OpenAI client
    return new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true, // Allow usage in browser environment
      timeout: 30000, // 30 seconds timeout
    });
  } catch (error) {
    console.error('Error initializing OpenAI client:', error);
    throw new Error(`Failed to initialize OpenAI client: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// Create a singleton instance with lazy initialization
let openaiInstance: OpenAI | null = null;

const openai = new Proxy({} as OpenAI, {
  get: (target, prop) => {
    // Initialize the client on first use
    if (!openaiInstance) {
      try {
        openaiInstance = getOpenAIClient();
      } catch (error) {
        console.error('Error accessing OpenAI client:', error);
        throw error;
      }
    }
    return openaiInstance[prop as keyof OpenAI];
  }
});

export default openai;
