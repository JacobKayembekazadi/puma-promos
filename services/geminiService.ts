
import { GoogleGenAI, Type, GenerateContentResponse, Chat } from "@google/genai";
import type { QuoteFormData, QuoteResult, RecommendedProduct, ChatMessage } from '../types';
import { REAL_PRODUCTS } from '../constants';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using mock data.");
}

const getAi = () => new GoogleGenAI({ apiKey: API_KEY });

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

Respond ONLY with a valid JSON object matching the provided schema. Do not include any other text or markdown formatting.
`;
};


export const generateQuote = async (data: QuoteFormData): Promise<QuoteResult> => {
  const recipientCount = Number(data.recipientCount) || 100;

  if (!API_KEY) {
    console.log("Using mock quote generation.");
    const productsWithQuantity = REAL_PRODUCTS.map(p => ({...p, quantity: recipientCount}));
    
    const subtotal = productsWithQuantity.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const setupFees = 150.00;
    const shipping = subtotal * 0.08;
    const total = subtotal + setupFees + shipping;
    
    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate network delay
    return {
      quoteNumber: `Q${Math.floor(10000000 + Math.random() * 90000000)}`,
      products: productsWithQuantity,
      subtotal,
      setupFees,
      shipping,
      total,
    };
  }

  const ai = getAi();
  try {
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

  } catch (error) {
    console.error("Error generating quote:", error);
    throw new Error("Failed to generate quote from AI.");
  }
};


let chat: Chat | null = null;
const initializeChat = (): Chat => {
    const ai = getAi();
    return ai.chats.create({
        model: 'gemini-2.0-flash',
        config: {
            systemInstruction: `You are an AI assistant for PumaPromos, a Houston-based promotional products company. You must adhere to a professional, monochrome aesthetic in your persona.

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
            - If unsure, offer to connect with our human team.`,
        },
    });
}

export const getChatResponseStream = async function* (history: ChatMessage[], newMessage: string) {
    if (!API_KEY) {
        yield "This is a mock response. Please set up your API key to chat with the AI.";
        return;
    }

    if (!chat) { chat = initializeChat(); }

    try {
        const stream = await chat.sendMessageStream({ message: newMessage });
        for await (const chunk of stream) {
            const c = chunk as GenerateContentResponse
            if (c.text) { yield c.text; }
        }
    } catch (error) {
        console.error("Error getting chat response:", error);
        yield "Sorry, I encountered an error. Please try again.";
    }
};
