export const validation = {
    validateSellerForm(data) {
        const errors = [];
        if (!data.productName || data.productName.trim().length < 2) errors.push("Product name is too short");
        if (!data.category) errors.push("Please select a category");
        if (!data.quantity || data.quantity <= 0) errors.push("Quantity must be greater than 0");
        if (!data.price || data.price <= 0) errors.push("Price must be greater than 0");
        if (!data.phone || data.phone.length < 9) errors.push("Valid phone number is required");
        if (!data.location) errors.push("Location is required");
        return { isValid: errors.length === 0, errors };
    },

    validateBuyerForm(data) {
        const errors = [];
        if (!data.productNeeded || data.productNeeded.trim().length < 2) errors.push("Product name is too short");
        if (!data.category) errors.push("Please select a category");
        if (!data.quantity || data.quantity <= 0) errors.push("Quantity must be greater than 0");
        if (!data.location) errors.push("Location is required");
        if (!data.phone || data.phone.length < 9) errors.push("Valid phone number is required");
        return { isValid: errors.length === 0, errors };
    },

    sanitizeInput(input) {
        if (typeof input !== 'string') return input;
        return input.replace(/[<>]/g, '');
    }
};
