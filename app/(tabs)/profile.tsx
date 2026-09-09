// Powered by OnSpace.AI
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

const menuItems = [
  { icon: 'key-outline', label: 'Account', sub: 'Privacy, security, change number', color: '#FF6B35' },
  { icon: 'lock-closed-outline', label: 'Privacy', sub: 'Block contacts, disappearing messages', color: '#4CAF50' },
  { icon: 'chatbubble-outline', label: 'Chats', sub: 'Theme, wallpapers, chat history', color: '#2196F3' },
  { icon: 'notifications-outline', label: 'Notifications', sub: 'Message, group & call tones', color: '#FF9800' },
  { icon: 'data-usage', label: 'Storage and Data', sub: 'Network usage, auto-download', color: '#9C27B0' },
  { icon: 'help-circle-outline', label: 'Help', sub: 'Help centre, contact us, privacy policy', color: '#00BCD4' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { showAlert } = useAlert();

  const handleLogout = () => {
    showAlert('Log out?', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="qr-code-outline" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        {/* Profile Card */}
        <TouchableOpacity style={styles.profileCard} activeOpacity={0.8}>
          <Avatar uri={user?.avatar || 'https://i.pravatar.cc/150?img=33'} size={72} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'User'}</Text>
            <Text style={styles.profileAbout} numberOfLines={2}>{user?.about || "Hey there! I'm using It's Me."}</Text>
          </View>
          <Ionicons name="qr-code-outline" size={22} color={Colors.textMuted} />
        </TouchableOpacity>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={18} color={Colors.primary} />
            <Text style={styles.infoText}>{user?.email || 'test@example.com'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoItem}>
            <Ionicons name="phone-portrait-outline" size={18} color={Colors.primary} />
            <Text style={styles.infoText}>{user?.phone || '+92 300 1234567'}</Text>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {menuItems.map((item, i) => (
            <TouchableOpacity key={i} style={styles.menuItem} activeOpacity={0.75}>
              <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSub} numberOfLines={1}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.border} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.headerBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: Colors.white },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    marginBottom: 2,
  },
  profileInfo: { flex: 1, marginLeft: 14 },
  profileName: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  profileAbout: { fontSize: FontSize.sm, color: Colors.textSecondary },
  infoRow: { backgroundColor: Colors.white, padding: Spacing.md, marginBottom: 8 },
  infoItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  infoText: { fontSize: FontSize.md, color: Colors.text },
  divider: { height: 1, backgroundColor: Colors.border },
  menu: { backgroundColor: Colors.white, marginBottom: 8 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuText: { flex: 1 },
  menuLabel: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  menuSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    gap: 10,
    marginBottom: 8,
  },
  logoutText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.danger },
});
