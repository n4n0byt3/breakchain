import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import {
  getFirestore
} from 'firebase/firestore';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAgzqy6QMS05SlVY8Cm5Nz4d_LYS1QDS1M",
  authDomain: "breakchain-2aade.firebaseapp.com",
  projectId: "breakchain-2aade",
  storageBucket: "breakchain-2aade.firebasestorage.app", // ✅ Correct bucket format
  messagingSenderId: "922901937224",
  appId: "1:922901937224:web:52ab210cbb56fae59fec7d"
};

// Prevent re-initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// ✅ Use `initializeFirestore` with fetch transport
const db = getFirestore(app);

const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, db, storage };
