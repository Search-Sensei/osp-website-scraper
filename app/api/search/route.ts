import { NextResponse } from 'next/server';

const BANK_ADJECTIVES = ['Premium', 'Everyday', 'Essential', 'Elite', 'Platinum', 'Gold', 'Signature', 'Rewards', 'Cash Back', 'Student', 'Business', 'Corporate', 'Travel', 'Secure', 'Basic', 'Ultimate'];
const BANK_NOUNS = ['Card', 'Visa', 'Mastercard', 'Credit Line', 'Account', 'Checking', 'Savings', 'Portfolio', 'Advantage', 'Benefits'];
const BANK_ACTIONS = ['Find the right', 'Apply for a', 'Upgrade your', 'Manage your', 'Explore our', 'Discover the'];
const DETAILS_TEMPLATES = [
  "Pay down balances faster with this excellent low-interest option for {type}.",
  "Earn unlimited points for every $1 spent on {type} purchases. No foreign transaction fees.",
  "Get cash back on everyday purchases at {type} stores, restaurants, and gas stations.",
  "Start building your credit history today with our {type} offering. No annual fee.",
  "Separate your business expenses and earn rewards on {type} services.",
  "Save on interest with an introductory 0% APR for the first 18 billing cycles for {type}.",
  "Enjoy complimentary airport lounge access and triple points on {type} flights and hotels.",
  "A secure way to establish, strengthen, or rebuild credit with our {type} line.",
  "Simple and straightforward rewards on {type} every day. Rewards never expire.",
  "Perfect for a night out. Earn extra points on dining and {type} entertainment.",
];

// Generate exactly 100 realistic looking mock rows
const ALL_MOCK_RESULTS = Array.from({ length: 100 }).map((_, i) => {
  const adj = BANK_ADJECTIVES[i % BANK_ADJECTIVES.length];
  const noun = BANK_NOUNS[(i * 3) % BANK_NOUNS.length];
  const action = BANK_ACTIONS[(i * 7) % BANK_ACTIONS.length];
  const type = ['travel', 'dining', 'groceries', 'business', 'online', 'retail', 'entertainment'][(i * 5) % 7];
  const detailTpl = DETAILS_TEMPLATES[i % DETAILS_TEMPLATES.length];
  
  return {
    title: `${action} ${adj} ${noun} ${i + 1}`,
    detail: detailTpl.replace('{type}', type),
    url: `/products/${type}/${adj.toLowerCase()}-${noun.toLowerCase()}`
  };
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  // Shuffle the 100 results and pick 20 random ones
  const shuffled = [...ALL_MOCK_RESULTS].sort(() => 0.5 - Math.random());
  const results = shuffled.slice(0, 20);

  // Wait a small amount to simulate network latency if needed (optional)
  // await new Promise(resolve => setTimeout(resolve, 300));

  return NextResponse.json({
    data: {
      query,
      results
    }
  });
}
