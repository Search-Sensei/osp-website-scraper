export const genericYextMapper = (ospData: any) => {
  const results = ospData?.body?.results || [];
  return {
    meta: {
      uuid: ospData?.searchId || "mapped-uuid",
      errors: []
    },
    response: {
      businessId: 1996565,
      modules: [
        {
          verticalConfigId: "help_articles",
          resultsCount: ospData?.body?.resultsCount || results.length,
          results: results.map((r: any, idx: number) => ({
            data: {
              id: `mapped-${idx}`,
              type: "helpArticle",
              name: r.title,
              body: r.body ? r.body.substring(0, 50) + "..." : "",
              landingPageUrl: r.url,
              s_snippet: r.body ? r.body.substring(0, 150) + "..." : "",
              c_primaryCTA: {
                label: "Read More",
                linkType: "URL",
                link: r.url
              }
            }
          }))
        }
      ]
    }
  };
};

export const genericFlatMapper = (ospData: any) => {
  const results = ospData?.body?.results || [];
  return {
    results: results.map((r: any) => ({
      title: r.title || 'Untitled',
      url: r.url || '#',
      summary: r.body ? r.body.substring(0, 150) + "..." : ""
    }))
  };
};

export type SiteConfig = {
  clientId: string;
  clientSecret: string;
  tenant: string;
  responseMapper?: (ospData: any) => any;
};

// Define a unified mapping of siteIds to their corresponding configurations
export const siteConfigs: Record<string, SiteConfig> = {
  'citizensbank_com': {
    clientId: 'osp-m2m-citizensbank',
    clientSecret: process.env.CITIZENSBANK_CLIENT_SECRET || '',
    tenant: 'citizensbank',
    responseMapper: genericYextMapper
  },
  'nationwide_com': {
    clientId: 'osp-m2m-nationwide',
    clientSecret: process.env.NATIONWIDE_CLIENT_SECRET || '',
    tenant: 'nationwide',
    responseMapper: genericYextMapper
  },
  'communitysavings_bank': {
    clientId: 'osp-m2m-communitysavings',
    clientSecret: process.env.COMMUNITYSAVINGS_CLIENT_SECRET || '',
    tenant: 'communitysavings',
    responseMapper: genericFlatMapper
  },
  'peapackprivate_com': {
    clientId: 'osp-m2m-peapackprivate',
    clientSecret: process.env.PEAPACKPRIVATE_CLIENT_SECRET || '',
    tenant: 'peapackprivate',
    responseMapper: genericFlatMapper
  }
};
