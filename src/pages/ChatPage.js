import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  deleteDoc,
  updateDoc,
  limitToLast,
} from "firebase/firestore";
import { db } from "../firebase";
import MessageList from "../components/MessageList";
import { uploadImage } from "../utils/uploadimg";
import MessageForm from "../components/MessageForm";
// import { UnifiedComponent } from "stipop-react-sdk";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  const messagesEndRef = useRef(null);
  const messagesRef = useRef([]);

  // 사용자 없을 때 차단
  useEffect(() => {
    if (!user?.uid) {
      navigate("/");
    }
  }, [user, navigate]);

  // messagesRef 동기화
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // 실시간 메시지 수신
  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "messages"),
      orderBy("createdAt"),
      limitToLast(100)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedMsgs = [...messagesRef.current];

      querySnapshot.docChanges().forEach((change) => {
        const msgData = { id: change.doc.id, ...change.doc.data() };

        if (change.type === "added") {
          if (!updatedMsgs.some((msg) => msg.id === msgData.id)) {
            updatedMsgs.push(msgData);
          }
        } else if (change.type === "modified") {
          const idx = updatedMsgs.findIndex((m) => m.id === msgData.id);
          if (idx > -1) updatedMsgs[idx] = msgData;
        } else if (change.type === "removed") {
          const idx = updatedMsgs.findIndex((m) => m.id === msgData.id);
          if (idx > -1) updatedMsgs.splice(idx, 1);
        }
      });

      // createdAt 없는 메시지 임시 시간 부여 후 정렬
      const sortedMsgs = updatedMsgs
        .map((msg) => ({
          ...msg,
          createdAt: msg.createdAt ?? { toMillis: () => 0 },
        }))
        .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());

      setMessages(sortedMsgs);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (selectedFile) => {
    if (newMessage.trim() === "" && !selectedFile) return;

    const { uid, displayName } = user;
    let imageUrl = null;

    try {
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      await addDoc(collection(db, "messages"), {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid,
        displayName,
        imageUrl,
      });

      await fetch("/api/sendNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderUid: uid,
          senderName: displayName,
          messageText: newMessage,
        }),
      });

      setNewMessage("");
    } catch (error) {
      console.error("메시지 전송 오류:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "messages", id));
    } catch (error) {
      console.error("메시지 삭제 오류:", error);
    }
  };

  const handleLike = async (id) => {
    const msgRef = doc(db, "messages", id);
    const msg = messages.find((m) => m.id === id);
    try {
      await updateDoc(msgRef, {
        liked: !msg.liked,
      });
    } catch (error) {
      console.error("Error liking message:", error);
    }
  };

  const handleChangeNickname = () => {
    const newNickname = prompt(
      "새로운 프로필 명을 입력하세요.",
      `${user.displayName}`
    );
    if (newNickname && newNickname.trim() !== "") {
      const updatedUser = { ...user, displayName: newNickname };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert("프로필 명이 변경되었습니다.");
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp?.toDate) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!user?.uid) return null;

  return (
    <ChatContainer>
      <Header>
        <Title>달톡 - dalTalk!</Title>

        <ChangeNicknameButton onClick={handleChangeNickname}>
          프로필 변경
        </ChangeNicknameButton>
      </Header>
      <MessageList
        messages={messages}
        user={user}
        formatTimestamp={formatTimestamp}
        messagesEndRef={messagesEndRef}
        onDelete={handleDelete}
        onLike={handleLike}
      />
      <MessageForm
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
      />
      {/* <UnifiedComponent
        params={{
          apikey: "dc7dbcc8165c1ab077c4bd15dc3b105b",
          userId: `${user.uid}`,
          lang: "ko",
          countryCode: "KR",
          pageNumber: 1,
          limit: 20,
        }}
        stickerClick={(info) => console.log(info)} // {url, stickerId, packageId}
        storeClick={(e) => e.preventDefault} //true
        store={false}
        mainLanguage={"ko"}
      /> */}
    </ChatContainer>
  );
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  max-width: 800px;
  background-color: #f0e6ff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #6f42c1;
  color: white;
`;

const Title = styled.h1`
  font-size: 1.2rem;
  margin: 0;
  font-weight: 600;
`;

const ChangeNicknameButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  color: #6f42c1;
  background-color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default ChatPage;
