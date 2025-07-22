import React from "react";
import styled from "styled-components";
import Message from "./Message";

function MessageList({
  messages,
  user,
  formatTimestamp,
  messagesEndRef,
  onDelete,
  onLike,
}) {
  let lastDate = null;

  return (
    <Container>
      {messages.map((msg) => {
        let dateSeparator = null;

        if (msg.createdAt && typeof msg.createdAt.toDate === "function") {
          const messageDate = msg.createdAt.toDate();
          const currentDate = messageDate.toLocaleDateString();

          if (currentDate !== lastDate) {
            dateSeparator = (
              <DateSeparator>- {currentDate.slice(0, -1)} -</DateSeparator>
            );
            lastDate = currentDate;
          }
        }

        return (
          <React.Fragment key={msg.id}>
            {dateSeparator}
            <Message
              msg={msg}
              isme={msg.uid === user.uid}
              formatTimestamp={formatTimestamp}
              onDelete={onDelete}
              onLike={onLike}
            />
          </React.Fragment>
        );
      })}
      <div ref={messagesEndRef} />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DateSeparator = styled.div`
  padding: 1rem;
  text-align: center;
  margin: 1rem 0;
  color: #777;
  font-size: 0.9rem;
  font-weight: 700;
`;

export default MessageList;
