import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyABRUGli_-fZS6VZU0tIy5b85Z5oHdIvEE",
  authDomain: "schedario-asp.firebaseapp.com",
  projectId: "schedario-asp",
  storageBucket: "schedario-asp.firebasestorage.app",
  messagingSenderId: "835550788859",
  appId: "1:835550788859:web:344ca325a693eac43c845e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
