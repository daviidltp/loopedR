import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../ui/layout/Layout';
import { Post } from '../ui/Post';

const mockPosts = [
  {
    id: '1',
    user: {
      username: 'musiclover23',
      avatarUrl: 'https://i.pravatar.cc/150?img=1',
      isVerified: true,
    },
    description: 'Mi wrapped de este año está increíble! 🎵 Estos han sido mis tracks más escuchados. ¿Cuáles son los tuyos?',
    topSongs: [
      {
        position: 1,
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        plays: '407',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
      },
      {
        position: 2,
        title: 'Dog Days Are Over',
        artist: 'Florence + The Machine',
        plays: '341',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856',
      },
      {
        position: 3,
        title: 'Mr. Brightside',
        artist: 'The Killers',
        plays: '327',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273ac968b8e94b02f7a8a35b2cf',
      },
    ],
    comments: [
      {
        id: '1',
        username: 'alexmusic',
        avatarUrl: 'https://i.pravatar.cc/150?img=5',
        comment: '¡Increíble selección! Blinding Lights también estuvo en mi top 3 🔥',
        isVerified: false,
      },
      {
        id: '2',
        username: 'indie_vibes',
        avatarUrl: 'https://i.pravatar.cc/150?img=8',
        comment: 'Florence + The Machine siempre una excelente elección 👌',
        isVerified: true,
      },
    ],
  },
  {
    id: '2',
    user: {
      username: 'rockstar_girl',
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
      isVerified: false,
    },
    description: 'Este año descubrí bandas increíbles. Mi estilo musical está evolucionando 🎸✨',
    topSongs: [
      {
        position: 1,
        title: 'Good 4 U',
        artist: 'Olivia Rodrigo',
        plays: '523',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273a91c10fe9472d9bd89802e5a',
      },
      {
        position: 2,
        title: 'Industry Baby',
        artist: 'Lil Nas X ft. Jack Harlow',
        plays: '456',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273e2e352d89826aef6dbd5ff8f',
      },
      {
        position: 3,
        title: 'Bad Habits',
        artist: 'Ed Sheeran',
        plays: '398',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273017b3d57d5b3a97e75c73ee0',
      },
    ],
    comments: [
      {
        id: '3',
        username: 'popmusic_fan',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        comment: 'Olivia Rodrigo es genial! 💜',
        isVerified: false,
      },
    ],
  },
  {
    id: '3',
    user: {
      username: 'dj_beats',
      avatarUrl: 'https://i.pravatar.cc/150?img=7',
      isVerified: true,
    },
    description: 'Mi año musical ha estado lleno de energía y buenos beats. Perfecto para mis sets 🎧🔊',
    topSongs: [
      {
        position: 1,
        title: 'Stay',
        artist: 'The Kid LAROI & Justin Bieber',
        plays: '612',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273c6c5e0ed5baef8e9c2ce9aa4',
      },
      {
        position: 2,
        title: 'Heat Waves',
        artist: 'Glass Animals',
        plays: '534',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273aa9c9f22ab7bb5ab4d5da59c',
      },
      {
        position: 3,
        title: 'As It Was',
        artist: 'Harry Styles',
        plays: '489',
        albumCover: 'https://i.scdn.co/image/ab67616d0000b273daac9c9bb6bfcc9c96a4d2e8',
      },
    ],
    comments: [
      {
        id: '4',
        username: 'house_music_lover',
        avatarUrl: 'https://i.pravatar.cc/150?img=15',
        comment: 'Estos beats son perfectos para hacer ejercicio! 💪',
        isVerified: false,
      },
      {
        id: '5',
        username: 'party_animal',
        avatarUrl: 'https://i.pravatar.cc/150?img=20',
        comment: 'Stay es mi canción del año definitivamente 🎵',
        isVerified: true,
      },
    ],
  },
];

export const HomeScreen: React.FC = () => {
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Feed</Text>
          <Text style={styles.subtitle}>Descubre lo que están escuchando tus amigos</Text>
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {mockPosts.map((post) => (
            <Post key={post.id} data={post} />
          ))}
        </ScrollView>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
    fontFamily: 'Raleway-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[400],
    textAlign: 'left',
    fontFamily: 'Raleway-Regular',
  },
  scrollView: {
    flex: 1,
  },
}); 