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

export const genericTransparentMapper = (ospData: any) => {
  return ospData;
};

export const genericFlatMapper = (ospData: any) => {
  const results = ospData?.body?.results || [];
  return {
    results: results.map((r: any) => {
      const title = r.title || 'Untitled';
      const url = r.url || '#';
      const summary = r.body ? r.body.substring(0, 150) + "..." : "";
      
      // Determine categories: try to parse API categories/category first
      let categoriesList: string[] = [];
      if (Array.isArray(r.categories)) {
        categoriesList = r.categories;
      } else if (typeof r.categories === 'string') {
        categoriesList = [r.categories];
      } else if (r.category) {
        categoriesList = Array.isArray(r.category) ? r.category : [r.category];
      }
      
      // Fallback to server-side classification heuristic if API returned no categories
      if (categoriesList.length === 0) {
        const urlLower = url.toLowerCase();
        const titleLower = title.toLowerCase();
        
        if (urlLower.includes("/business/") || urlLower.includes("/commercial/") || urlLower.includes("/sba/") || urlLower.includes("/agricultural/")) {
          categoriesList = ["Business"];
        } else if (urlLower.includes("/individuals/") || urlLower.includes("/personal/") || urlLower.includes("/individual/")) {
          categoriesList = ["Personal"];
        } else if (urlLower.includes("/contact/") || urlLower.includes("/calculator/") || urlLower.includes("/resources/") || urlLower.includes("/help/") || urlLower.includes("/support/")) {
          categoriesList = ["Help and Support"];
        } else if (urlLower.includes("/about/") || urlLower.includes("/careers/") || urlLower.includes("/news/") || urlLower.includes("/board/")) {
          categoriesList = ["Corporate"];
        } else if (titleLower.includes("business") || titleLower.includes("sba") || titleLower.includes("commercial")) {
          categoriesList = ["Business"];
        } else if (titleLower.includes("personal") || titleLower.includes("individual") || titleLower.includes("checking") || titleLower.includes("savings")) {
          categoriesList = ["Personal"];
        } else if (titleLower.includes("help") || titleLower.includes("support") || titleLower.includes("contact") || titleLower.includes("calculator") || titleLower.includes("faq")) {
          categoriesList = ["Help and Support"];
        } else if (titleLower.includes("about") || titleLower.includes("careers") || titleLower.includes("corporate") || titleLower.includes("board")) {
          categoriesList = ["Corporate"];
        } else {
          categoriesList = ["Personal"];
        }
      }

      return {
        title,
        url,
        summary,
        categories: categoriesList
      };
    })
  };
};

export type SiteConfig = {
  clientId: string;
  clientSecret: string;
  tenant: string;
  responseMapper?: (ospData: any) => any;
  chatConfig?: {
    enabled: boolean;
    apiBaseUrl?: string;
    title?: string;
    buttonText?: string;
    primaryColor?: string;
    secondaryColor?: string;
    logoUrl?: string;
    welcomeMessage?: string;
  };
};

// Define a unified mapping of siteIds to their corresponding configurations
export const siteConfigs: Record<string, SiteConfig> = {
  'citizensbank_com': {
    clientId: 'osp-m2m-citizensbank',
    clientSecret: process.env.CITIZENSBANK_CLIENT_SECRET || '',
    tenant: 'citizensbank',
    responseMapper: genericYextMapper,
    chatConfig: {
      enabled: true,
      apiBaseUrl: "https://sensei-agents.australiaeast.cloudapp.azure.com/agilent",
      title: "Citizens Bank Assistant",
      buttonText: "Message Us",
      primaryColor: "#006039",
      secondaryColor: "#006039",
      logoUrl: "https://www.citizensbank.com/assets/CB_resources/images/cbds-logos/logo-citizens__horz-green.svg"
    }
  },
  'nationwide_com': {
    clientId: 'osp-m2m-nationwide',
    clientSecret: process.env.NATIONWIDE_CLIENT_SECRET || '',
    tenant: 'nationwide',
    responseMapper: genericYextMapper,
    chatConfig: {
      enabled: true,
      apiBaseUrl: "https://sensei-agents.australiaeast.cloudapp.azure.com/agilent",
      title: "Nationwide Assistant",
      buttonText: "Message Us",
      primaryColor: "#002C77",
      secondaryColor: "#0056B3",
      logoUrl: "/scraper/sites/nationwide_com/favicon.ico"
    }
  },
  'communitysavings_bank': {
    clientId: 'osp-m2m-communitysavings',
    clientSecret: process.env.COMMUNITYSAVINGS_CLIENT_SECRET || '',
    tenant: 'communitysavings',
    responseMapper: genericTransparentMapper,
    chatConfig: {
      enabled: true,
      apiBaseUrl: "https://sensei-agents.australiaeast.cloudapp.azure.com/csb",
      title: "Community Savings Bank Assistant",
      buttonText: "Message Us",
      primaryColor: "#af192a",
      secondaryColor: "#af192a",
      logoUrl: "/scraper/sites/communitysavings_bank/fonts/csb-iowa-logo.svg"
    }
  },
  'peapackprivate_com': {
    clientId: 'osp-m2m-peapackprivate',
    clientSecret: process.env.PEAPACKPRIVATE_CLIENT_SECRET || '',
    tenant: 'peapackprivate',
    responseMapper: genericFlatMapper,
    chatConfig: {
      enabled: true,
      apiBaseUrl: "https://sensei-agents.australiaeast.cloudapp.azure.com/agilent",
      title: "Peapack Private Assistant",
      buttonText: "Message Us",
      primaryColor: "#00426A",
      secondaryColor: "#1F4F82",
      logoUrl: "/sites/peapackprivate_com/images/peapack-favicon.ico" // fallbacks to favicon/logo
    }
  }
};
