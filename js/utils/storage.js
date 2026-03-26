import { db, auth, handleFirestoreError, OperationType } from '../firebase.js';
import { collection, addDoc, getDocs, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

export const storage = {
    async saveListing(listing) {
        if (!auth.currentUser) throw new Error('User must be authenticated to save listings');
        
        const path = 'listings';
        try {
            await addDoc(collection(db, path), {
                sellerId: auth.currentUser.uid,
                sellerName: auth.currentUser.displayName || 'Anonymous',
                ...listing,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, path);
        }
    },

    async getListings() {
        const path = 'listings';
        try {
            const q = query(collection(db, path), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            handleFirestoreError(error, OperationType.LIST, path);
        }
    },

    async saveRequest(request) {
        if (!auth.currentUser) throw new Error('User must be authenticated to save requests');

        const path = 'requests';
        try {
            await addDoc(collection(db, path), {
                buyerId: auth.currentUser.uid,
                buyerName: auth.currentUser.displayName || 'Anonymous',
                ...request,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            handleFirestoreError(error, OperationType.CREATE, path);
        }
    },

    async getRequests() {
        const path = 'requests';
        try {
            const q = query(collection(db, path), orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            handleFirestoreError(error, OperationType.LIST, path);
        }
    },

    // Real-time listeners
    onListingsUpdate(callback) {
        const path = 'listings';
        const q = query(collection(db, path), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(listings);
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, path);
        });
    },

    onRequestsUpdate(callback) {
        const path = 'requests';
        const q = query(collection(db, path), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
            const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(requests);
        }, (error) => {
            handleFirestoreError(error, OperationType.LIST, path);
        });
    }
};
