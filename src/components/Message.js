import React, { useState } from 'react';

function Message({ msg, isme, formatTimestamp, onDelete, onLike }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!isme) {
      onLike(msg.id);
    }
  };

  return (
    <div className={`flex flex-col ${isme ? 'items-end' : 'items-start'}`}>
      {!isme && (
        <span className="mb-0.5 text-xs text-gray-600">{msg.displayName}</span>
      )}
      {msg.imageUrl && (
        <img
          src={msg.imageUrl}
          alt=""
          onClick={() => setModalOpen(true)}
          className="mb-2 max-h-[200px] max-w-[200px] cursor-pointer rounded-lg"
        />
      )}
      <div className="flex items-end gap-2">
        {isme ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(msg.id);
              }}
              className="mr-1 cursor-pointer border-none bg-transparent text-xs text-gray-500"
            >
              삭제
            </button>
            <button
              className={`cursor-pointer border-none bg-transparent p-0 text-base leading-none ${
                msg.liked ? 'text-red-500' : 'text-gray-300'
              }`}
            >
              {msg.liked && '❤️'}
            </button>
            <span className="text-xs text-gray-600">
              {formatTimestamp(msg.createdAt)}
            </span>
            <p className="m-0 max-w-full break-words rounded-2xl bg-[#6f42c1] px-4 py-2 text-white">
              {msg.text}
            </p>
          </>
        ) : (
          <>
            <p
              className="m-0 max-w-full break-words rounded-2xl bg-white px-4 py-2 text-gray-800"
              onClick={handleLikeClick}
            >
              {msg.text}
            </p>
            <span className="text-xs text-gray-600">
              {formatTimestamp(msg.createdAt)}
            </span>
            <button
              className={`cursor-pointer border-none bg-transparent p-0 text-base leading-none ${
                msg.liked ? 'text-red-500' : 'text-gray-300'
              }`}
            >
              {msg.liked && '❤️'}
            </button>
          </>
        )}
      </div>
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setModalOpen(false)}
        >
          <img src={msg.imageUrl} className="max-h-[90%] max-w-[90%]" alt="" />
        </div>
      )}
    </div>
  );
}

export default Message;
