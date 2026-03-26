export const mockData = {
    sellers: [
        {
            productName: "Fresh Red Onions",
            category: "Vegetables",
            quantity: 500,
            unit: "kg",
            price: 85,
            currency: "KES",
            location: "Nairobi, Kenya",
            phone: "254700000001",
            description: "Farm fresh red onions, harvested yesterday. Large size.",
            date: new Date(Date.now() - 86400000).toISOString()
        },
        {
            productName: "Grade A Maize",
            category: "Grains",
            quantity: 20,
            unit: "bags",
            price: 3200,
            currency: "KES",
            location: "Nairobi, Kenya",
            phone: "254700000002",
            description: "Dry white maize, moisture content below 13%.",
            date: new Date(Date.now() - 172800000).toISOString()
        },
        {
            productName: "Sweet Bananas",
            category: "Fruits",
            quantity: 10,
            unit: "crates",
            price: 1500,
            currency: "UGX",
            location: "Kampala, Uganda",
            phone: "256700000003",
            description: "Bogoya bananas, ripe and ready for market.",
            date: new Date(Date.now() - 43200000).toISOString()
        },
        {
            productName: "Handwoven Baskets",
            category: "Crafts",
            quantity: 50,
            unit: "pcs",
            price: 12000,
            currency: "TZS",
            location: "Dar es Salaam, Tanzania",
            phone: "255700000004",
            description: "Traditional Iringa baskets, various patterns.",
            date: new Date(Date.now() - 259200000).toISOString()
        }
    ],
    requests: [
        {
            productNeeded: "Bulk Potatoes",
            category: "Vegetables",
            quantity: 200,
            budget: 15000,
            currency: "KES",
            location: "Nairobi, Kenya",
            phone: "254711111111",
            urgency: "High",
            date: new Date(Date.now() - 3600000).toISOString()
        },
        {
            productNeeded: "Rice (Basmati)",
            category: "Grains",
            quantity: 10,
            budget: 0,
            currency: "TZS",
            location: "Dar es Salaam, Tanzania",
            phone: "255722222222",
            urgency: "Normal",
            date: new Date(Date.now() - 7200000).toISOString()
        }
    ]
};
