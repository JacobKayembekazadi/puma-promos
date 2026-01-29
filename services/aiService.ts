
import type { QuoteFormData, QuoteResult, RecommendedProduct, ChatMessage } from '../types';
import { REAL_PRODUCTS } from '../constants';

// Environment variables
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

// Get the appropriate API key based on provider
const getApiKey = (): string | undefined => {
  switch (AI_PROVIDER.toLowerCase()) {
    case 'openai':
      return OPENAI_API_KEY;
    case 'anthropic':
    case 'claude':
      return ANTHROPIC_API_KEY;
    case 'gemini':
    case 'google':
    default:
      return GEMINI_API_KEY;
  }
};

const API_KEY = getApiKey();

if (!API_KEY) {
  console.warn(`${AI_PROVIDER.toUpperCase()}_API_KEY environment variable not set. Using mock data.`);
}

// Prompt templates (shared across providers)
const generateQuotePrompt = (data: QuoteFormData): string => {
  const productExamples = REAL_PRODUCTS.map(p => `- ${p.name} (~$${p.price.toFixed(2)})`).join('\n');
  return `
You are an AI sales assistant for PumaPromos, a Houston-based promotional products company.
A client has submitted a quote request with the following details:
- Use Case: ${data.useCase}
- Number of Items: ${data.recipientCount}
- Desired Timeline: ${data.timeline}
- Budget Per Item: ${data.customBudget || data.budgetPerItem}
- Product Categories of Interest: ${data.productCategories.join(', ')}
- Special Requirements: ${data.specialRequirements || 'None'}

Here are some example products we offer with their typical price:
${productExamples}

Based on the client's details, your task is to:
1.  Recommend exactly 3 promotional products that are a great fit. For each product, provide:
    - A short, catchy 'name'.
    - A 'description' (string, max 25 words) for the product.
    - A realistic 'price' per item (number only), keeping our examples in mind.
    - A compelling 'reason' (string, max 15 words) why it's a good fit for their needs.
2.  Calculate a quote summary based on your recommended product prices and the client's item count:
    - Calculate 'subtotal'.
    - Add a fixed 'setupFees' of 150.
    - Estimate 'shipping' as 8% of the subtotal.
    - Calculate the final 'total'.
3.  Generate a unique 'quoteNumber' starting with 'Q' followed by 8 random digits.

Respond ONLY with a valid JSON object matching this schema:
{
  "quoteNumber": "string",
  "products": [{ "name": "string", "description": "string", "price": number, "reason": "string" }],
  "subtotal": number,
  "setupFees": number,
  "shipping": number,
  "total": number
}
Do not include any other text or markdown formatting.
`;
};

const CHAT_SYSTEM_PROMPT = `You are an AI assistant for PumaPromos, a Houston-based promotional products company. You must adhere to a professional, monochrome aesthetic in your persona.

Your role:
1. Help customers find perfect promotional products.
2. Answer pricing and customization questions.
3. Provide product recommendations.
4. Be friendly, professional, and consultative.

Key facts:
- We're based in Houston, Texas
- We sell branded promotional items for businesses
- Typical minimums: 25-100 units
- Standard turnaround: 10-14 business days

Guidelines:
- Keep responses concise and clear.
- Suggest specific products with prices.
- Always mention minimum quantities when relevant.
- If unsure, offer to connect with our human team.`;

// Mock implementation for when no API key is set
const generateMockQuote = async (data: QuoteFormData): Promise<QuoteResult> => {
  const recipientCount = Number(data.recipientCount) || 100;
  console.log("Using mock quote generation.");
  const productsWithQuantity = REAL_PRODUCTS.map(p => ({...p, quantity: recipientCount}));

  const subtotal = productsWithQuantity.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const setupFees = 150.00;
  const shipping = subtotal * 0.08;
  const total = subtotal + setupFees + shipping;

  await new Promise(resolve => setTimeout(resolve, 2500));
  return {
    quoteNumber: `Q${Math.floor(10000000 + Math.random() * 90000000)}`,
    products: productsWithQuantity,
    subtotal,
    setupFees,
    shipping,
    total,
  };
};

// Provider interface
interface AIProvider {
  generateQuote(data: QuoteFormData): Promise<QuoteResult>;
  getChatResponseStream(history: ChatMessage[], newMessage: string): AsyncGenerator<string>;
}

// Gemini Provider
const createGeminiProvider = (): AIProvider => {
  let chat: unknown = null;

  const getAi = async () => {
    const { GoogleGenAI } = await import('@google/genai');
    return new GoogleGenAI({ apiKey: API_KEY });
  };

  return {
    async generateQuote(data: QuoteFormData): Promise<QuoteResult> {
      const recipientCount = Number(data.recipientCount) || 100;
      const ai = await getAi();
      const { Type } = await import('@google/genai');

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: generateQuotePrompt(data),
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              quoteNumber: { type: Type.STRING },
              products: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING },
                    price: { type: Type.NUMBER },
                    reason: { type: Type.STRING },
                  },
                  required: ["name", "description", "price", "reason"],
                },
              },
              subtotal: { type: Type.NUMBER },
              setupFees: { type: Type.NUMBER },
              shipping: { type: Type.NUMBER },
              total: { type: Type.NUMBER },
            },
            required: ["quoteNumber", "products", "subtotal", "setupFees", "shipping", "total"],
          },
        },
      });

      const quoteResult = JSON.parse(response.text);
      quoteResult.products.forEach((p: RecommendedProduct) => { p.quantity = recipientCount; });
      return quoteResult;
    },

    async *getChatResponseStream(history: ChatMessage[], newMessage: string): AsyncGenerator<string> {
      const ai = await getAi();
      const { GenerateContentResponse } = await import('@google/genai');

      if (!chat) {
        chat = ai.chats.create({
          model: 'gemini-2.0-flash',
          config: { systemInstruction: CHAT_SYSTEM_PROMPT },
        });
      }

      const typedChat = chat as { sendMessageStream: (opts: { message: string }) => Promise<AsyncIterable<unknown>> };
      const stream = await typedChat.sendMessageStream({ message: newMessage });
      for await (const chunk of stream) {
        const c = chunk as { text?: string };
        if (c.text) { yield c.text; }
      }
    }
  };
};

// OpenAI Provider
const createOpenAIProvider = (): AIProvider => {
  const messages: Array<{ role: string; content: string }> = [
    { role: 'system', content: CHAT_SYSTEM_PROMPT }
  ];

  const callOpenAI = async (body: object): Promise<Response> => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    return response;
  };

  return {
    async generateQuote(data: QuoteFormData): Promise<QuoteResult> {
      const recipientCount = Number(data.recipientCount) || 100;

      const response = await callOpenAI({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that responds only with valid JSON.' },
          { role: 'user', content: generateQuotePrompt(data) }
        ],
        response_format: { type: 'json_object' },
      });

      const result = await response.json();
      const quoteResult = JSON.parse(result.choices[0].message.content);
      quoteResult.products.forEach((p: RecommendedProduct) => { p.quantity = recipientCount; });
      return quoteResult;
    },

    async *getChatResponseStream(history: ChatMessage[], newMessage: string): AsyncGenerator<string> {
      messages.push({ role: 'user', content: newMessage });

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              yield content;
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      messages.push({ role: 'assistant', content: assistantMessage });
    }
  };
};

// Anthropic Provider
const createAnthropicProvider = (): AIProvider => {
  const messages: Array<{ role: string; content: string }> = [];

  return {
    async generateQuote(data: QuoteFormData): Promise<QuoteResult> {
      const recipientCount = Number(data.recipientCount) || 100;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: 'You are a helpful assistant that responds only with valid JSON.',
          messages: [{ role: 'user', content: generateQuotePrompt(data) }],
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const result = await response.json();
      const quoteResult = JSON.parse(result.content[0].text);
      quoteResult.products.forEach((p: RecommendedProduct) => { p.quantity = recipientCount; });
      return quoteResult;
    },

    async *getChatResponseStream(history: ChatMessage[], newMessage: string): AsyncGenerator<string> {
      messages.push({ role: 'user', content: newMessage });

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          stream: true,
          system: CHAT_SYSTEM_PROMPT,
          messages: messages,
        }),
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

        for (const line of lines) {
          const data = line.slice(6);
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              assistantMessage += parsed.delta.text;
              yield parsed.delta.text;
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      messages.push({ role: 'assistant', content: assistantMessage });
    }
  };
};

// Provider factory
const getProvider = (): AIProvider => {
  switch (AI_PROVIDER.toLowerCase()) {
    case 'openai':
      return createOpenAIProvider();
    case 'anthropic':
    case 'claude':
      return createAnthropicProvider();
    case 'gemini':
    case 'google':
    default:
      return createGeminiProvider();
  }
};

let provider: AIProvider | null = null;

// Public API
export const generateQuote = async (data: QuoteFormData): Promise<QuoteResult> => {
  if (!API_KEY) {
    return generateMockQuote(data);
  }

  if (!provider) {
    provider = getProvider();
  }

  try {
    return await provider.generateQuote(data);
  } catch (error) {
    console.error("Error generating quote:", error);
    throw new Error("Failed to generate quote from AI.");
  }
};

export const getChatResponseStream = async function* (history: ChatMessage[], newMessage: string) {
  if (!API_KEY) {
    yield "This is a mock response. Please set up your API key to chat with the AI.";
    return;
  }

  if (!provider) {
    provider = getProvider();
  }

  try {
    yield* provider.getChatResponseStream(history, newMessage);
  } catch (error) {
    console.error("Error getting chat response:", error);
    yield "Sorry, I encountered an error. Please try again.";
  }
};
