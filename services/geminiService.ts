
import { Laptop, Category } from "../types";

export interface BotReply {
  message: string;             // Plain text part of the reply
  products: Laptop[];          // Matched laptops from inventory (empty if none)
}

/**
 * Smart Finder Logic (Free Alternative to Gemini)
 * Scans inventory for keywords, budget, and brand.
 */
export const getLaptopRecommendation = async (
  userInput: string,
  inventory: Laptop[]
): Promise<BotReply> => {
  const query = userInput.toLowerCase();

  // 1. Extract Budget (looking for numbers like 300k, 250000, etc.)
  let maxPrice = Infinity;
  const kMatch = query.match(/(\d+)\s*k/);
  const fullMatch = query.match(/(\d{5,})/);

  if (kMatch) {
    maxPrice = parseInt(kMatch[1]) * 1000;
  } else if (fullMatch) {
    maxPrice = parseInt(fullMatch[1]);
  }

  // 2. Identify Keywords for Filtering
  const keywords = {
    school: ['student', 'school', 'university', 'college', 'assignment', 'study'],
    coding: ['coding', 'programming', 'developer', 'software', 'python', 'java', 'web'],
    gaming: ['gaming', 'game', 'gamer', 'nvidia', 'gpu', 'graphics'],
    business: ['business', 'office', 'corporate', 'work', 'professional'],
    cheap: ['cheap', 'budget', 'affordable', 'low price'],
    apple: ['apple', 'macbook', 'mac', 'macos'],
    hp: ['hp', 'hewlett'],
    dell: ['dell', 'latitude', 'xps', 'precision'],
  };

  // 3. Filter Inventory
  let matches = inventory.filter(l => l.price <= maxPrice);

  // Filter by brand if mentioned
  if (query.includes('apple') || query.includes('macbook')) {
    matches = matches.filter(l => l.brand.toLowerCase() === 'apple');
  } else if (query.includes('hp')) {
    matches = matches.filter(l => l.brand.toLowerCase() === 'hp');
  } else if (query.includes('dell')) {
    matches = matches.filter(l => l.brand.toLowerCase() === 'dell');
  }

  // Filter by use case
  if (query.match(/(gaming|game|graphics)/)) {
    matches = matches.filter(l => l.category === Category.GAMING || l.specs.toLowerCase().includes('graphics'));
  } else if (query.match(/(coding|programming|dev)/)) {
    matches = matches.filter(l => l.specs.toLowerCase().includes('i7') || l.specs.toLowerCase().includes('16gb') || l.category === Category.BUSINESS || l.category === Category.PROGRAMMING);
  } else if (query.match(/(student|school)/)) {
    matches = matches.filter(l => l.category === Category.STUDENT || l.price < 250000);
  }

  // Sort by relevance (best price for budget)
  matches.sort((a, b) => b.price - a.price);

  // Take top 3
  const finalProducts = matches.slice(0, 3);

  // 4. Generate Message
  let message = "";
  if (finalProducts.length > 0) {
    if (maxPrice !== Infinity) {
      message = `I found some great options under ₦${maxPrice.toLocaleString()} for you! These are tested, reliable, and ready for nationwide delivery.`;
    } else {
      message = `Based on what you're looking for, I highly recommend these laptops. They offer great performance and value!`;
    }
  } else {
    // If no specific match, suggest 3 popular ones
    const fallbacks = inventory.slice(0, 3);
    message = `I couldn't find a perfect match for that specific request, but check out these top deals! Alternatively, tell me your budget (e.g., "under 250k").`;
    return {
      message,
      products: fallbacks
    };
  }

  return {
    message,
    products: finalProducts
  };
};
