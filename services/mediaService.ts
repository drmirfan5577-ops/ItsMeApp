// Powered by OnSpace.AI
import { getSupabaseClient } from '@/template';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

const supabase = getSupabaseClient();

export type MediaType = 'image' | 'video';

export interface UploadResult {
  url: string;
  type: MediaType;
}

async function uriToBase64ArrayBuffer(uri: string): Promise<ArrayBuffer> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
}

export const mediaService = {
  async pickImage(): Promise<UploadResult | null> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (result.canceled || !result.assets[0]) return null;
    const asset = result.assets[0];
    return mediaService.uploadMedia(asset.uri, 'image');
  },

  async pickVideo(): Promise<UploadResult | null> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return null;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.7,
    });

    if (result.canceled || !result.assets[0]) return null;
    const asset = result.assets[0];
    return mediaService.uploadMedia(asset.uri, 'video');
  },

  async uploadMedia(uri: string, type: MediaType): Promise<UploadResult | null> {
    try {
      const ext = type === 'image' ? 'jpg' : 'mp4';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `chat/${fileName}`;
      const mimeType = type === 'image' ? 'image/jpeg' : 'video/mp4';

      let uploadData: ArrayBuffer | Blob;

      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        uploadData = await response.blob();
      } else {
        uploadData = await uriToBase64ArrayBuffer(uri);
      }

      const { error } = await supabase.storage
        .from('chat-media')
        .upload(filePath, uploadData, { contentType: mimeType, upsert: false });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('chat-media')
        .getPublicUrl(filePath);

      return { url: urlData.publicUrl, type };
    } catch (e) {
      console.error('Upload failed:', e);
      return null;
    }
  },
};
