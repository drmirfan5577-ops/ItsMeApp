// Powered by OnSpace.AI
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/ui/Avatar';
import { mockCalls, CallRecord } from '@/services/mockData';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

export default function CallsScreen() {
  const insets = useSafeAreaInsets();

  const renderCall = ({ item }: { item: CallRecord }) => {
    const isMissed = item.type === 'missed';
    const isOutgoing = item.type === 'outgoing';
    const arrowIcon = isOutgoing ? 'arrow-up' : isMissed ? 'arrow-down' : 'arrow-down';
    const arrowColor = isMissed ? Colors.danger : isOutgoing ? Colors.primary : Colors.unread;

    return (
      <TouchableOpacity style={styles.callItem} activeOpacity={0.75}>
        <Avatar uri={item.contact.avatar} size={50} />
        <View style={styles.callInfo}>
          <Text style={[styles.callName, isMissed && styles.missed]}>{item.contact.name}</Text>
          <View style={styles.callMeta}>
            <Ionicons name={arrowIcon as any} size={13} color={arrowColor} />
            <Ionicons
              name={item.callType === 'video' ? 'videocam-outline' : 'call-outline'}
              size={13}
              color={Colors.textMuted}
              style={{ marginLeft: 4 }}
            />
            <Text style={styles.callTime}>{item.timestamp}</Text>
            {item.duration ? <Text style={styles.duration}>  ·  {item.duration}</Text> : null}
          </View>
        </View>
        <TouchableOpacity style={styles.callBtn} activeOpacity={0.7}>
          <Ionicons
            name={item.callType === 'video' ? 'videocam-outline' : 'call-outline'}
            size={22}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="search" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockCalls}
        renderItem={renderCall}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="call-outline" size={60} color={Colors.border} />
            <Text style={styles.emptyText}>No recent calls</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="call" size={26} color={Colors.white} />
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
  callItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 12 },
  callInfo: { flex: 1, marginLeft: 12 },
  callName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  missed: { color: Colors.danger },
  callMeta: { flexDirection: 'row', alignItems: 'center' },
  callTime: { fontSize: FontSize.xs, color: Colors.textMuted, marginLeft: 4 },
  duration: { fontSize: FontSize.xs, color: Colors.textMuted },
  callBtn: { padding: 8 },
  sep: { height: 1, backgroundColor: Colors.border, marginLeft: 78 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 12 },
  emptyText: { fontSize: FontSize.lg, color: Colors.textSecondary, fontWeight: '600' },
  fab: {
    position: 'absolute', bottom: 88, right: 20,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 8,
  },
});
