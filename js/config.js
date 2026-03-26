export const config = {
    gemini: {
        model: "gemini-1.5-flash-latest",
        temperature: 0.7,
        maxTokens: 1000,
    },
    currencies: {
        KES: { symbol: "KSh", name: "Kenyan Shilling" },
        TZS: { symbol: "TSh", name: "Tanzanian Shilling" },
        UGX: { symbol: "USh", name: "Ugandan Shilling" }
    },
    locations: ["Nairobi, Kenya", "Mombasa, Kenya", "Dar es Salaam, Tanzania", "Arusha, Tanzania", "Kampala, Uganda", "Entebbe, Uganda"],
    categories: ["Vegetables", "Fruits", "Grains", "Textiles", "Crafts", "Livestock", "Other"],
    storageKeys: {
        sellerListings: "sokolink_seller_listings",
        buyerRequests: "sokolink_buyer_requests",
        matches: "sokolink_matches_history"
    }
};
