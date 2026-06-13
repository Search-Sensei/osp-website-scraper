import { NextResponse } from 'next/server';

const topics = [
  "Find the Right Card",
  "Open a Checking Account",
  "Refinance Your Home",
  "Wealth Management Solutions",
  "Small Business Loans",
  "Auto Loan Rates",
  "Mobile Banking App",
  "Certificate of Deposit (CD)",
  "Retirement Planning",
  "Personal Loans"
];

const descriptions = [
  "down balances faster, maximize cash <b>back</b>, earn rewards or begin building your credit history, we have the ideal card for you! &nbsp; No matter which card",
  "access to your funds anytime, with no hidden <b>fees</b> and easy online bill pay. &nbsp; Manage your daily expenses",
  "interest rates are historically low, making now the perfect time to <b>refinance</b> your existing mortgage. &nbsp; Discover how much you",
  "portfolio growth through strategic investments, our <b>wealth</b> advisors are ready to help you plan for the future. &nbsp; Schedule a",
  "flexible financing options designed to help your <b>business</b> thrive in today's competitive market. &nbsp; Learn more about our",
  "new or used vehicles with competitive <b>rates</b> and flexible terms up to 72 months. &nbsp; Apply online in minutes",
  "deposit checks, transfer funds, and monitor your <b>account</b> securely from your smartphone. &nbsp; Download our highly-rated",
  "guaranteed returns with a fixed-rate <b>CD</b>. Choose terms ranging from 3 months to 5 years. &nbsp; Maximize your savings",
  "secure your golden years with a comprehensive <b>retirement</b> strategy tailored to your lifestyle. &nbsp; Speak with a planner",
  "consolidate debt or fund your next big project with a fixed-rate <b>personal</b> loan. &nbsp; No collateral required"
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
