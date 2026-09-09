// Powered by OnSpace.AI
import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/ui/Avatar';
import { useChats } from '@/hooks/useChats';
import { Chat } from '@/services/mockData';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

export default function ChatListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { chats, searchQuery, setSearchQuery, markAsRead } = useChats();

  const handleChatPress = useCallback((chat: Chat) => {
    markAsRead(chat.id);
    router.push(`/chat/${chat.id}?name=${encodeURIComponent(chat.contact.name)}&avatar=${encodeURIComponent(chat.contact.avatar)}&online=${chat.contact.online}`);
  }, [markAsRead, router]);

  const renderChat = useCallback(({ item }: { item: Chat }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.75}
    >
      <Avatar uri={item.contact.avatar} size={54} showOnline online={item.contact.online} />

      <View style={styles.chatContent}>
        <View style={styles.chatTop}>
          <View style={styles.nameRow}>
            {item.isPinned && <Ionicons name="pin" size={13} color={Colors.textMuted} style={{ marginRight: 4 }} />}
            <Text style={styles.chatName} numberOfLines={1}>{item.contact.name}</Text>
          </View>
          <Text style={[styles.time, item.unreadCount > 0 && styles.timeUnread]}>{item.lastMessageTime}</Text>
        </View>
        <View style={styles.chatBottom}>
          <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMessage}</Text>
          <View style={styles.badges}>
            {item.isMuted && <Ionicons name="volume-mute" size={14} color={Colors.textMuted} style={{ marginRight: 4 }} />}
            {item.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount > 99 ? '99+' : item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ), [handleChatPress]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{"It's Me"}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="ellipsis-vertical" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search chats..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="chatbubbles-outline" size={60} color={Colors.border} />
            <Text style={styles.emptyText}>No chats found</Text>
            <Text style={styles.emptySubtext}>Start a new conversation</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.sep} />}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="chatbubble-ellipses" size={26} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    backgroundColor: Colors.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: Colors.white },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { marginLeft: Spacing.md, padding: 4 },
  searchWrap: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.headerBg },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: FontSize.sm, color: Colors.text },
  chatItem: { flexDirection: 'row', paddingHorizontal: Spacing.md, paddingVertical: 10, alignItems: 'center' },
  chatContent: { flex: 1, marginLeft: 12 },
  chatTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  chatName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, flex: 1 },
  time: { fontSize: FontSize.xs, color: Colors.textMuted },
  timeUnread: { color: Colors.primary, fontWeight: '600' },
  chatBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMsg: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, marginRight: 8 },
  badges: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  badgeText: { color: Colors.white, fontSize: 11, fontWeight: '700' },
  sep: { height: 1, backgroundColor: Colors.border, marginLeft: 82 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyText: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textSecondary },
  emptySubtext: { fontSize: FontSize.sm, color: Colors.textMuted },
  fab: {
    position: 'absolute',
    bottom: 88,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});
