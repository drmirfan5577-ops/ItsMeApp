// Powered by OnSpace.AI
export interface Contact {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastSeen: string;
  about: string;
}

export interface Message {
  id: string;
  chatId: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  timestamp: string;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
  time: string;
}

export interface Chat {
  id: string;
  contact: Contact;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
}

export interface StatusUpdate {
  id: string;
  contact: Contact;
  updates: { id: string; image: string; time: string; viewed: boolean }[];
  hasNew: boolean;
}

export interface CallRecord {
  id: string;
  contact: Contact;
  type: 'incoming' | 'outgoing' | 'missed';
  callType: 'voice' | 'video';
  timestamp: string;
  duration: string;
}

export const mockContacts: Contact[] = [
  { id: '1', name: 'Ahmed Khan', avatar: 'https://i.pravatar.cc/150?img=11', online: true, lastSeen: 'online', about: 'Available' },
  { id: '2', name: 'Sara Ali', avatar: 'https://i.pravatar.cc/150?img=20', online: false, lastSeen: 'Last seen today at 11:30 AM', about: 'Busy' },
  { id: '3', name: 'Family Group 👨‍👩‍👧', avatar: 'https://i.pravatar.cc/150?img=68', online: false, lastSeen: '', about: 'Family Group' },
  { id: '4', name: 'Zara Malik', avatar: 'https://i.pravatar.cc/150?img=47', online: true, lastSeen: 'online', about: 'At the gym 💪' },
  { id: '5', name: 'Work Team', avatar: 'https://i.pravatar.cc/150?img=62', online: false, lastSeen: '', about: 'Work Group' },
  { id: '6', name: 'Omar Sheikh', avatar: 'https://i.pravatar.cc/150?img=15', online: false, lastSeen: 'Last seen yesterday', about: 'Do not disturb' },
];

export const mockChats: Chat[] = [
  {
    id: '1',
    contact: mockContacts[0],
    lastMessage: 'Hey! Are you free this evening?',
    lastMessageTime: '10:42 AM',
    unreadCount: 3,
    isPinned: true,
    isMuted: false,
  },
  {
    id: '2',
    contact: mockContacts[2],
    lastMessage: 'Mom: Dinner at 8 PM everyone! 🍽️',
    lastMessageTime: '9:15 AM',
    unreadCount: 7,
    isPinned: true,
    isMuted: false,
  },
  {
    id: '3',
    contact: mockContacts[1],
    lastMessage: 'Thanks so much for your help yesterday!',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
  },
  {
    id: '4',
    contact: mockContacts[3],
    lastMessage: 'Just finished my workout 🏋️‍♀️',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    isPinned: false,
    isMuted: true,
  },
  {
    id: '5',
    contact: mockContacts[4],
    lastMessage: 'Meeting rescheduled to 3 PM',
    lastMessageTime: 'Monday',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
  },
  {
    id: '6',
    contact: mockContacts[5],
    lastMessage: 'See you soon!',
    lastMessageTime: 'Sunday',
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
  },
];

export const getMockMessages = (chatId: string): Message[] => {
  const conversations: Record<string, Message[]> = {
    '1': [
      { id: 'm1', chatId: '1', text: 'Hey! How are you doing?', timestamp: '2026-07-05T09:00:00', isOwn: false, status: 'read', time: '9:00 AM' },
      { id: 'm2', chatId: '1', text: "I'm doing great, thanks for asking! 😊", timestamp: '2026-07-05T09:02:00', isOwn: true, status: 'read', time: '9:02 AM' },
      { id: 'm3', chatId: '1', text: 'That is awesome! Did you see the game last night?', timestamp: '2026-07-05T09:05:00', isOwn: false, status: 'read', time: '9:05 AM' },
      { id: 'm4', chatId: '1', text: 'Yes!! It was incredible! That last goal was insane 🔥', timestamp: '2026-07-05T09:07:00', isOwn: true, status: 'read', time: '9:07 AM' },
      { id: 'm5', chatId: '1', text: 'Right?! Best game of the season for sure', timestamp: '2026-07-05T10:30:00', isOwn: false, status: 'read', time: '10:30 AM' },
      { id: 'm6', chatId: '1', text: 'Hey! Are you free this evening?', timestamp: '2026-07-05T10:42:00', isOwn: false, status: 'delivered', time: '10:42 AM' },
    ],
    '2': [
      { id: 'm1', chatId: '2', text: 'Good morning everyone! ☀️', timestamp: '2026-07-05T08:00:00', isOwn: false, status: 'read', time: '8:00 AM' },
      { id: 'm2', chatId: '2', text: 'Good morning! 🌟', timestamp: '2026-07-05T08:05:00', isOwn: true, status: 'read', time: '8:05 AM' },
      { id: 'm3', chatId: '2', text: 'Has anyone seen my keys?? 😅', timestamp: '2026-07-05T08:45:00', isOwn: false, status: 'read', time: '8:45 AM' },
      { id: 'm4', chatId: '2', text: 'Check the kitchen counter!', timestamp: '2026-07-05T09:00:00', isOwn: true, status: 'read', time: '9:00 AM' },
      { id: 'm5', chatId: '2', text: 'Dinner at 8 PM everyone! 🍽️', timestamp: '2026-07-05T09:15:00', isOwn: false, status: 'delivered', time: '9:15 AM' },
    ],
    '3': [
      { id: 'm1', chatId: '3', text: 'Hi! Is the report ready?', timestamp: '2026-07-04T14:00:00', isOwn: true, status: 'read', time: '2:00 PM' },
      { id: 'm2', chatId: '3', text: 'Yes! Sending it over now', timestamp: '2026-07-04T14:10:00', isOwn: false, status: 'read', time: '2:10 PM' },
      { id: 'm3', chatId: '3', text: 'Got it, thank you so much!', timestamp: '2026-07-04T14:15:00', isOwn: true, status: 'read', time: '2:15 PM' },
      { id: 'm4', chatId: '3', text: 'Thanks so much for your help yesterday!', timestamp: '2026-07-04T18:30:00', isOwn: false, status: 'read', time: '6:30 PM' },
    ],
  };
  return conversations[chatId] || [
    { id: 'default1', chatId, text: 'Hey there!', timestamp: '2026-07-05T10:00:00', isOwn: false, status: 'read', time: '10:00 AM' },
    { id: 'default2', chatId, text: 'Hi! How can I help?', timestamp: '2026-07-05T10:01:00', isOwn: true, status: 'read', time: '10:01 AM' },
  ];
};

export const mockStatusUpdates: StatusUpdate[] = [
  {
    id: 's1',
    contact: mockContacts[0],
    updates: [
      { id: 'u1', image: 'https://picsum.photos/400/700?random=1', time: '10:30 AM', viewed: false },
      { id: 'u2', image: 'https://picsum.photos/400/700?random=2', time: '11:00 AM', viewed: false },
    ],
    hasNew: true,
  },
  {
    id: 's2',
    contact: mockContacts[3],
    updates: [
      { id: 'u3', image: 'https://picsum.photos/400/700?random=3', time: '9:15 AM', viewed: false },
    ],
    hasNew: true,
  },
  {
    id: 's3',
    contact: mockContacts[1],
    updates: [
      { id: 'u4', image: 'https://picsum.photos/400/700?random=4', time: 'Yesterday', viewed: true },
    ],
    hasNew: false,
  },
];

export const mockCalls: CallRecord[] = [
  { id: 'c1', contact: mockContacts[0], type: 'incoming', callType: 'voice', timestamp: 'Today, 10:30 AM', duration: '5:23' },
  { id: 'c2', contact: mockContacts[3], type: 'outgoing', callType: 'video', timestamp: 'Today, 9:00 AM', duration: '12:45' },
  { id: 'c3', contact: mockContacts[1], type: 'missed', callType: 'voice', timestamp: 'Yesterday, 8:30 PM', duration: '' },
  { id: 'c4', contact: mockContacts[5], type: 'outgoing', callType: 'voice', timestamp: 'Yesterday, 3:00 PM', duration: '2:10' },
  { id: 'c5', contact: mockContacts[0], type: 'incoming', callType: 'video', timestamp: 'Monday, 7:00 PM', duration: '30:00' },
];
