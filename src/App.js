import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";
import { getToken } from "firebase/messaging";
import { db, auth, messaging } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { listenForMessages } from "./firebaseMessaging";

function AppContent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listenForMessages((payload) => {
      console.log("Foreground message received:", payload);
    });
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser?.displayName) {
          navigate("/chat");
        } else {
          navigate("/");
        }

        // ✅ FCM 토큰 요청 with serviceWorkerRegistration
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            const registration = await navigator.serviceWorker.register(
              "/firebase-messaging-sw.js"
            );
            if (!registration) {
              console.warn("Service worker registration not found.");
              setLoading(false);
              return;
            }
            await navigator.serviceWorker.ready;

            const currentToken = await getToken(messaging, {
              vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
              serviceWorkerRegistration: registration, // ✅ 필수!
            });

            if (currentToken) {
              console.log("✅ FCM Token:", currentToken);
              await setDoc(doc(db, "fcmTokens", user.uid), {
                token: currentToken,
              });
            } else {
              console.warn("🚫 FCM 토큰이 생성되지 않았습니다.");
            }
          } else {
            console.warn("Notification permission not granted.");
          }
        } catch (err) {
          console.error("🚨 FCM 설정 실패:", err);
        }
      } else {
        navigate("/");
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  if (loading) {
    return null;
  }

  return (
    <Container>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Container>
  );
}

function App() {
  return (
    <>
      <GlobalStyle />
      <Router>
        <AppContent />
      </Router>
    </>
  );
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f5f5f5;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default App;
