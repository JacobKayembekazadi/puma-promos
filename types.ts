
export interface QuoteFormData {
  // Step 1
  useCase: string;
  recipientCount: number | string;
  eventDate: string;
  timeline: string;

  // Step 2
  budgetPerItem: string;
  customBudget: string;
  productCategories: string[];
  specialRequirements: string;

  // Step 3
  logoFile: File | null;
  logoPreview: string;
  brandColors: string;
  logoPlacement: string[];

  // Step 4
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  referralSource: string;
}

export interface RecommendedProduct {
  name: string;
  description: string;
  price: number;
  reason: string;
  quantity: number;
  image?: string; // Kept for potential future use, but will not be rendered.
}

export interface QuoteResult {
  quoteNumber: string;
  products: RecommendedProduct[];
  subtotal: number;
  setupFees: number;
  shipping: number;
  total: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}
