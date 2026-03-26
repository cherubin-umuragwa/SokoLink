import { storage } from '../utils/storage.js';
import { formatter } from '../utils/formatter.js';

export const marketView = {
    async render(container) {
        container.innerHTML = `
            <div class="animate-fade-in">
                <h2>Market Overview</h2>
                <p class="mb-2">See what's currently available and what buyers are looking for.</p>
                <div id="market-loading" class="text-center py-10">
                    <div class="spinner"></div>
                    <p>Loading marketplace data...</p>
                </div>
                <div id="market-container" class="hidden">
                    <div class="market-toggle mb-2">
                        <button id="show-listings" class="btn-toggle active">Available Products</button>
                        <button id="show-requests" class="btn-toggle">Buyer Requests</button>
                    </div>
                    <div id="market-content"></div>
                </div>
            </div>
        `;

        const listings = await storage.getListings();
        const requests = await storage.getRequests();
        
        document.getElementById('market-loading').classList.add('hidden');
        document.getElementById('market-container').classList.remove('hidden');
        
        this.currentView = 'listings';
        this.listings = listings;
        this.requests = requests;
        
        this.updateContent();
        this.setupEventListeners();
        this.setupRealtimeListeners();
    },

    setupEventListeners() {
        const listingsBtn = document.getElementById('show-listings');
        const requestsBtn = document.getElementById('show-requests');

        listingsBtn.addEventListener('click', () => {
            this.currentView = 'listings';
            listingsBtn.classList.add('active');
            requestsBtn.classList.remove('active');
            this.updateContent();
        });

        requestsBtn.addEventListener('click', () => {
            this.currentView = 'requests';
            requestsBtn.classList.add('active');
            listingsBtn.classList.remove('active');
            this.updateContent();
        });
    },

    setupRealtimeListeners() {
        // Unsubscribe from previous listeners if any
        if (this.unsubscribeListings) this.unsubscribeListings();
        if (this.unsubscribeRequests) this.unsubscribeRequests();

        this.unsubscribeListings = storage.onListingsUpdate((listings) => {
            this.listings = listings;
            document.getElementById('show-listings').textContent = `Available Products (${listings.length})`;
            if (this.currentView === 'listings') this.updateContent();
        });

        this.unsubscribeRequests = storage.onRequestsUpdate((requests) => {
            this.requests = requests;
            document.getElementById('show-requests').textContent = `Buyer Requests (${requests.length})`;
            if (this.currentView === 'requests') this.updateContent();
        });
    },

    updateContent() {
        const content = document.getElementById('market-content');
        if (this.currentView === 'listings') {
            content.innerHTML = this.renderListings(this.listings);
        } else {
            content.innerHTML = this.renderRequests(this.requests);
        }
    },

    renderListings(listings) {
        if (listings.length === 0) return `<p class="text-center py-10">No products listed yet.</p>`;
        
        return `
            <div class="matches-grid">
                ${listings.map(item => `
                    <div class="match-card">
                        <div class="match-header">
                            <span class="relevance-badge bg-green">Seller</span>
                            <span class="text-muted text-sm">${formatter.formatDate(item.createdAt)}</span>
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
                            <a href="${formatter.generateWhatsAppLink(item.whatsapp, 'Hi, I saw your ' + item.productName + ' on SokoLink.')}" target="_blank" class="btn-secondary w-full block text-center no-underline" style="text-decoration:none; display:block;">
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
                ${requests.map(item => {
                    const whatsappMsg = `Hi, I saw your request for ${item.productName} on SokoLink. I can supply this to you.`;
                    const whatsappLink = formatter.generateWhatsAppLink(item.whatsapp || '254700000000', whatsappMsg);
                    
                    return `
                        <div class="match-card" style="border-top-color: var(--orange);">
                            <div class="match-header">
                                <span class="relevance-badge" style="background-color: var(--orange); color: white;">Buyer</span>
                                <span class="text-muted text-sm">${formatter.formatDate(item.createdAt)}</span>
                            </div>
                            <div class="match-body">
                                <h4 class="text-lg font-bold">${item.productName}</h4>
                                <p class="text-sm text-muted mb-2">📍 ${item.location}</p>
                                <div class="flex justify-between mb-2">
                                    <span class="font-bold text-orange-600">${item.quantity} units needed</span>
                                    <span class="text-sm">Urgency: ${item.urgency}</span>
                                </div>
                                <p class="text-sm">Budget: ${item.budget > 0 ? formatter.formatCurrency(item.budget, item.currency) : 'Negotiable'}</p>
                            </div>
                            <div class="match-footer">
                                <a href="${whatsappLink}" target="_blank" class="btn-primary w-full block text-center no-underline" style="text-decoration:none; display:block;">
                                    I can supply this
                                </a>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
};
