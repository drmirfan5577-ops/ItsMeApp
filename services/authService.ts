// Powered by OnSpace.AI
import { getSupabaseClient } from '@/template';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  about: string;
}

const supabase = getSupabaseClient();

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Login failed');
    return {
      id: data.user.id,
      name: data.user.user_metadata?.username || email.split('@')[0],
      email: data.user.email || email,
      avatar: `https://i.pravatar.cc/150?u=${data.user.id}`,
      about: "Hey there! I am using It's Me.",
    };
  },

  async register(name: string, email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signUpWithPassword({
      email,
      password,
      options: { data: { username: name } },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Registration failed');
    return {
      id: data.user.id,
      name,
      email,
      avatar: `https://i.pravatar.cc/150?u=${data.user.id}`,
      about: "Hey there! I am using It's Me.",
    };
  },

  async getSession(): Promise<User | null> {
    const { data } = await supabase.auth.getSession();
    if (!data.session?.user) return null;
    const u = data.session.user;
    return {
      id: u.id,
      name: u.user_metadata?.username || u.email?.split('@')[0] || 'User',
      email: u.email || '',
      avatar: `https://i.pravatar.cc/150?u=${u.id}`,
      about: "Hey there! I am using It's Me.",
    };
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        callback({
          id: u.id,
          name: u.user_metadata?.username || u.email?.split('@')[0] || 'User',
          email: u.email || '',
          avatar: `https://i.pravatar.cc/150?u=${u.id}`,
          about: "Hey there! I am using It's Me.",
        });
      } else {
        callback(null);
      }
    });
  },
};
