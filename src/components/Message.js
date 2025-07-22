import React, { useState } from "react";
import styled from "styled-components";

function Message({ msg, isme, formatTimestamp, onDelete, onLike }) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (!isme) {
      onLike(msg.id);
    }
  };

  return (
    <MessageContainer isme={isme}>
      {!isme && <Nickname>{msg.displayName}</Nickname>}
      {msg.imageUrl && (
        <MessageImage
          src={msg.imageUrl}
          alt="message image"
          onClick={() => setModalOpen(true)}
        />
      )}
      <TextContainer>
        {isme ? (
          <>
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                onDelete(msg.id);
              }}
            >
              삭제
            </DeleteButton>
            <LikeButton liked={msg.liked}>{msg.liked && "❤️"}</LikeButton>
            <Timestamp>{formatTimestamp(msg.createdAt)}</Timestamp>
            <Text isme={isme}>{msg.text}</Text>
          </>
        ) : (
          <>
            <Text isme={isme} onClick={handleLikeClick}>
              {msg.text}
            </Text>
            <Timestamp>{formatTimestamp(msg.createdAt)}</Timestamp>
            <LikeButton liked={msg.liked}>{msg.liked && "❤️"}</LikeButton>
          </>
        )}
      </TextContainer>
      {modalOpen && (
        <Modal onClick={() => setModalOpen(false)}>
          <ModalContent src={msg.imageUrl} />
        </Modal>
      )}
    </MessageContainer>
  );
}

const MessageImage = styled.img`
  max-width: 200px;
  max-height: 200px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 0.5rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.img`
  max-width: 90%;
  max-height: 90%;
`;

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.isme ? "flex-end" : "flex-start")};
`;

const Nickname = styled.span`
  font-size: 0.8rem;
  color: #555;
  margin-bottom: 0.2rem;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 0.7rem;
  margin-right: 5px;
`;

const Text = styled.p`
  margin: 0;
  padding: 0.7rem 1rem;
  background-color: ${(props) => (props.isme ? "#6f42c1" : "#ffffff")};
  color: ${(props) => (props.isme ? "white" : "#333")};
  border-radius: 15px;
  max-width: 100%;
  word-break: break-word;
`;

const Timestamp = styled.span`
  font-size: 0.7rem;
  color: #888;
`;

const LikeButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: ${(props) => (props.liked ? "#ff4b5c" : "#ccc")};
  padding: 0;
  line-height: 1;
`;

export default Message;
