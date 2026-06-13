import { NextResponse } from 'next/server';

const topics = [
  "Checking & Savings Accounts",
  "Personal Wealth Management",
  "Corporate Banking Solutions",
  "Mortgage & Refinancing Options",
  "Retirement Planning Tools",
  "Credit Card Rewards & Benefits",
  "Online & Mobile Banking Features",
  "Commercial Real Estate Loans",
  "Investment Portfolios",
  "Small Business Financing"
];

const descriptions = [
  "Explore our comprehensive options designed to help you build financial security and achieve your long-term goals.",
  "Get competitive rates and flexible terms that adapt to your unique financial situation and lifestyle.",
  "Secure your future with advanced tools, expert advice, and personalized strategies from our dedicated team.",
  "Manage your money anytime, anywhere with our award-winning digital platform and 24/7 customer support.",
  "Whether you're starting out or scaling up, we have the resources and capital to fuel your next big step."
];

// Generate 100 realistic-looking mock results
const mockDatabase = Array.from({ length: 100 }).map((_, i) => {
  const topic = topics[i % topics.length];
  const desc = descriptions[i % descriptions.length];
  return {
    title: `${topic} - Essential Guide ${i + 1}`,
    detail: `${desc} Learn how we can support your journey with tailored solutions and industry-leading expertise. (Result #${i + 1})`,
    url: `https://example.com/products/${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i + 1}`
  };
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  console.log(`[Mock Search API] Received query: ${query}`);

  // Artificial delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  // Shuffle array using Fisher-Yates
  let results = [...mockDatabase];
  for (let i = results.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [results[i], results[j]] = [results[j], results[i]];
  }

  // Return 20 random rows, injecting the query into the title so it looks relevant
  results = results.slice(0, 20).map(res => ({
    ...res,
    title: `[Match: "${query}"] ${res.title}`
  }));

  return NextResponse.json({ results });
}
