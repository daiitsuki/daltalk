// 이 파일은 public 폴더에 위치해야 합니다.
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js"
);

// .env 파일이나 다른 방법을 통해 환경 변수를 설정해야 합니다.
const firebaseConfig = {
  apiKey: "__FIREBASE_API_KEY__",
  authDomain: "talktalk-ac3fa.firebaseapp.com",
  projectId: "talktalk-ac3fa",
  storageBucket: "talktalk-ac3fa.firebasestorage.app",
  messagingSenderId: "955645840810",
  appId: "1:955645840810:web:89a722cdea7df27f076fd3",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png", // 원하는 아이콘으로 변경
    data: {
      url: payload.notification.click_action || "/", // 기본값은 홈페이지
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 시 사이트로 이동
self.addEventListener("notificationclick", function (event) {
  event.notification.close(); // 알림 닫기

  const clickUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === clickUrl && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(clickUrl);
        }
      })
  );
});
