import { sellerView } from './components/sellerView.js';
import { buyerView } from './components/buyerView.js';
import { marketView } from './components/marketView.js';
import { storage } from './utils/storage.js';
import { mockData } from '../assets/data/mockData.js';
import { geminiApi } from './api/gemini.js';
import { auth, signIn, signOut, onAuthStateChanged, ensureUserProfile, testConnection } from './firebase.js';

class App {
    constructor() {
        this.viewContainer = document.getElementById('view-container');
        this.currentTab = 'seller';
        this.user = null;
        this.isAuthReady = false;
        this.init();
    }

    async init() {
        // Initialize AI
        geminiApi.initialize();
        
        // Test Firestore connection
        testConnection();

        // Listen for auth changes
        onAuthStateChanged(auth, async (user) => {
            this.user = user;
            this.isAuthReady = true;
            
            if (user) {
                await ensureUserProfile(user);
                this.updateAuthUI(true);
            } else {
                this.updateAuthUI(false);
            }
            
            this.renderCurrentView();
        });

        this.setupEventListeners();
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

        const authContainer = document.getElementById('auth-container');
        authContainer.addEventListener('click', async (e) => {
            if (e.target.id === 'btn-login') {
                try {
                    await signIn();
                    this.showToast("Logged in successfully!");
                } catch (error) {
                    this.showToast("Login failed. Please try again.");
                }
            } else if (e.target.id === 'btn-logout') {
                try {
                    await signOut();
                    this.showToast("Logged out successfully!");
                } catch (error) {
                    this.showToast("Logout failed.");
                }
            }
        });
    }

    updateAuthUI(isLoggedIn) {
        const container = document.getElementById('auth-container');
        if (isLoggedIn) {
            container.innerHTML = `
                <div class="user-profile">
                    <span class="user-name">${this.user.displayName || 'User'}</span>
                    <button id="btn-logout" class="btn-outline btn-sm">Logout</button>
                </div>
            `;
        } else {
            container.innerHTML = `<button id="btn-login" class="btn-primary btn-sm">Login with Google</button>`;
        }
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

    async renderCurrentView() {
        if (!this.isAuthReady) {
            this.viewContainer.innerHTML = `<div class="text-center py-20"><div class="spinner"></div><p>Loading SokoLink...</p></div>`;
            return;
        }

        if (!this.user) {
            this.viewContainer.innerHTML = `
                <div class="text-center py-20 animate-fade-in">
                    <span class="logo-icon" style="font-size: 4rem;">🛒</span>
                    <h2 class="mt-2">Welcome to SokoLink</h2>
                    <p class="mb-2">Please login to access the marketplace and start matching.</p>
                    <button onclick="window.app.handleLogin()" class="btn-primary">Login with Google</button>
                </div>
            `;
            return;
        }

        try {
            if (this.currentTab === 'seller') {
                sellerView.render(this.viewContainer);
            } else if (this.currentTab === 'buyer') {
                buyerView.render(this.viewContainer);
            } else {
                await marketView.render(this.viewContainer);
            }
        } catch (error) {
            this.renderError(error);
        }
    }

    async handleLogin() {
        try {
            await signIn();
        } catch (error) {
            this.showToast("Login failed.");
        }
    }

    renderError(error) {
        console.error("App Error:", error);
        this.viewContainer.innerHTML = `
            <div class="error-card animate-fade-in">
                <h3>Oops! Something went wrong</h3>
                <p>We encountered an error while loading this view. Our team has been notified.</p>
                <button onclick="window.location.reload()" class="btn-primary mt-2">Reload Application</button>
                <details class="mt-2 text-sm text-muted">
                    <summary>Error Details</summary>
                    <pre>${error.message}</pre>
                </details>
            </div>
        `;
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
