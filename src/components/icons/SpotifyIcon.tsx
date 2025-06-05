import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SpotifyIconProps {
  size?: number;
  color?: string;
}

export const SpotifyIcon: React.FC<SpotifyIconProps> = ({ 
  size = 24, 
  color = '#1DB954' 
}) => {
  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size, 
        backgroundColor: color,
        borderRadius: size / 2,
      }
    ]}>
      <Text style={[styles.spotifyText, { fontSize: size * 0.5 }]}>
        ♪
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotifyText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 