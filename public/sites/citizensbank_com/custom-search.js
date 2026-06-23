document.addEventListener('click', (e) => {
    // Check if the clicked element is a button or link (or inside one)
    const interactable = e.target.closest('button, a, input[type="submit"]');
    if (interactable) {
        // Allow the search buttons (desktop and mobile forms)
        if (interactable.closest('#dcom-desktop-search-form') || interactable.closest('#dcom-mobile-search-form')) {
            return;
        }
        // Allow search result links
        if (interactable.closest('#answers-container')) {
            return;
        }
        // Block everything else
        e.preventDefault();
        e.stopPropagation();
        console.log('Click blocked to focus on search functionality.');
    }
}, true);

(function() {
    const answersContainer = document.getElementById('answers-container');
    if (!answersContainer) {
        console.error('answers-container not found!');
        return;
    }

    // Inject our own static search bar because we removed the answers.js script that originally rendered it!
    answersContainer.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto; padding: 40px 20px;">
            <form id="custom-static-search-form" style="display: flex; gap: 10px; margin-bottom: 30px;">
                <input type="text" id="custom-static-search-input" placeholder="How can we help you?" style="flex: 1; padding: 15px; font-size: 16px; border: 1px solid #ccc; border-radius: 4px;">
                <button type="submit" class="js-yext-submit" style="padding: 15px 30px; font-size: 16px; background: #00885e; color: white; border: none; border-radius: 4px; cursor: pointer;">Search</button>
            </form>
            <div id="custom-static-search-results"></div>
        </div>
    `;

    const customForm = document.getElementById('custom-static-search-form');
    const customInput = document.getElementById('custom-static-search-input');
    const resultsContainer = document.getElementById('custom-static-search-results');

    const handleSearch = async (query) => {
        console.log('Static search triggered for:', query);
        resultsContainer.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #00885e; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <div style="margin-top: 15px; font-size: 16px; color: #666;">Loading search results...</div>
                <style>
                    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                </style>
            </div>
        `;

        try {
            // Call our Next.js mock API route
            const apiUrl = window.location.origin + `/scraper/api/mock-search/citizensbank_com/v2/answers/search?query=${encodeURIComponent(query)}`;
            const res = await fetch(apiUrl);
            const data = await res.json();
            
            const modules = data?.response?.modules || [];
            let resultsHtml = '';

            modules.forEach(module => {
                if (module.results && module.results.length > 0) {
                    module.results.forEach(result => {
                        const item = result.data;
                        resultsHtml += `
                            <div class="HitchhikerResultsStandard-Card" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 4px; background: white;">
                                <h3 style="margin-top:0; font-size: 18px; font-weight: bold;">
                                    <a class="HitchhikerProductProminentImage-titleLink" href="${item.landingPageUrl}" target="_top" style="color: #00885e; text-decoration: none;">
                                        ${item.name}
                                    </a>
                                </h3>
                                <p style="color: #333; margin-bottom: 0; line-height: 1.5;">${item.s_snippet || item.body || ''}</p>
                            </div>
                        `;
                    });
                }
            });

            if (resultsHtml === '') {
                resultsHtml = '<div style="padding:20px;">No results found.</div>';
            }

            resultsContainer.innerHTML = `
                <h2 style="font-size: 24px; margin-bottom: 20px;">Search Results</h2>
                ${resultsHtml}
            `;

        } catch (err) {
            console.error('Search failed:', err);
            resultsContainer.innerHTML = '<div style="padding:20px;color:red;">Error fetching search results.</div>';
        }
    };

    customForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSearch(customInput.value);
    });

    // Also attach to header forms if they exist and are visible
    const desktopForm = document.getElementById('dcom-desktop-search-form');
    const desktopInput = document.getElementById('dcom-desktop_search-query');
    if (desktopForm && desktopInput) {
        desktopForm.addEventListener('submit', (e) => {
            e.preventDefault();
            customInput.value = desktopInput.value;
            handleSearch(desktopInput.value);
        });
    }
})();
