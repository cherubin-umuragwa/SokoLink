import { GoogleGenAI } from "@google/genai";
import { config } from '../config.js';

let ai = null;

export const geminiApi = {
    initialize() {
        if (!process.env.GEMINI_API_KEY) {
            console.error("Gemini API key is missing. Please configure it in the AI Studio Secrets panel.");
            return false;
        }
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        return true;
    },

    async findMatches(sellerListings, buyerRequest) {
        if (!ai) this.initialize();
        
        const systemPrompt = `You are SokoLink, an AI marketplace matchmaker for East African informal traders. 
        Your job is to match seller listings with buyer requests. 
        Consider location proximity, price alignment, product quality descriptions, and urgency. 
        Return matches ranked by relevance. Be practical and understand local market contexts in Kenya, Tanzania, and Uganda.
        
        Return ONLY a JSON array of objects. Each object should have:
        - sellerId: the ID of the matched listing
        - relevanceScore: 0-100
        - matchReason: a short explanation of why this is a good match
        - suggestedPrice: a recommended price point for negotiation
        `;

        const prompt = `
        BUYER REQUEST:
        Product: ${buyerRequest.productNeeded}
        Category: ${buyerRequest.category}
        Quantity: ${buyerRequest.quantity}
        Budget: ${buyerRequest.budget} ${buyerRequest.currency}
        Location: ${buyerRequest.location}
        Urgency: ${buyerRequest.urgency}
        
        SELLER LISTINGS:
        ${JSON.stringify(sellerListings.map(s => ({
            id: s.id,
            product: s.productName,
            category: s.category,
            quantity: s.quantity,
            unit: s.unit,
            price: s.price,
            currency: s.currency,
            location: s.location,
            description: s.description
        })))}
        `;

        try {
            const response = await ai.models.generateContent({
                model: config.gemini.model,
                contents: [{ parts: [{ text: systemPrompt + "\n\n" + prompt }] }],
                config: {
                    responseMimeType: "application/json"
                }
            });

            const result = JSON.parse(response.text);
            return result;
        } catch (error) {
            console.error("Gemini Matching Error:", error);
            // Fallback: Simple keyword matching if AI fails
            return sellerListings
                .filter(s => s.category === buyerRequest.category)
                .map(s => ({
                    sellerId: s.id,
                    relevanceScore: 70,
                    matchReason: "Category match (AI fallback)",
                    suggestedPrice: s.price
                }));
        }
    },

    async generateMarketInsight(location, category) {
        if (!ai) this.initialize();

        const prompt = `Generate a short market insight (2-3 sentences) for ${category} in ${location}. 
        Mention current demand trends or seasonal factors relevant to East African markets. 
        Keep it practical for a small trader.`;

        try {
            const response = await ai.models.generateContent({
                model: config.gemini.model,
                contents: [{ parts: [{ text: prompt }] }]
            });
            return response.text;
        } catch (error) {
            return "High demand expected for fresh produce this week due to market cycles.";
        }
    }
};
