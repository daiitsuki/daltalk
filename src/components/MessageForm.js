import React, { useRef, useState } from 'react';
import { SlPicture } from 'react-icons/sl';

function MessageForm({ newMessage, setNewMessage, handleSendMessage }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCancelImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleIconClick = () => {
    if(fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    setIsSending(true);
    try {
      await handleSendMessage(selectedFile);
      setSelectedFile(null);
      setPreviewUrl(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 bg-white p-4">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={isSending}
      ></input>
      <div className="relative">
        <button
          type="button"
          onClick={handleIconClick}
          className={`flex cursor-pointer items-center rounded border-none bg-[#6f42c1] p-3 text-base text-white ${
            isSending ? 'cursor-not-allowed opacity-50' : ''
          }`}
          disabled={isSending}
        >
          <SlPicture size={24} />
        </button>
        {previewUrl && (
          <div className="absolute bottom-full left-12 z-10 mb-4 inline-block w-32 -translate-x-1/2 rounded-lg bg-white p-2 shadow-lg after:absolute after:left-1/2 after:top-full after:-translate-x-1/2 after:border-8 after:border-solid after:border-white after:border-b-transparent after:border-l-transparent after:border-r-transparent after:border-t-white after:content-['']">
            <img src={previewUrl} alt="Preview" className="max-h-48 rounded" />
            <button
              type="button"
              onClick={handleCancelImage}
              className="absolute right-1 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border-none bg-black bg-opacity-50 text-xs text-white"
            >
              X
            </button>
          </div>
        )}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="메시지를 입력하세요..."
        className="flex-1 rounded border border-gray-300 p-3 text-base min-w-0"
        disabled={isSending}
      />
      <button
        type="submit"
        className={`cursor-pointer rounded border-none bg-[#6f42c1] p-3 px-5 text-base text-white ${
          isSending ? 'cursor-not-allowed opacity-50' : ''
        }`}
        disabled={isSending}
      >
        {isSending ? '전송 중...' : '전송'}
      </button>
    </form>
  );
}

export default MessageForm;
