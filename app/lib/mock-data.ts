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

export const mockDatabase = Array.from({ length: 100 }).map((_, i) => {
  const titleBase = titles[(i * 3) % titles.length];
  const frag1 = snippetFragments[(i * 7) % snippetFragments.length];
  const frag2 = snippetFragments[(i * 11) % snippetFragments.length];

  return {
    id: `item-${i}`,
    title: titleBase,
    detail: `${frag1}, we have the ideal solution for you! &nbsp; ${frag2}...`,
    url: `https://example.com/products/${titleBase.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`
  };
});
