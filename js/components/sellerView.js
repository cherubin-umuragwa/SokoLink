import { config } from '../config.js';
import { validation } from '../utils/validation.js';
import { storage } from '../utils/storage.js';
import { VoiceInput } from './voiceInput.js';

export const sellerView = {
    render(container) {
        container.innerHTML = `
            <div class="animate-fade-in">
                <h2>List Your Products</h2>
                <p class="mb-1">Fill in the details of what you are selling today.</p>
                
                <div class="voice-input-container">
                    <button id="seller-voice-btn" class="voice-btn" title="Speak your listing">🎤</button>
                    <span id="voice-status" class="text-muted">Click mic to speak details (English/Swahili)</span>
                </div>

                <form id="seller-form">
                    <div class="form-grid">
                        <div>
                            <label>Product Name</label>
                            <input type="text" id="productName" placeholder="e.g. Red Onions, Grade A" required>
                        </div>
                        <div>
                            <label>Category</label>
                            <select id="category" required>
                                <option value="">Select Category</option>
                                ${config.categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                            </select>
                        </div>
                    </div>

                    <div class="form-grid">
                        <div>
                            <label>Quantity</label>
                            <input type="number" id="quantity" placeholder="e.g. 50" required>
                        </div>
                        <div>
                            <label>Unit</label>
                            <input type="text" id="unit" placeholder="e.g. kg, bags, crates" required>
                        </div>
                    </div>

                    <div class="form-grid">
                        <div>
                            <label>Price per Unit</label>
                            <input type="number" id="price" placeholder="e.g. 120" required>
                        </div>
                        <div>
                            <label>Currency</label>
                            <select id="currency">
                                <option value="KES">KES (Kenya)</option>
                                <option value="TZS">TZS (Tanzania)</option>
                                <option value="UGX">UGX (Uganda)</option>
                            </select>
                        </div>
                    </div>

                    <label>Location</label>
                    <select id="location" required>
                        <option value="">Select Location</option>
                        ${config.locations.map(l => `<option value="${l}">${l}</option>`).join('')}
                    </select>

                    <label>WhatsApp Phone Number</label>
                    <input type="tel" id="phone" placeholder="e.g. 254712345678" required>

                    <label>Description (Optional)</label>
                    <textarea id="description" rows="3" placeholder="Describe quality, harvest date, etc."></textarea>

                    <button type="submit" class="btn-primary w-full">Post Listing</button>
                </form>
            </div>
        `;

        this.setupEventListeners();
    },

    setupEventListeners() {
        const form = document.getElementById('seller-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });

        const voiceBtn = document.getElementById('seller-voice-btn');
        const voiceStatus = document.getElementById('voice-status');
        
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
        // Simple heuristic parsing for demo
        // In production, this would be sent to Gemini for structured extraction
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('onion')) document.getElementById('productName').value = "Onions";
        if (lowerText.includes('tomato')) document.getElementById('productName').value = "Tomatoes";
        if (lowerText.includes('maize')) document.getElementById('productName').value = "Maize";
        
        // Try to find numbers for quantity/price
        const numbers = text.match(/\d+/g);
        if (numbers && numbers.length > 0) {
            document.getElementById('quantity').value = numbers[0];
            if (numbers[1]) document.getElementById('price').value = numbers[1];
        }

        document.getElementById('description').value = text;
    },

    handleSubmit() {
        const data = {
            productName: document.getElementById('productName').value,
            category: document.getElementById('category').value,
            quantity: parseFloat(document.getElementById('quantity').value),
            unit: document.getElementById('unit').value,
            price: parseFloat(document.getElementById('price').value),
            currency: document.getElementById('currency').value,
            location: document.getElementById('location').value,
            phone: document.getElementById('phone').value,
            description: document.getElementById('description').value
        };

        const validationResult = validation.validateSellerForm(data);
        if (!validationResult.isValid) {
            window.app.showToast(validationResult.errors[0]);
            return;
        }

        storage.saveListing(data);
        window.app.showToast("Listing posted successfully!");
        document.getElementById('seller-form').reset();
    }
};
