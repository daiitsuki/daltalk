import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'firebase/firestore';
import { db } from '../firebase';
import MessageList from '../components/MessageList';
import { uploadImage } from '../utils/uploadimg';
import MessageForm from '../components/MessageForm';
// import { UnifiedComponent } from "stipop-react-sdk";

function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const navigate = useNavigate();
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('user')),
  );

  const messagesEndRef = useRef(null);
  const messagesRef = useRef([]);

  // 사용자 없을 때 차단
  useEffect(() => {
    if (!user?.uid) {
      navigate('/');
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
      collection(db, 'messages'),
      orderBy('createdAt'),
      limitToLast(100),
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedMsgs = [...messagesRef.current];

      querySnapshot.docChanges().forEach((change) => {
        const msgData = { id: change.doc.id, ...change.doc.data() };

        if (change.type === 'added') {
          if (!updatedMsgs.some((msg) => msg.id === msgData.id)) {
            updatedMsgs.push(msgData);
          }
        } else if (change.type === 'modified') {
          const idx = updatedMsgs.findIndex((m) => m.id === msgData.id);
          if (idx > -1) updatedMsgs[idx] = msgData;
        } else if (change.type === 'removed') {
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (selectedFile) => {
    if (newMessage.trim() === '' && !selectedFile) return;

    const { uid, displayName } = user;
    let imageUrl = null;

    try {
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid,
        displayName,
        imageUrl,
      });

      await fetch('/api/sendNotification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderUid: uid,
          senderName: displayName,
          messageText: newMessage,
        }),
      });

      setNewMessage('');
    } catch (error) {
      console.error('메시지 전송 오류:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (error) {
      console.error('메시지 삭제 오류:', error);
    }
  };

  const handleLike = async (id) => {
    const msgRef = doc(db, 'messages', id);
    const msg = messages.find((m) => m.id === id);
    try {
      await updateDoc(msgRef, {
        liked: !msg.liked,
      });
    } catch (error) {
      console.error('Error liking message:', error);
    }
  };

  const handleChangeNickname = () => {
    const newNickname = prompt(
      '새로운 프로필 명을 입력하세요.',
      `${user.displayName}`,
    );
    if (newNickname && newNickname.trim() !== '') {
      const updatedUser = { ...user, displayName: newNickname };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      alert('프로필 명이 변경되었습니다.');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp?.toDate) return '';
    const date = timestamp.toDate();
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  if (!user?.uid) return null;

  return (
    <div className="flex h-screen w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-[#f0e6ff] shadow-md">
      <header className="flex items-center justify-between bg-[#6f42c1] p-4 text-white">
        <h1 className="m-0 text-lg font-semibold">달톡 - dalTalk!</h1>
        <button
          onClick={handleChangeNickname}
          className="cursor-pointer rounded border-none bg-white px-4 py-2 text-sm text-[#6f42c1]"
        >
          프로필 변경
        </button>
      </header>
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
    </div>
  );
}

export default ChatPage;
