import React, { useState, useEffect } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import io from 'socket.io-client';
import { AsyncStorage } from '@react-native-async-storage/async-storage';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const socket = io('http://your-backend-server/ws'); // Replace with your backend server URL

  useEffect(() => {
    // Fetch initial messages from the server if needed
    fetchInitialMessages();

    // Establish WebSocket connection
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    // Listen for incoming messages
    socket.on('/topic/messages', (message) => {
      const incomingMessage = {
        _id: message.id,
        text: message.content,
        createdAt: new Date(message.timestamp),
        user: {
          _id: message.senderId,
          name: message.senderName,
        },
      };
      setMessages((previousMessages) => GiftedChat.append(previousMessages, incomingMessage));
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchInitialMessages = async () => {
    try {
      const response = await fetch('http://192.168.1.8:8080/chat/messages', {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem('jwt')}`,
        },
      });
      const data = await response.json();
      const initialMessages = data.map((msg) => ({
        _id: msg.id,
        text: msg.content,
        createdAt: new Date(msg.timestamp),
        user: {
          _id: msg.senderId,
          name: msg.senderName,
        },
      }));
      setMessages(initialMessages);
    } catch (error) {
      console.error('Error fetching initial messages:', error);
    }
  };

  const onSend = async (newMessages = []) => {
    const message = newMessages[0];
    socket.emit('/app/chat', {
      senderId: 52, // Replace with the actual sender ID
      senderName: 'v1', // Replace with the actual sender name
      content: message.text,
      timestamp: new Date(),
    });
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: 53, // Replace with the actual user ID
        name: 's1', // Replace with the actual user name
      }}
    />
  );
};

export default ChatScreen;
