import { useState, useEffect } from 'react';
import { Client, IMessage } from 'iframe-pubsub';
import React from 'react';

// ⭐️⭐️⭐️ Step 1: Define you page id, should be the same one returned by your callback API
const pageId = 'calendar';

export default function App() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [targetPageId, setTargetPageId] = useState('');

  // ⭐️⭐️⭐️ Step 2: Register your page with Bookipi web
  const [client] = useState(() => new Client(pageId));

  useEffect(() => {
    // ⭐️⭐️⭐️ Step 3: Listen for message from Bookipi web/AIChat
    // message.payload is the returned action from callback API
    client.onMessage((message: IMessage) => {
      console.info("Received message:", message)
      setMessages(prev => [...prev, message]);
    });
  }, [client]);

  const handleSendMessage = () => {
    if (!messageText || !targetPageId) return;
    
    // ⭐️⭐️⭐️ Step 4: Send message to another page e.g. aichat
    // To tell to User that the action is being processed
    client.sendMessage(targetPageId, messageText);
    
    setMessages(prev => [...prev, {
      from: pageId,
      to: targetPageId,
      payload: messageText
    }]);
    
    setMessageText('');
  };

  return (
    <div>
      <h2>Sub Page {pageId}</h2>
      <div>
        <input
          placeholder="Target Page ID"
          value={targetPageId}
          onChange={(e) => setTargetPageId(e.target.value)}
        />
        <input
          placeholder="Message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <h3>Messages:</h3>
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.from === pageId ? 'Sent to' : 'From'} {msg.from === pageId ? msg.to : msg.from}: {JSON.stringify(msg.payload)}
          </div>
        ))}
      </div>
    </div>
  );
}
