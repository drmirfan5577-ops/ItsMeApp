// Powered by OnSpace.AI
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/ui/Avatar';
import { useChatMessages } from '@/hooks/useChats';
import { Message } from '@/services/mockData';
import { mediaService } from '@/services/mediaService';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

export default function ChatScreen() {
  const { id, name, avatar, online } = useLocalSearchParams<{
    id: string; name: string; avatar: string; online: string;
  }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const listRef = useRef<FlatList>(null);
  const { messages, inputText, setInputText, sendMessage, sendMediaMessage } = useChatMessages(id || '1');

  const [showAttach, setShowAttach] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: string } | null>(null);

  useEffect(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: false }), 100);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handlePickImage = async () => {
    setShowAttach(false);
    setUploading(true);
    try {
      const result = await mediaService.pickImage();
      if (result) {
        sendMediaMessage(result.url, result.type);
      }
    } finally {
      setUploading(false);
    }
  };

  const handlePickVideo = async () => {
    setShowAttach(false);
    setUploading(true);
    try {
      const result = await mediaService.pickVideo();
      if (result) {
        sendMediaMessage(result.url, result.type);
      }
    } finally {
      setUploading(false);
    }
  };

  const renderMessage = useCallback(({ item }: { item: Message }) => {
    const isMedia = !!(item.mediaUrl);
    return (
      <View style={[styles.msgWrap, item.isOwn ? styles.msgRight : styles.msgLeft]}>
        <View style={[styles.bubble, item.isOwn ? styles.bubbleSent : styles.bubbleReceived, isMedia && styles.bubbleMedia]}>
          {/* Media content */}
          {item.mediaUrl && item.mediaType === 'image' && (
            <TouchableOpacity onPress={() => setPreviewMedia({ url: item.mediaUrl!, type: 'image' })} activeOpacity={0.9}>
              <Image
                source={{ uri: item.mediaUrl }}
                style={styles.mediaImage}
                contentFit="cover"
                transition={200}
              />
            </TouchableOpacity>
          )}
          {item.mediaUrl && item.mediaType === 'video' && (
            <TouchableOpacity
              style={styles.videoPlaceholder}
              onPress={() => setPreviewMedia({ url: item.mediaUrl!, type: 'video' })}
              activeOpacity={0.9}
            >
              <Ionicons name="play-circle" size={48} color={Colors.white} />
              <Text style={styles.videoLabel}>Video</Text>
            </TouchableOpacity>
          )}

          {/* Text content */}
          {item.text ? (
            <Text style={[styles.msgText, item.isOwn ? styles.msgTextSent : styles.msgTextReceived]}>
              {item.text}
            </Text>
          ) : null}

          <View style={styles.msgMeta}>
            <Text style={styles.msgTime}>{item.time}</Text>
            {item.isOwn && (
              <Ionicons
                name={item.status === 'read' ? 'checkmark-done' : item.status === 'delivered' ? 'checkmark-done' : 'checkmark'}
                size={14}
                color={item.status === 'read' ? '#53bdeb' : Colors.textMuted}
                style={{ marginLeft: 3 }}
              />
            )}
          </View>
        </View>
      </View>
    );
  }, []);

  const isOnline = online === 'true';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Avatar uri={decodeURIComponent(avatar || '')} size={38} showOnline online={isOnline} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>{decodeURIComponent(name || 'Chat')}</Text>
          <Text style={styles.headerStatus}>{isOnline ? 'online' : 'tap for info'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="videocam-outline" size={24} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="call-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="ellipsis-vertical" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages + Input */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top + 56}
      >
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />

        {/* Attachment menu */}
        {showAttach && (
          <View style={styles.attachMenu}>
            <TouchableOpacity style={styles.attachOption} onPress={handlePickImage} activeOpacity={0.8}>
              <View style={[styles.attachIcon, { backgroundColor: '#e91e8c' }]}>
                <Ionicons name="image" size={22} color={Colors.white} />
              </View>
              <Text style={styles.attachLabel}>Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachOption} onPress={handlePickVideo} activeOpacity={0.8}>
              <View style={[styles.attachIcon, { backgroundColor: '#e53935' }]}>
                <Ionicons name="videocam" size={22} color={Colors.white} />
              </View>
              <Text style={styles.attachLabel}>Video</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Bar */}
        <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
          <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
            <Ionicons name="happy-outline" size={26} color={Colors.textMuted} />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            placeholder="Message"
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={styles.attachBtn}
            activeOpacity={0.7}
            onPress={() => setShowAttach(v => !v)}
          >
            {uploading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <Ionicons name="attach" size={24} color={showAttach ? Colors.primary : Colors.textMuted} />
            )}
          </TouchableOpacity>
          {inputText.trim().length > 0 ? (
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={() => { sendMessage(inputText); setShowAttach(false); }}
              activeOpacity={0.85}
            >
              <Ionicons name="send" size={20} color={Colors.white} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.sendBtn} activeOpacity={0.85}>
              <Ionicons name="mic" size={22} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Image Preview Modal */}
      <Modal visible={!!previewMedia} transparent animationType="fade" onRequestClose={() => setPreviewMedia(null)}>
        <View style={styles.previewOverlay}>
          <TouchableOpacity style={styles.previewClose} onPress={() => setPreviewMedia(null)}>
            <Ionicons name="close" size={28} color={Colors.white} />
          </TouchableOpacity>
          {previewMedia?.type === 'image' && (
            <Image
              source={{ uri: previewMedia.url }}
              style={styles.previewImage}
              contentFit="contain"
              transition={200}
            />
          )}
          {previewMedia?.type === 'video' && (
            <View style={styles.videoPreviewPlaceholder}>
              <Ionicons name="videocam" size={60} color={Colors.white} />
              <Text style={{ color: Colors.white, marginTop: 12, fontSize: FontSize.md }}>
                Video preview not available
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#ece5dd' },
  header: {
    backgroundColor: Colors.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 8,
  },
  backBtn: { padding: 8 },
  headerInfo: { flex: 1, marginLeft: 8 },
  headerName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white },
  headerStatus: { fontSize: FontSize.xs, color: 'rgba(255,255,255,0.8)' },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 6, marginLeft: 4 },
  messageList: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.sm },
  msgWrap: { marginBottom: 4 },
  msgLeft: { alignItems: 'flex-start' },
  msgRight: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
    borderRadius: Radius.md,
  },
  bubbleMedia: { paddingHorizontal: 4, paddingTop: 4, paddingBottom: 4 },
  bubbleSent: {
    backgroundColor: Colors.sent,
    borderTopRightRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  bubbleReceived: {
    backgroundColor: Colors.received,
    borderTopLeftRadius: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  mediaImage: {
    width: 220,
    height: 180,
    borderRadius: 10,
    marginBottom: 4,
  },
  videoPlaceholder: {
    width: 220,
    height: 140,
    borderRadius: 10,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  videoLabel: { color: Colors.white, fontSize: FontSize.sm, marginTop: 4 },
  msgText: { fontSize: FontSize.md, lineHeight: 22, paddingHorizontal: 2 },
  msgTextSent: { color: Colors.text },
  msgTextReceived: { color: Colors.text },
  msgMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 2, paddingHorizontal: 2 },
  msgTime: { fontSize: 10, color: Colors.textMuted },
  attachMenu: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachOption: { alignItems: 'center', gap: 6 },
  attachIcon: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  attachLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '500' },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    backgroundColor: '#ece5dd',
    gap: 8,
  },
  attachBtn: { padding: 4, alignSelf: 'flex-end', marginBottom: 6 },
  textInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: FontSize.md,
    color: Colors.text,
    maxHeight: 120,
  },
  sendBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  previewOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  previewImage: { width: '100%', height: '80%' },
  videoPreviewPlaceholder: { alignItems: 'center' },
});
