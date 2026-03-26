import { formatter } from '../utils/formatter.js';

export const matchesView = {
    render(matches) {
        const container = document.getElementById('matches-container');
        const list = document.getElementById('matches-list');
        
        container.classList.remove('hidden');
        
        if (matches.length === 0) {
            list.innerHTML = `<p class="col-span-full text-center py-10">No matches found for your criteria yet. Try adjusting your search or check back later.</p>`;
            return;
        }

        // Sort by relevance score
        matches.sort((a, b) => b.relevanceScore - a.relevanceScore);

        list.innerHTML = matches.map(match => this.createMatchCard(match)).join('');
    },

    createMatchCard(match) {
        const { seller, relevanceScore, matchReason, suggestedPrice } = match;
        const whatsappMsg = `Hi ${seller.productName} seller, I saw your listing on SokoLink and I'm interested in buying.`;
        const whatsappLink = formatter.generateWhatsAppLink(seller.phone, whatsappMsg);

        return `
            <div class="match-card animate-fade-in">
                <div class="match-header">
                    <span class="relevance-badge">${relevanceScore}% Match</span>
                    <span class="text-muted text-sm">${formatter.formatDate(seller.date)}</span>
                </div>
                <div class="match-body">
                    <h4 class="text-lg font-bold">${seller.productName}</h4>
                    <p class="text-sm text-muted mb-2">📍 ${seller.location}</p>
                    <div class="flex justify-between mb-2">
                        <span class="font-bold text-green-600">${formatter.formatCurrency(seller.price, seller.currency)} / ${seller.unit}</span>
                        <span class="text-sm">Stock: ${seller.quantity} ${seller.unit}</span>
                    </div>
                    <p class="text-sm italic mb-2">" ${formatter.truncateText(seller.description || 'No description provided', 60)} "</p>
                    <div class="bg-gray-50 p-2 rounded text-xs border-l-4 border-gold">
                        <strong>AI Reason:</strong> ${matchReason}
                    </div>
                </div>
                <div class="match-footer">
                    <a href="${whatsappLink}" target="_blank" class="btn-secondary w-full block text-center no-underline" style="text-decoration:none; display:block;">
                        Contact via WhatsApp
                    </a>
                </div>
            </div>
        `;
    }
};
