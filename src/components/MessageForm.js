import React, { useRef, useState } from "react";
import styled from "styled-components";
import { SlPicture } from "react-icons/sl";

function MessageForm({ newMessage, setNewMessage, handleSendMessage }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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
    fileInputRef.current.value = null;
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(selectedFile);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <ImageInput
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleChange}
      ></ImageInput>
      <ImageUploadContainer>
        <IMGBtn type="button" onClick={handleIconClick}>
          <SlPicture size={24} />
        </IMGBtn>
        {previewUrl && (
          <PreviewWrapper>
            <PreviewImage src={previewUrl} alt="Preview" />
            <CancelButton type="button" onClick={handleCancelImage}>
              X
            </CancelButton>
          </PreviewWrapper>
        )}
      </ImageUploadContainer>
      <MessageInput
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="메시지를 입력하세요..."
      />
      <SendButton type="submit">전송</SendButton>
    </StyledForm>
  );
}

const ImageUploadContainer = styled.div`
  position: relative;
`;

const PreviewImage = styled.img`
  max-height: 6rem;
  width: auto;
  border-radius: 5px;
`;

const PreviewWrapper = styled.div`
  position: absolute;
  bottom: 100%;
  left: 100%;
  transform: translateX(-50%);
  margin-bottom: 15px;
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: inline-block;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 8px;
    border-style: solid;
    border-color: #fff transparent transparent transparent;
  }
`;

const CancelButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const StyledForm = styled.form`
  display: flex;
  column-gap: 0.5rem;
  padding: 1rem;
  background-color: #ffffff;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const SendButton = styled.button`
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  color: #ffffff;
  background-color: #6f42c1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ImageInput = styled.input`
  display: none;
`;

const IMGBtn = styled.button`
  display: flex;
  align-items: center;
  padding: 0.8rem 1.2rem;
  font-size: 1rem;
  color: #ffffff;
  background-color: #6f42c1;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default MessageForm;
