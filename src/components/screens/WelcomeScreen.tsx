import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { SpotifyIcon } from '../icons/SpotifyIcon';
import { Button } from '../ui/Button';
import { Layout } from '../ui/Layout';

export const WelcomeScreen: React.FC = () => {
  const handleConnectSpotify = () => {
    // TODO: Implementar conexión con Spotify
    console.log('Conectando con Spotify...');
  };

  return (
    <Layout>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Looped</Text>
          <Text style={styles.subtitle}>
            Comparte tu música{'\n'}con tus amigos
          </Text>
          <Text style={styles.description}>
            Cada domingo, sube tus bucles musicales de la semana y descubre qué están escuchando tus amigos.
          </Text>
        </View>

        {/* Music Note Animation Placeholder */}
        <View style={styles.illustrationSection}>
          <View style={styles.musicNote}>
            <Text style={styles.musicNoteText}>♪</Text>
          </View>
          <View style={[styles.musicNote, styles.musicNote2]}>
            <Text style={styles.musicNoteText}>♫</Text>
          </View>
          <View style={[styles.musicNote, styles.musicNote3]}>
            <Text style={styles.musicNoteText}>♪</Text>
          </View>
        </View>

        {/* Bottom Section with Button */}
        <View style={styles.bottomSection}>
          <Button
            onPress={handleConnectSpotify}
            size="large"
            fullWidth
            style={styles.connectButton}
          >
            <View style={styles.buttonContent}>
              <SpotifyIcon size={24} color={Colors.white} />
              <Text style={styles.buttonText}>Conectar con Spotify</Text>
            </View>
          </Button>
          
          <Text style={styles.disclaimer}>
            Al continuar, aceptas nuestros términos de servicio y política de privacidad.
          </Text>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.spotifyGreen,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
  },
  description: {
    fontSize: 16,
    color: Colors.gray[400],
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  illustrationSection: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  musicNote: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.spotifyGreen,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.8,
  },
  musicNote2: {
    top: -30,
    left: -40,
    backgroundColor: Colors.gray[700],
    opacity: 0.6,
  },
  musicNote3: {
    bottom: -20,
    right: -30,
    backgroundColor: Colors.gray[600],
    opacity: 0.4,
  },
  musicNoteText: {
    fontSize: 28,
    color: Colors.white,
    fontWeight: 'bold',
  },
  bottomSection: {
    flex: 0.2,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  connectButton: {
    marginBottom: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  disclaimer: {
    fontSize: 12,
    color: Colors.gray[500],
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
}); 