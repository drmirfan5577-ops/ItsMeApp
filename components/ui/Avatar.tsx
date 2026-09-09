// Powered by OnSpace.AI
import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/theme';

interface AvatarProps {
  uri: string;
  size?: number;
  showOnline?: boolean;
  online?: boolean;
}

export const Avatar = memo(({ uri, size = 50, showOnline = false, online = false }: AvatarProps) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        contentFit="cover"
        transition={200}
      />
      {showOnline && online && (
        <View style={[styles.onlineDot, { width: size * 0.27, height: size * 0.27, borderRadius: size * 0.135, bottom: 1, right: 1 }]} />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: Colors.border,
  },
  onlineDot: {
    position: 'absolute',
    backgroundColor: Colors.online,
    borderWidth: 2,
    borderColor: Colors.white,
  },
});
