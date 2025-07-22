import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getMessaging } from "firebase/messaging"; // ✅ 추가

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "talktalk-ac3fa.firebaseapp.com",
  projectId: "talktalk-ac3fa",
  storageBucket: "talktalk-ac3fa.firebasestorage.app",
  messagingSenderId: "955645840810",
  appId: "1:955645840810:web:89a722cdea7df27f076fd3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

const messaging = getMessaging(app); // ✅ 여기서만 생성

export { auth, db, messaging };
