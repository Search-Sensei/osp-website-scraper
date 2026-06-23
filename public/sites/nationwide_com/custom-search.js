document.addEventListener('click', (e) => {
    // Check if the clicked element is a button or link (or inside one)
    const interactable = e.target.closest('button, a');
    if (interactable) {
        // Allow the search button
        if (interactable.classList.contains('js-yext-submit') || interactable.closest('.js-yext-submit')) {
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

document.addEventListener('DOMContentLoaded', () => {
    const searchForms = document.querySelectorAll('.yxt-SearchBar-form');
    const answersContainer = document.getElementById('answers-container');

    if (answersContainer) {
        searchForms.forEach(searchForm => {
            searchForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                // Find the input within the submitted form
                const searchInput = searchForm.querySelector('.yxt-SearchBar-input');
                const query = searchInput ? searchInput.value : '';
                console.log('Static search triggered for:', query);

                answersContainer.innerHTML = `
                <div style="padding: 40px; text-align: center;">
                    <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #00539b; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                    <div style="margin-top: 15px; font-size: 16px; color: #666;">Loading search results...</div>
                    <style>
                        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    </style>
                </div>
            `;

                try {
                    // Call our Next.js mock API route
                    const res = await fetch(`/scraper/api/mock-search/nationwide_com/v2/answers/search?query=${encodeURIComponent(query)}`);
                    const data = await res.json();
                    
                    // data is now mapped to the Nationwide Yext format by the API!
                    const modules = data?.response?.modules || [];
                    let resultsHtml = '';

                    modules.forEach(module => {
                        if (module.results && module.results.length > 0) {
                            module.results.forEach(result => {
                                const item = result.data;
                                resultsHtml += `
                                    <div class="HitchhikerResultsStandard-Card" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 15px; border-radius: 4px; background: white;">
                                        <h3 style="margin-top:0; font-size: 18px; font-weight: bold;">
                                            <a class="HitchhikerProductProminentImage-titleLink" href="${item.landingPageUrl}" target="_top" style="color: #00529b; text-decoration: none;">
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

                    answersContainer.innerHTML = `
                        <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
                            <h2 style="font-size: 24px; margin-bottom: 20px;">Search Results</h2>
                            ${resultsHtml}
                        </div>
                    `;

                } catch (err) {
                    console.error('Search failed:', err);
                    answersContainer.innerHTML = '<div style="padding:20px;color:red;">Error fetching search results.</div>';
                }
            });
        });
    }
});
