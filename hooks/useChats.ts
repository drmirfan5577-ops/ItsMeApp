// Powered by OnSpace.AI
import { useState, useCallback } from 'react';
import { mockChats, getMockMessages, Chat, Message } from '@/services/mockData';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(c =>
    c.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const markAsRead = useCallback((chatId: string) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
  }, []);

  return { chats: filteredChats, searchQuery, setSearchQuery, markAsRead };
}

export function useChatMessages(chatId: string) {
  const [messages, setMessages] = useState<Message[]>(getMockMessages(chatId));
  const [inputText, setInputText] = useState('');

  const sendMediaMessage = useCallback((mediaUrl: string, mediaType: 'image' | 'video') => {
    const newMsg: Message = {
      id: `m${Date.now()}`,
      chatId,
      text: '',
      mediaUrl,
      mediaType,
      timestamp: new Date().toISOString(),
      isOwn: true,
      status: 'sent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);

    // Simulate reply
    setTimeout(() => {
      const reply: Message = {
        id: `m${Date.now() + 1}`,
        chatId,
        text: '😍 Nice!',
        timestamp: new Date().toISOString(),
        isOwn: false,
        status: 'delivered',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  }, [chatId]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      chatId,
      text: text.trim(),
      timestamp: new Date().toISOString(),
      isOwn: true,
      status: 'sent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Simulate reply after 1.5s
    setTimeout(() => {
      const replies = [
        'Got it! 👍',
        'Sounds good!',
        'Okay, sure!',
        'Let me check and get back to you',
        '😊',
        'That makes sense!',
      ];
      const reply: Message = {
        id: `m${Date.now() + 1}`,
        chatId,
        text: replies[Math.floor(Math.random() * replies.length)],
        timestamp: new Date().toISOString(),
        isOwn: false,
        status: 'delivered',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  }, [chatId]);

  return { messages, inputText, setInputText, sendMessage, sendMediaMessage };
}
