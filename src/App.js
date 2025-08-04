import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { getToken } from 'firebase/messaging';
import { db, auth, messaging } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { listenForMessages } from './firebaseMessaging';

function AppContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedFont = localStorage.getItem('font') || 'sans-serif';
    document.body.style.fontFamily = savedFont;
  }, []);

  useEffect(() => {
    listenForMessages((payload) => {
      console.log('Foreground message received:', payload);
    });
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser?.displayName) {
          navigate('/chat');
        } else {
          navigate('/');
        }

        // ✅ FCM 토큰 요청 with serviceWorkerRegistration
        try {
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            const registration = await navigator.serviceWorker.register(
              '/firebase-messaging-sw.js',
            );
            if (!registration) {
              console.warn('Service worker registration not found.');
              setLoading(false);
              return;
            }
            await navigator.serviceWorker.ready;

            const currentToken = await getToken(messaging, {
              vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
              serviceWorkerRegistration: registration, // ✅ 필수!
            });

            if (currentToken) {
              const docRef = doc(db, 'fcmTokens', user.uid);
              const docSnap = await getDoc(docRef);
              const storedToken = docSnap.exists()
                ? docSnap.data().token
                : null;

              if (storedToken !== currentToken) {
                console.log(
                  '📌 FCM 토큰이 변경되어 Firestore에 업데이트합니다.',
                );
                await setDoc(docRef, { token: currentToken });
              } else {
                console.log('✅ 기존 FCM 토큰과 동일합니다. 업데이트 생략.');
              }
            } else {
              console.warn('🚫 FCM 토큰이 생성되지 않았습니다.');
            }
          } else {
            console.warn('Notification permission not granted.');
          }
        } catch (err) {
          console.error('🚨 FCM 설정 실패:', err);
        }
      } else {
        navigate('/');
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  if (loading) {
    return null;
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
