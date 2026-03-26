import { config } from '../config.js';
import { validation } from '../utils/validation.js';
import { storage } from '../utils/storage.js';
import { VoiceInput } from './voiceInput.js';
import { geminiApi } from '../api/gemini.js';
import { matchesView } from './matches.js';

export const buyerView = {
    render(container) {
        container.innerHTML = `
            <div class="animate-fade-in">
                <h2>Find Suppliers</h2>
                <p class="mb-1">Tell us what you need, and our AI will find the best matches.</p>
                
                <div class="voice-input-container">
                    <button id="buyer-voice-btn" class="voice-btn" title="Speak your request">🎤</button>
                    <span id="voice-status-buyer" class="text-muted">Speak your request (e.g. "I need 100kg of onions in Nairobi")</span>
                </div>

                <form id="buyer-form">
                    <div class="form-grid">
                        <div>
                            <label>Product Needed</label>
                            <input type="text" id="productNeeded" placeholder="e.g. White Maize" required>
                        </div>
                        <div>
                            <label>Category</label>
                            <select id="category-buyer" required>
                                <option value="">Select Category</option>
                                ${config.categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-grid">
                        <div>
                            <label>Quantity Needed</label>
                            <input type="number" id="quantity-buyer" placeholder="e.g. 100" required>
                        </div>
                        <div>
                            <label>Max Budget (Optional)</label>
                            <input type="number" id="budget" placeholder="e.g. 5000">
                        </div>
                    </div>

                    <div class="form-grid">
                        <div>
                            <label>Location</label>
                            <select id="location-buyer" required>
                                <option value="">Select Location</option>
                                ${config.locations.map(l => `<option value="${l}">${l}</option>`).join('')}
                            </select>
                        </div>
                        <div>
                            <label>WhatsApp Phone Number</label>
                            <input type="tel" id="phone-buyer" placeholder="e.g. 254712345678" required>
                        </div>
                    </div>

                    <div class="form-grid">
                        <div>
                            <label>Urgency</label>
                            <select id="urgency">
                                <option value="Normal">Normal</option>
                                <option value="High">High (Needed ASAP)</option>
                                <option value="Low">Low (Planning ahead)</option>
                            </select>
                        </div>
                        <div style="display: flex; align-items: flex-end;">
                            <button type="submit" id="search-btn" class="btn-secondary w-full">Find Best Matches</button>
                        </div>
                    </div>
                </form>
            </div>
        `;

        this.setupEventListeners();
    },

    setupEventListeners() {
        const form = document.getElementById('buyer-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSearch();
        });

        const voiceBtn = document.getElementById('buyer-voice-btn');
        const voiceStatus = document.getElementById('voice-status-buyer');
        
        const voice = new VoiceInput(
            (transcript) => {
                voiceBtn.classList.remove('listening');
                voiceStatus.textContent = "Processing: " + transcript;
                this.processVoiceTranscript(transcript);
            },
            (error) => {
                voiceBtn.classList.remove('listening');
                voiceStatus.textContent = "Error: " + error;
            }
        );

        voiceBtn.addEventListener('click', () => {
            if (voice.isListening) {
                voice.stop();
                voiceBtn.classList.remove('listening');
            } else {
                voice.start();
                voiceBtn.classList.add('listening');
                voiceStatus.textContent = "Listening... speak now";
            }
        });
    },

    processVoiceTranscript(text) {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('onion')) document.getElementById('productNeeded').value = "Onions";
        if (lowerText.includes('tomato')) document.getElementById('productNeeded').value = "Tomatoes";
        if (lowerText.includes('maize')) document.getElementById('productNeeded').value = "Maize";
        
        const numbers = text.match(/\d+/g);
        if (numbers && numbers.length > 0) {
            document.getElementById('quantity-buyer').value = numbers[0];
        }
    },

    async handleSearch() {
        const searchBtn = document.getElementById('search-btn');
        const originalText = searchBtn.textContent;
        
        const data = {
            productNeeded: document.getElementById('productNeeded').value,
            category: document.getElementById('category-buyer').value,
            quantity: parseFloat(document.getElementById('quantity-buyer').value),
            budget: parseFloat(document.getElementById('budget').value) || 0,
            currency: "KES", // Default
            location: document.getElementById('location-buyer').value,
            phone: document.getElementById('phone-buyer').value,
            urgency: document.getElementById('urgency').value
        };

        const validationResult = validation.validateBuyerForm(data);
        if (!validationResult.isValid) {
            window.app.showToast(validationResult.errors[0]);
            return;
        }

        searchBtn.disabled = true;
        searchBtn.innerHTML = `<div class="spinner" style="margin:0; width:20px; height:20px; display:inline-block; vertical-align:middle; margin-right:10px;"></div> Finding Matches...`;

        try {
            const sellerListings = await storage.getListings();
            const aiMatches = await geminiApi.findMatches(sellerListings, data);
            
            // Enrich AI matches with full seller data
            const enrichedMatches = aiMatches.map(match => {
                const seller = sellerListings.find(s => s.id === match.sellerId);
                return { ...match, seller };
            }).filter(m => m.seller);

            matchesView.render(enrichedMatches);
            
            // Show insights
            const insight = await geminiApi.generateMarketInsight(data.location, data.category);
            this.showInsights(insight);

            window.app.showToast(`Found ${enrichedMatches.length} matches!`);
        } catch (error) {
            window.app.showToast("Error finding matches. Please try again.");
            console.error(error);
        } finally {
            searchBtn.disabled = false;
            searchBtn.textContent = originalText;
        }
    },

    showInsights(text) {
        const container = document.getElementById('insights-container');
        const content = document.getElementById('insights-content');
        container.classList.remove('hidden');
        content.innerHTML = `<p>💡 <strong>AI Market Tip:</strong> ${text}</p>`;
    }
};
