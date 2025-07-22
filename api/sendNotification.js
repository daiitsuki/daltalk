const admin = require("firebase-admin");

// Vercel 환경 변수에서 서비스 계정 키를 가져옵니다.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

// Firebase Admin SDK 초기화
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { senderUid, senderName, messageText } = req.body;

  try {
    // 모든 사용자의 FCM 토큰을 가져옵니다.
    const tokensSnapshot = await db.collection("fcmTokens").get();
    const tokens = [];
    tokensSnapshot.forEach((doc) => {
      // 메시지를 보낸 사람은 제외합니다.
      if (doc.id !== senderUid) {
        tokens.push(doc.data().token);
      }
    });

    if (tokens.length === 0) {
      return res.status(200).send("No other users to notify.");
    }

    // 푸시 알림 메시지 구성
    const message = {
      notification: {
        title: `${senderName}님이 메시지를 보냈습니다`,
        body: messageText,
      },
      tokens: tokens,
    };

    // 메시지 전송
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log("Successfully sent message:", response);

    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
