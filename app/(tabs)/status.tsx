// Powered by OnSpace.AI
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Avatar } from '@/components/ui/Avatar';
import { mockStatusUpdates, StatusUpdate } from '@/services/mockData';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

export default function StatusScreen() {
  const insets = useSafeAreaInsets();

  const renderStatus = ({ item }: { item: StatusUpdate }) => (
    <TouchableOpacity style={styles.statusItem} activeOpacity={0.75}>
      <View style={[styles.ringWrap, item.hasNew ? styles.ringNew : styles.ringViewed]}>
        <Avatar uri={item.contact.avatar} size={50} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.contact.name}</Text>
        <Text style={styles.time}>{item.updates[0].time}</Text>
      </View>
      <Text style={styles.count}>{item.updates.length} update{item.updates.length > 1 ? 's' : ''}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="ellipsis-vertical" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockStatusUpdates}
        renderItem={renderStatus}
        keyExtractor={i => i.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* My status */}
            <TouchableOpacity style={styles.myStatus} activeOpacity={0.8}>
              <View style={styles.myAvatarWrap}>
                <Avatar uri="https://i.pravatar.cc/150?img=33" size={54} />
                <View style={styles.addBtn}>
                  <Ionicons name="add" size={16} color={Colors.white} />
                </View>
              </View>
              <View style={styles.myInfo}>
                <Text style={styles.myName}>My Status</Text>
                <Text style={styles.myHint}>Tap to add status update</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Recent updates</Text>
            </View>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Ionicons name="camera" size={26} color={Colors.white} />
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
  myStatus: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  myAvatarWrap: { position: 'relative' },
  addBtn: {
    position: 'absolute', bottom: -2, right: -2,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: Colors.white,
  },
  myInfo: { flex: 1, marginLeft: 14 },
  myName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  myHint: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  sectionHeader: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, backgroundColor: Colors.background },
  sectionLabel: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' },
  statusItem: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  ringWrap: { borderRadius: Radius.full, padding: 3 },
  ringNew: { borderWidth: 2.5, borderColor: Colors.primary },
  ringViewed: { borderWidth: 2.5, borderColor: Colors.border },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  time: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  count: { fontSize: FontSize.xs, color: Colors.textMuted },
  fab: {
    position: 'absolute', bottom: 88, right: 20,
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 8,
  },
});
