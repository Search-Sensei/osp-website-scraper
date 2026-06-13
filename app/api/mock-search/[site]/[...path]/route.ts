import { NextResponse } from 'next/server';
import { mockDatabase } from '@/app/lib/mock-data';

export async function GET(
  request: Request,
  { params }: { params: { site: string; path: string[] } }
) {
  const { site, path } = params;
  const { searchParams } = new URL(request.url);

  console.log(`[Mock Search API] Site: ${site}, Path: /${path.join('/')}`);

  // Artificial delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800));

  // Deep clone to avoid mutating base
  let results = JSON.parse(JSON.stringify(mockDatabase));

  // Shuffle array using Fisher-Yates
  for (let i = results.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [results[i], results[j]] = [results[j], results[i]];
  }

  // Support for Nationwide (Yext format)
  if (site === 'nationwide_com') {
    // Yext uses 'input' parameter typically
    const query = searchParams.get('input') || searchParams.get('query') || '';
    
    // For Yext format, if there is no query and it doesn't want default results, we could return empty. 
    // Here we'll return 10 random items regardless to simulate generic answers.
    const yextResults = results.slice(0, 10).map((r: any) => ({
      data: {
        id: r.id,
        type: "helpArticle",
        body: r.detail,
        landingPageUrl: r.url,
        shortDescription: r.title,
        name: r.title,
        c_activeInAnswers: true,
        c_articleCategory: "Mock Category",
        c_helpArticlesConnector: true,
        c_primaryCTA: {
          label: "Read More",
          linkType: "URL",
          link: r.url
        },
        s_snippet: r.detail,
        uid: r.id
      },
      highlightedFields: {
        name: {
          value: r.title,
          matchedSubstrings: [{ offset: 0, length: 4 }]
        },
        s_snippet: {
          value: r.detail,
          matchedSubstrings: [{ offset: 0, length: 4 }]
        }
      }
    }));

    // Construct the nested Yext JSON response format
    const yextResponse = {
      meta: {
        uuid: `mock-uuid-${Date.now()}`,
        errors: []
      },
      response: {
        businessId: 1996565,
        modules: [
          {
            verticalConfigId: "help_articles",
            resultsCount: yextResults.length,
            encodedState: "",
            results: yextResults,
            appliedQueryFilters: [],
            queryDurationMillis: 150,
            facets: [],
            source: "KNOWLEDGE_MANAGER"
          }
        ],
        failedVerticals: [],
        queryId: `query-${Date.now()}`,
        searchIntents: [],
        locationBias: {
          latitude: 13.752494,
          longitude: 100.493509,
          locationDisplayName: "Mock Location",
          accuracy: "IP"
        }
      }
    };

    return NextResponse.json(yextResponse);
  }

  // Default basic format if site is unknown or simple
  const query = searchParams.get('q') || searchParams.get('query') || '';
  if (!query) {
    return NextResponse.json({ results: [] });
  }

  results = results.slice(0, 20);
  return NextResponse.json({ results });
}
