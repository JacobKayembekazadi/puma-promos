
export const NAV_LINKS = ["Products", "Catalog", "Resources"];

export const USE_CASE_OPTIONS = [
  "Employee Appreciation", "Trade Show/Event", "Client Gifts", "Company Store/Swag",
  "Holiday Gifts", "New Hire Kits", "Safety Awards", "Team Building"
];

export const TIMELINE_OPTIONS = [
  { value: "rush", label: "⚡ Rush (7-10 days)" },
  { value: "standard", label: "✓ Standard (2-3 weeks)" },
  { value: "flexible", label: "📅 Flexible (30+ days)" },
];

export const BUDGET_OPTIONS = ["Under $5", "$5-$10", "$10-$20", "$20-$50", "$50+", "Custom"];

export const CATEGORY_OPTIONS = [
  "Drinkware (Tumblers, Bottles, Mugs)",
  "Apparel (T-Shirts, Hoodies, Hats)",
  "Tech Accessories (Power Banks, Earbuds, USB)",
  "Bags & Totes (Backpacks, Totes, Duffels)",
  "Office Supplies (Pens, Notebooks, Desk Items)",
  "Awards & Plaques (Recognition Items)",
  "Food & Snacks (Gift Boxes, Candy)",
  "Eco-Friendly (Sustainable Products)",
];

export const PLACEMENT_OPTIONS = ["Front/Center", "Left Chest", "Full Wrap", "Multiple Locations", "Let us decide"];

export const REFERRAL_OPTIONS = ["Google Search", "Referral", "Social Media", "Trade Show", "Existing Customer", "Other"];

export const REAL_PRODUCTS: { name: string; description: string; price: number; reason: string; }[] = [
  {
    name: "20oz Stainless Steel Tumbler",
    description: "This insulated tumbler keeps your drinks at perfect temperature throughout the workday.",
    price: 8.99,
    reason: "Perfect for daily use, high perceived value, keeps drinks hot/cold"
  },
  {
    name: "Daily Perk Coffee Mug",
    description: "A classic ceramic mug that is essential for every employee's morning coffee routine.",
    price: 6.50,
    reason: "Budget-friendly, everyone uses mugs, wide imprint area"
  },
  {
    name: "Pro-Fit Adjustable Cap",
    description: "Our premium adjustable cap offers a professional and stylish addition to your company swag.",
    price: 9.25,
    reason: "Wearable branding, comfortable fit, works for all head sizes"
  },
];
