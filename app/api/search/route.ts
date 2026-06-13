import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  // The single mock row template
  const mockRow = {
    title: "Find the Right Card",
    detail: "down balances faster, maximize cash back, earn rewards or begin building your credit history, we have the ideal card for you!   No matter which card"
  };

  // Create an array with 20 copies of the mock row, varying the text slightly
  const results = Array.from({ length: 20 }).map((_, index) => ({
    title: `Find the Right Card - Option ${index + 1}`,
    detail: `[Result ${index + 1}] down balances faster, maximize cash back, earn rewards or begin building your credit history, we have the ideal card for you! No matter which card you choose.`
  }));

  // Wait a small amount to simulate network latency if needed (optional)
  // await new Promise(resolve => setTimeout(resolve, 300));

  return NextResponse.json({
    data: {
      query,
      results
    }
  });
}
