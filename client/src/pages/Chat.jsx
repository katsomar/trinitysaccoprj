import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Chat = ({ groupId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch chat messages
        axios.get(`/api/chat/${groupId}`)
            .then(response => setMessages(response.data.messages))
            .catch(error => {
                console.error('Error fetching messages:', error);
                setError('Failed to load messages. Please try again later.');
            });
    }, [groupId]);

    const sendMessage = () => {
        if (!newMessage.trim()) {
            alert('Message cannot be empty.');
            return;
        }

        axios.post('/api/chat/send', { groupId, message: newMessage })
            .then(response => {
                setMessages([...messages, response.data.message]);
                setNewMessage('');
            })
            .catch(error => {
                console.error('Error sending message:', error);
                setError('Failed to send message. Please try again.');
            });
    };

    return (
        <div className="chat">
            <h1>Group Chat</h1>
            {error && <p className="error">{error}</p>}
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.sender_name}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="send-message">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
