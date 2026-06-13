import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  const results = [
    {
      title: "Find the Right Card",
      detail: "Pay down balances faster, maximize cash back, earn rewards or begin building your credit history, we have the ideal card for you! No matter which card"
    },
    {
      title: "Premium Rewards Credit Card",
      detail: "Earn unlimited 2 points for every $1 spent on travel and dining purchases, and 1.5 points per $1 on all other purchases. No foreign transaction fees."
    },
    {
      title: "Cash Back Visa Signature",
      detail: "Get 5% cash back on everyday purchases at different places each quarter like grocery stores, restaurants, gas stations, and more, up to the quarterly maximum."
    },
    {
      title: "Student Journey Credit Card",
      detail: "Start building your credit history today with no annual fee. Get access to higher credit lines after your first 6 on-time monthly payments."
    },
    {
      title: "Small Business Advantage Card",
      detail: "Separate your business expenses and earn 3% cash back at office supply stores, internet, cable and phone services. Flexible employee card limits."
    },
    {
      title: "Low Interest Platinum Card",
      detail: "Save on interest with an introductory 0% APR for the first 18 billing cycles on purchases and balance transfers. A great way to consolidate debt."
    },
    {
      title: "Travel Elite Mastercard",
      detail: "Enjoy complimentary airport lounge access, statement credits for global entry, and triple points on flights and hotels booked through our portal."
    },
    {
      title: "Secured Credit Builder",
      detail: "A secure way to establish, strengthen, or rebuild credit. Your credit line is determined by the amount of your fully refundable security deposit."
    },
    {
      title: "Everyday Rewards Card",
      detail: "Simple and straightforward rewards. Earn 1.5% unlimited cash back on every purchase, everywhere, every day. Rewards never expire as long as your account is open."
    },
    {
      title: "Dining & Entertainment Card",
      detail: "Perfect for a night out. Earn 4x points on dining, takeout, and food delivery, plus 3x points on entertainment and streaming subscriptions."
    },
    {
      title: "Retail Store Credit Card",
      detail: "Exclusive benefits for our most loyal shoppers. Enjoy 10% off your first purchase, free shipping on all orders, and special birthday rewards."
    },
    {
      title: "Zero Liability Protection",
      detail: "Shop with peace of mind. All our credit cards come with comprehensive fraud monitoring and $0 liability for unauthorized transactions."
    },
    {
      title: "Balance Transfer Specials",
      detail: "Take control of your finances. Explore our latest balance transfer offers designed to help you consolidate high-interest debt and save money."
    },
    {
      title: "Credit Card Comparison Guide",
      detail: "Not sure which card fits your lifestyle? Use our side-by-side comparison tool to view interest rates, annual fees, and reward programs."
    },
    {
      title: "Understanding Your Credit Score",
      detail: "Access your FICO Score for free anytime. Learn what factors impact your credit rating and get personalized tips for improving your financial health."
    },
    {
      title: "Auto Pay Setup",
      detail: "Never miss a payment again. Easily enroll in Auto Pay to have your minimum payment or full statement balance automatically deducted each month."
    },
    {
      title: "Mobile Wallet Integration",
      detail: "Add your new credit card to Apple Pay, Google Pay, or Samsung Pay for secure, contactless payments wherever you shop."
    },
    {
      title: "Travel Insurance Benefits",
      detail: "Your eligible card includes built-in trip cancellation insurance, baggage delay coverage, and secondary auto rental collision damage waiver."
    },
    {
      title: "Credit Limit Increase Request",
      detail: "Has your income changed? Find out if you qualify for a higher credit limit. An increased line of credit may help improve your overall credit utilization."
    },
    {
      title: "Reporting a Lost or Stolen Card",
      detail: "Act quickly if your card goes missing. Lock your card instantly through our mobile app, and request a replacement card with a new account number."
    }
  ];

  // Wait a small amount to simulate network latency if needed (optional)
  // await new Promise(resolve => setTimeout(resolve, 300));

  return NextResponse.json({
    data: {
      query,
      results
    }
  });
}
