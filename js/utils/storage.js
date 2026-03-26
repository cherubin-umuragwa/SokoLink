import { config } from '../config.js';

export const storage = {
    saveListing(listing) {
        const listings = this.getListings();
        listings.unshift({
            id: Date.now(),
            date: new Date().toISOString(),
            ...listing
        });
        localStorage.setItem(config.storageKeys.sellerListings, JSON.stringify(listings));
    },

    getListings() {
        const data = localStorage.getItem(config.storageKeys.sellerListings);
        return data ? JSON.parse(data) : [];
    },

    saveRequest(request) {
        const requests = this.getRequests();
        requests.unshift({
            id: Date.now(),
            date: new Date().toISOString(),
            ...request
        });
        localStorage.setItem(config.storageKeys.buyerRequests, JSON.stringify(requests));
    },

    getRequests() {
        const data = localStorage.getItem(config.storageKeys.buyerRequests);
        return data ? JSON.parse(data) : [];
    },

    saveMatches(matches) {
        localStorage.setItem(config.storageKeys.matches, JSON.stringify(matches));
    },

    getMatches() {
        const data = localStorage.getItem(config.storageKeys.matches);
        return data ? JSON.parse(data) : [];
    },

    clearData() {
        localStorage.removeItem(config.storageKeys.sellerListings);
        localStorage.removeItem(config.storageKeys.buyerRequests);
        localStorage.removeItem(config.storageKeys.matches);
    }
};
