import React, { useState } from 'react';
import { useAuth } from '../utils/useAuth';
import { useMessages } from '../utils/useMessages';
import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';
import { FaUserEdit } from 'react-icons/fa';
import FontSwitcher from '../components/FontSwitcher';

const formatTimestamp = (timestamp) => {
  if (!timestamp?.toDate) return '';
  const date = timestamp.toDate();
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

const ChatHeader = ({ onNicknameChange }) => (
  <header className="flex items-center justify-between bg-[#6f42c1] p-4 text-white">
    <h1 className="m-0 text-lg font-semibold">달톡 - dalTalk!</h1>
    <div className="flex items-center gap-x-1">
      <button
        onClick={onNicknameChange}
        title="프로필 변경"
        className="flex cursor-pointer items-center justify-center rounded border-none bg-transparent px-4 py-2 text-sm text-white"
      >
        <FaUserEdit className="hover:scale-105" size={24} />
      </button>
      <FontSwitcher />
    </div>
  </header>
);

function ChatPage() {
  const { user, handleChangeNickname } = useAuth();
  const { 
    messages, 
    messagesEndRef, 
    handleSendMessage, 
    handleDelete, 
    handleLike 
  } = useMessages(user);
  
  const [newMessage, setNewMessage] = useState('');

  const onSendMessage = async (selectedFile) => {
    await handleSendMessage(newMessage, selectedFile);
    setNewMessage('');
  };

  if (!user?.uid) return null; // Render nothing until user is authenticated

  return (
    <div className="flex h-screen w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-[#f0e6ff] shadow-md">
      <ChatHeader onNicknameChange={handleChangeNickname} />
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
        handleSendMessage={onSendMessage}
      />
    </div>
  );
}

export default ChatPage;
