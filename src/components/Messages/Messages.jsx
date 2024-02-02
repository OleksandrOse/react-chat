import { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import './Messages.css';

export const Messages = ({ socket, userName }) => {
  const [messagesRecieved, setMessagesReceived] = useState([]);
  const messagesColumnRef = useRef(null);

  useEffect(() => {
    socket.on('receive_message', (data) => {
      setMessagesReceived((state) => [
        ...state,
        {
          message: data.message,
          userName: data.userName,
          createdtime: data.createdtime,
        },
      ]);
    });

    socket.on('last_messages', (lastMessages) => {

      lastMessages = sortMessagesByDate(lastMessages);
      setMessagesReceived((state) => [...lastMessages, ...state]);
    });

    return () => {
      socket.off('receive_message');
      socket.off('last_messages');
    }
  }, [socket]);

  useEffect(() => {
    if(messagesColumnRef !== null) {
      messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    }
  }, [messagesRecieved]);

  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  function sortMessagesByDate(messages) {
    return messages.sort(
      (a, b) => parseInt(a.createdtime) - parseInt(b.createdtime)
    );
  }

  return (
    <div className="messages-column" ref={messagesColumnRef}>
      {messagesRecieved.map((message, i) => (
        <div
          className={cn(
            "message",
            { 'message-mine': message.userName === userName }
          )}
          key={i}
        >
          <div className="message-container">
            <span className="message-meta">{message.userName}</span>
            <span className="message-meta">
              {formatDateFromTimestamp(message.createdtime)}
            </span>
          </div>
          <p className="message-text">{message.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};
