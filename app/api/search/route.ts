import { NextResponse } from 'next/server';

const snippetFragments = [
  "down balances faster, maximize cash <b>back</b>, earn rewards or begin building your credit history",
  "access to your funds anytime, with no hidden <b>fees</b> and easy online bill pay",
  "interest rates are historically low, making now the perfect time to <b>refinance</b> your existing mortgage",
  "portfolio growth through strategic investments, our <b>wealth</b> advisors are ready to help you plan",
  "flexible financing options designed to help your <b>business</b> thrive in today's competitive market",
  "new or used vehicles with competitive <b>rates</b> and flexible terms up to 72 months",
  "deposit checks, transfer funds, and monitor your <b>account</b> securely from your smartphone",
  "guaranteed returns with a fixed-rate <b>CD</b>. Choose terms ranging from 3 months to 5 years",
  "secure your golden years with a comprehensive <b>retirement</b> strategy tailored to your lifestyle",
  "consolidate debt or fund your next big project with a fixed-rate <b>personal</b> loan",
  "manage your daily expenses with a checking account that works for you",
  "no matter which card you choose, enjoy premium benefits and exceptional service",
  "apply online in minutes and get an instant decision on your next big purchase",
  "speak with a planner today to ensure your family's future is well protected",
  "maximize your savings with our high-yield options and start earning more today"
];

const titles = [
  "Find the Right Card",
  "Open a Checking Account",
  "Refinance Your Home",
  "Wealth Management Solutions",
  "Small Business Loans",
  "Auto Loan Rates",
  "Mobile Banking App",
  "Certificate of Deposit (CD)",
  "Retirement Planning",
  "Personal Loans",
  "Student Checking Accounts",
  "Home Equity Line of Credit",
  "Commercial Real Estate Financing",
  "Investment Advisory Services",
  "Cash Management Solutions"
];

// Generate 100 unique realistic-looking mock results by combining fragments
const mockDatabase = Array.from({ length: 100 }).map((_, i) => {
  // Use a pseudo-random approach based on index to ensure 100 stable but varied items
  const titleBase = titles[(i * 3) % titles.length];
  const frag1 = snippetFragments[(i * 7) % snippetFragments.length];
  const frag2 = snippetFragments[(i * 11) % snippetFragments.length];
  
  return {
    title: titleBase,
    detail: `${frag1}, we have the ideal solution for you! &nbsp; ${frag2}...`,
    url: `https://example.com/products/${titleBase.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`
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

  // Deep clone to avoid mutating base
  let results = JSON.parse(JSON.stringify(mockDatabase));
  
  // Shuffle array using Fisher-Yates
  for (let i = results.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [results[i], results[j]] = [results[j], results[i]];
  }

  // Return exactly 20 random rows without appending extra suffixes to match the raw HTML look
  results = results.slice(0, 20);

  return NextResponse.json({ results });
}
