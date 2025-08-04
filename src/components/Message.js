import React, { useState } from 'react';

const ImageAttachment = ({ src, onOpen }) => (
  <img
    src={src}
    alt=""
    onClick={onOpen}
    className="mb-2 max-h-96 w-auto cursor-pointer rounded-lg"
  />
);

const ImageModal = ({ src, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
    onClick={onClose}
  >
    <img src={src} className="max-h-[90%] max-w-[90%]" alt="" />
  </div>
);

const MessageBubble = ({ text, isMe, onLike }) => (
  <p
    className={`m-0 max-w-full break-words rounded-2xl px-4 py-2 ${
      isMe ? 'bg-[#6f42c1] text-white' : 'cursor-pointer bg-white text-gray-800'
    }`}
    onClick={!isMe ? onLike : undefined}
  >
    {text}
  </p>
);

const MessageMeta = ({
  isMe,
  msg,
  formatTimestamp,
  onDelete,
  shouldShowTimestamp,
}) => (
  <div
    className={`flex items-end gap-1 text-gray-500 ${isMe ? 'flex-row-reverse' : ''}`}
  >
    {isMe && (
      <button
        onClick={() => onDelete(msg.id)}
        className="mr-1 cursor-pointer border-none bg-transparent text-gray-500"
      >
        삭제
      </button>
    )}
    <button
      className={`cursor-pointer border-none bg-transparent p-0 text-base leading-none ${
        msg.liked ? 'text-red-500' : 'text-gray-300'
      }`}
    >
      {msg.liked && '❤️'}
    </button>
    {shouldShowTimestamp && (
      <span className="text-gray-600">
        {formatTimestamp(msg.createdAt)}
      </span>
    )}
  </div>
);

const Message = ({
  msg,
  isme,
  formatTimestamp,
  onDelete,
  onLike,
  shouldShowTimestamp,
  shouldShowDisplayName,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleLikeClick = () => {
    if (!isme) {
      onLike(msg.id);
    }
  };

  return (
    <div className={`flex flex-col ${isme ? 'items-end' : 'items-start'}`}>
      {!isme && shouldShowDisplayName && (
        <span className="mb-0.5 text-gray-600">{msg.displayName}</span>
      )}
      {msg.imageUrl && (
        <ImageAttachment src={msg.imageUrl} onOpen={() => setModalOpen(true)} />
      )}
      <div className={`flex items-end gap-2 ${isme ? 'flex-row-reverse' : ''}`}>
        <MessageBubble text={msg.text} isMe={isme} onLike={handleLikeClick} />
        <MessageMeta
          isMe={isme}
          msg={msg}
          formatTimestamp={formatTimestamp}
          onDelete={onDelete}
          shouldShowTimestamp={shouldShowTimestamp}
        />
      </div>
      {modalOpen && (
        <ImageModal src={msg.imageUrl} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};

export default Message;
