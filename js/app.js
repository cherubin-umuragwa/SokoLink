import { sellerView } from './components/sellerView.js';
import { buyerView } from './components/buyerView.js';
import { marketView } from './components/marketView.js';
import { storage } from './utils/storage.js';
import { mockData } from '../assets/data/mockData.js';
import { geminiApi } from './api/gemini.js';

class App {
    constructor() {
        this.viewContainer = document.getElementById('view-container');
        this.currentTab = 'seller';
        this.init();
    }

    init() {
        // Initialize AI
        geminiApi.initialize();

        // Load mock data if empty
        if (storage.getListings().length === 0) {
            mockData.sellers.forEach(s => storage.saveListing(s));
        }
        if (storage.getRequests().length === 0) {
            mockData.requests.forEach(r => storage.saveRequest(r));
        }

        this.setupEventListeners();
        this.renderCurrentView();
    }

    setupEventListeners() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        document.getElementById('nav-home').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchTab('seller');
        });
    }

    switchTab(tab) {
        if (this.currentTab === tab) return;
        
        this.currentTab = tab;
        
        // Update UI
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
        });

        // Hide matches when switching
        document.getElementById('matches-container').classList.add('hidden');
        document.getElementById('insights-container').classList.add('hidden');

        this.renderCurrentView();
    }

    renderCurrentView() {
        if (this.currentTab === 'seller') {
            sellerView.render(this.viewContainer);
        } else if (this.currentTab === 'buyer') {
            buyerView.render(this.viewContainer);
        } else {
            marketView.render(this.viewContainer);
        }
    }

    showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Global app instance
window.app = new App();
