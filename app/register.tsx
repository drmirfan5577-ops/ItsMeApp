// Powered by OnSpace.AI
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { Colors, Spacing, FontSize, Radius } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { register } = useAuth();
  const { showAlert } = useAlert();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      showAlert('Missing Fields', 'Please fill in all fields');
      return;
    }
    if (password !== confirm) {
      showAlert('Password Mismatch', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      showAlert('Weak Password', 'Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
    } catch (err: any) {
      showAlert('Registration Failed', err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name', icon: 'person-outline' as const, value: name, setter: setName, placeholder: 'Enter your name', secure: false, keyboard: 'default' as const },
    { label: 'Email', icon: 'mail-outline' as const, value: email, setter: setEmail, placeholder: 'Enter your email', secure: false, keyboard: 'email-address' as const },
    { label: 'Password', icon: 'lock-closed-outline' as const, value: password, setter: setPassword, placeholder: 'Minimum 6 characters', secure: true, keyboard: 'default' as const },
    { label: 'Confirm Password', icon: 'lock-closed-outline' as const, value: confirm, setter: setConfirm, placeholder: 'Re-enter password', secure: true, keyboard: 'default' as const },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>{"Join It's Me today"}</Text>
        </View>

        <View style={styles.form}>
          {fields.map(field => (
            <View key={field.label} style={styles.inputGroup}>
              <Text style={styles.label}>{field.label}</Text>
              <View style={styles.inputRow}>
                <Ionicons name={field.icon} size={20} color={Colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor={Colors.textMuted}
                  value={field.value}
                  onChangeText={field.setter}
                  secureTextEntry={field.secure}
                  keyboardType={field.keyboard}
                  autoCapitalize={field.keyboard === 'email-address' ? 'none' : 'words'}
                  autoCorrect={false}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.btn, isLoading && styles.btnDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.btnText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginLink} onPress={() => router.back()}>
            <Text style={styles.loginLinkText}>
              Already have an account?{' '}
              <Text style={{ color: Colors.primary, fontWeight: '700' }}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.white },
  container: { flexGrow: 1, paddingHorizontal: Spacing.lg },
  back: { marginBottom: Spacing.lg, width: 44, height: 44, justifyContent: 'center' },
  header: { marginBottom: Spacing.xl },
  title: { fontSize: FontSize.xxxl - 4, fontWeight: '700', color: Colors.text },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: 4 },
  form: {},
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: { flex: 1, paddingVertical: 14, marginLeft: Spacing.sm, fontSize: FontSize.md, color: Colors.text },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '700' },
  loginLink: { alignItems: 'center' },
  loginLinkText: { fontSize: FontSize.md, color: Colors.textSecondary },
});
