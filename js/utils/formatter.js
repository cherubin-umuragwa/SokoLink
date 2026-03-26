import { config } from '../config.js';

export const formatter = {
    formatCurrency(amount, currencyCode) {
        const currency = config.currencies[currencyCode] || { symbol: currencyCode };
        return `${currency.symbol} ${Number(amount).toLocaleString()}`;
    },

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    truncateText(text, length = 100) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },

    generateWhatsAppLink(phone, message) {
        // Remove non-numeric characters
        const cleanPhone = phone.replace(/\D/g, '');
        const encodedMessage = encodeURIComponent(message);
        return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    }
};
