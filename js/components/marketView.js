import { storage } from '../utils/storage.js';
import { formatter } from '../utils/formatter.js';

export const marketView = {
    render(container) {
        const listings = storage.getListings();
        const requests = storage.getRequests();

        container.innerHTML = `
            <div class="animate-fade-in">
                <h2>Market Overview</h2>
                <p class="mb-2">See what's currently available and what buyers are looking for.</p>

                <div class="market-toggle mb-2">
                    <button id="show-listings" class="btn-toggle active">Available Products (${listings.length})</button>
                    <button id="show-requests" class="btn-toggle">Buyer Requests (${requests.length})</button>
                </div>

                <div id="market-content">
                    ${this.renderListings(listings)}
                </div>
            </div>
        `;

        this.setupEventListeners(listings, requests);
    },

    setupEventListeners(listings, requests) {
        const listingsBtn = document.getElementById('show-listings');
        const requestsBtn = document.getElementById('show-requests');
        const content = document.getElementById('market-content');

        listingsBtn.addEventListener('click', () => {
            listingsBtn.classList.add('active');
            requestsBtn.classList.remove('active');
            content.innerHTML = this.renderListings(listings);
        });

        requestsBtn.addEventListener('click', () => {
            requestsBtn.classList.add('active');
            listingsBtn.classList.remove('active');
            content.innerHTML = this.renderRequests(requests);
        });
    },

    renderListings(listings) {
        if (listings.length === 0) return `<p class="text-center py-10">No products listed yet.</p>`;
        
        return `
            <div class="matches-grid">
                ${listings.map(item => `
                    <div class="match-card">
                        <div class="match-header">
                            <span class="relevance-badge bg-green">Seller</span>
                            <span class="text-muted text-sm">${formatter.formatDate(item.date)}</span>
                        </div>
                        <div class="match-body">
                            <h4 class="text-lg font-bold">${item.productName}</h4>
                            <p class="text-sm text-muted mb-2">📍 ${item.location}</p>
                            <div class="flex justify-between mb-2">
                                <span class="font-bold text-green-600">${formatter.formatCurrency(item.price, item.currency)} / ${item.unit}</span>
                                <span class="text-sm">Stock: ${item.quantity} ${item.unit}</span>
                            </div>
                            <p class="text-sm italic">" ${formatter.truncateText(item.description || 'No description', 60)} "</p>
                        </div>
                        <div class="match-footer">
                            <a href="${formatter.generateWhatsAppLink(item.phone, 'Hi, I saw your ' + item.productName + ' on SokoLink.')}" target="_blank" class="btn-secondary w-full block text-center no-underline" style="text-decoration:none; display:block;">
                                Contact Seller
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    renderRequests(requests) {
        if (requests.length === 0) return `<p class="text-center py-10">No buyer requests yet.</p>`;

        return `
            <div class="matches-grid">
                ${requests.map(item => `
                    <div class="match-card" style="border-top-color: var(--orange);">
                        <div class="match-header">
                            <span class="relevance-badge" style="background-color: var(--orange); color: white;">Buyer</span>
                            <span class="text-muted text-sm">${formatter.formatDate(item.date)}</span>
                        </div>
                        <div class="match-body">
                            <h4 class="text-lg font-bold">${item.productNeeded}</h4>
                            <p class="text-sm text-muted mb-2">📍 ${item.location}</p>
                            <div class="flex justify-between mb-2">
                                <span class="font-bold text-orange-600">${item.quantity} units needed</span>
                                <span class="text-sm">Urgency: ${item.urgency}</span>
                            </div>
                            <p class="text-sm">Budget: ${item.budget > 0 ? formatter.formatCurrency(item.budget, item.currency) : 'Negotiable'}</p>
                        </div>
                        <div class="match-footer">
                            <button class="btn-primary w-full" onclick="window.app.switchTab('seller')">I can supply this</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};
