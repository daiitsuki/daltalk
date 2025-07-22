import React from 'react';
import Message from './Message';

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
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
      {messages.map((msg) => {
        let dateSeparator = null;

        if (msg.createdAt && typeof msg.createdAt.toDate === 'function') {
          const messageDate = msg.createdAt.toDate();
          const currentDate = messageDate.toLocaleDateString();

          if (currentDate !== lastDate) {
            dateSeparator = (
              <div className="my-4 p-4 text-center text-sm font-bold text-gray-600">
                - {currentDate.slice(0, -1)} -
              </div>
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
    </div>
  );
}

export default MessageList;
