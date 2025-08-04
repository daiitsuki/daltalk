import { useState, useEffect, useRef } from 'react';
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
import { supabase } from '../supabase';
import { uploadImage } from './uploadimg';

export const useMessages = (user) => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const messagesRef = useRef([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, 'messages'),
      orderBy('createdAt'),
      limitToLast(150),
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

  const handleSendMessage = async (newMessage, selectedFile) => {
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
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    const msgToDelete = messages.find((msg) => msg.id === id);
    if (!msgToDelete) return;

    const confirmDelete = window.confirm('메시지를 지울까요?');
    if (!confirmDelete) return;

    try {
      if (msgToDelete.imageUrl) {
        const bucketName = 'chat-imgs';
        const url = new URL(msgToDelete.imageUrl);
        const pathSegments = url.pathname.split('/');
        const bucketIndex = pathSegments.findIndex(
          (segment) => segment === bucketName,
        );

        if (bucketIndex > -1 && bucketIndex < pathSegments.length - 1) {
          const filePath = pathSegments.slice(bucketIndex + 1).join('/');
          const { error: storageError } = await supabase.storage
            .from(bucketName)
            .remove([filePath]);

          if (storageError) {
            throw new Error(`이미지 삭제 실패: ${storageError.message}`);
          }
        }
      }

      await deleteDoc(doc(db, 'messages', id));
    } catch (error) {
      console.error('메시지 삭제 오류:', error);
      alert(error.message);
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

  return {
    messages,
    messagesEndRef,
    handleSendMessage,
    handleDelete,
    handleLike,
  };
};
