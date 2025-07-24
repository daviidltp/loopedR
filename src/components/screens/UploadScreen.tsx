import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { currentUser } from '../../utils/mockData';
import { AlbumSquare, ArtistCircle } from '../ui/FloatingItems';
import { AppText } from '../ui/Text/AppText';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { Layout } from '../ui/layout/Layout';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// --- Constantes de animación ---
const ARTISTS_Y_DURATION = 700;
const ARTISTS_OPACITY_DURATION = 500;
const TEXT_Y_DURATION = 700;
const PREVIEW_SHOW_DELAY = 300;
const FLOAT_MIN_DISTANCE = 3;
const FLOAT_X_MIN_DURATION = 3000;
const FLOAT_X_MAX_DURATION = 7500;
const FLOAT_Y_MIN_DURATION = 3000;
const FLOAT_Y_MAX_DURATION = 7500;
const FLOAT_Y_OFFSET_MAX = 800;
const FLOATING_ITEM_STAGGER = 80; // ms de delay entre cada item

// --- Hooks de animación ---
function useFloatingItemsAnimation(screenHeight: number) {
  const artistsY = useSharedValue(0);
  const artistsOpacity = useSharedValue(1);
  const textY = useSharedValue(0);

  const animateOut = () => {
    artistsY.value = withTiming(-screenHeight, { duration: ARTISTS_Y_DURATION, easing: Easing.inOut(Easing.cubic) });
    artistsOpacity.value = withTiming(0, { duration: ARTISTS_OPACITY_DURATION, easing: Easing.inOut(Easing.cubic) });
    textY.value = withTiming(screenHeight, { duration: TEXT_Y_DURATION, easing: Easing.inOut(Easing.cubic) });
  };

  const reset = () => {
    artistsY.value = 0;
    artistsOpacity.value = 1;
    textY.value = 0;
  };

  return { artistsY, artistsOpacity, textY, animateOut, reset };
}

// --- Componente de Item flotante ---
const FloatingItem: React.FC<{
  item: {
    type: 'artist' | 'album';
    data: {
      position: number;
      name?: string;
      title?: string;
      artist?: string;
      imageUrl: string;
      plays: string;
    };
    key: string;
  };
  index: number;
  predefinedPositions: { x: number; y: number }[];
  animateOut: boolean;
}> = ({ item, index, predefinedPositions, animateOut }) => {
  const position = predefinedPositions[index % predefinedPositions.length];
  const floatX = useSharedValue(0);
  const floatY = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const floatDistance = FLOAT_MIN_DISTANCE + Math.random();
    const durationX = FLOAT_X_MIN_DURATION + Math.random() * FLOAT_X_MAX_DURATION;
    const durationY = FLOAT_Y_MIN_DURATION + Math.random() * FLOAT_Y_MAX_DURATION;
    floatX.value = withRepeat(
      withTiming(floatDistance, {
        duration: durationX,
        easing: Easing.inOut(Easing.sin),
      }),
      -1,
      true
    );
    setTimeout(() => {
      floatY.value = withRepeat(
        withTiming(floatDistance * 0.7, {
          duration: durationY,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );
    }, Math.random() * FLOAT_Y_OFFSET_MAX);
  }, []);

  useEffect(() => {
    if (animateOut) {
      const delay = index * FLOATING_ITEM_STAGGER + Math.random() * 40;
      setTimeout(() => {
        y.value = withTiming(-Dimensions.get('window').height, { duration: ARTISTS_Y_DURATION, easing: Easing.inOut(Easing.cubic) });
        opacity.value = withTiming(0, { duration: ARTISTS_OPACITY_DURATION, easing: Easing.inOut(Easing.cubic) });
      }, delay);
    } else {
      y.value = 0;
      opacity.value = 1;
    }
  }, [animateOut]);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: position.x + floatX.value - 40,
    top: position.y + floatY.value - 40 + y.value,
    transform: [
      { translateX: floatX.value },
      { translateY: floatY.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      {item.type === 'artist' ? (
        <ArtistCircle 
          artist={item.data as { position: number; name: string; imageUrl: string; plays: string; }} 
          zIndex={6 - item.data.position} 
        />
      ) : (
        <AlbumSquare 
          album={item.data as { position: number; title: string; artist: string; imageUrl: string; plays: string; }} 
          zIndex={11 - item.data.position} 
        />
      )}
    </Animated.View>
  );
};

// --- Componente del artista central ---
const CenterFloatingItem: React.FC<{
  artist: any;
  centerX: number;
  centerY: number;
  artistsY: any;
  artistsOpacity: any;
}> = ({ artist, centerX, centerY, artistsY, artistsOpacity }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: centerX - 50,
    top: centerY - 50 + artistsY.value,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: artistsOpacity.value,
  }));
  return (
    <Animated.View style={animatedStyle}>
      <ArtistCircle 
        artist={artist} 
        zIndex={6 - artist.position} 
      />
    </Animated.View>
  );
};

// --- Animación del texto y botón ---
function useBottomSectionAnimation(textY: any) {
  return useAnimatedStyle(() => ({
    transform: [{ translateY: textY.value }],
    opacity: textY.value === 0 ? 1 : withTiming(0, { duration: 200 }),
  }));
}

export const UploadScreen: React.FC = () => {
  // Crear arrays de artistas y álbumes
  const artists = currentUser.topArtists || [];
  const albums = currentUser.topAlbums || [];
  
  // Obtener el artista top 1 para el centro
  const topArtist = artists.find(artist => artist.position === 1);
  
  // Crear elementos para el círculo (excluyendo el artista top 1)
  const circularArtists = artists.filter(artist => artist.position !== 1);
  const circularAlbums = albums;
  
  // Mezclar y distribuir elementos de forma aleatoria pero balanceada
  const circularItems = [];
  const maxLength = Math.max(circularArtists.length, circularAlbums.length);
  
  // Crear un patrón de distribución más variado
  const distributionPattern = [
    'artist', 'album', 'album', 'artist', 
    'album', 'artist', 'artist', 'album',
    'artist', 'album', 'album', 'artist'
  ];
  
  for (let i = 0; i < maxLength; i++) {
    const patternIndex = i % distributionPattern.length;
    const type = distributionPattern[patternIndex];
    
    if (type === 'artist' && circularArtists[i]) {
      circularItems.push({
        type: 'artist' as const,
        data: circularArtists[i],
        key: `artist-${i}`,
      });
    } else if (type === 'album' && circularAlbums[i]) {
      circularItems.push({
        type: 'album' as const,
        data: circularAlbums[i],
        key: `album-${i}`,
      });
    }
  }
  
  // Si quedan elementos sin agregar, añadirlos al final
  for (let i = 0; i < circularArtists.length; i++) {
    if (!circularItems.find(item => item.type === 'artist' && item.data.position === circularArtists[i].position)) {
      circularItems.push({
        type: 'artist' as const,
        data: circularArtists[i],
        key: `artist-extra-${i}`,
      });
    }
  }
  
  for (let i = 0; i < circularAlbums.length; i++) {
    if (!circularItems.find(item => item.type === 'album' && item.data.position === circularAlbums[i].position)) {
      circularItems.push({
        type: 'album' as const,
        data: circularAlbums[i],
        key: `album-extra-${i}`,
      });
    }
  }

  // Posiciones predefinidas distribuidas por la pantalla
  const predefinedPositions = [
    { x: screenWidth * 0.1, y: screenHeight * 0.15 }, // Artista 2
    { x: screenWidth * 0.65, y: screenHeight * 0.12 }, // Album 3
    { x: screenWidth * 0.05, y: screenHeight * 0.35 }, // Artista 4
    { x: screenWidth * 0.85, y: screenHeight * 0.28 }, // Album 1
    { x: screenWidth * 0.15, y: screenHeight * 0.5 }, // Album 5
    { x: screenWidth * 0.85, y: screenHeight * 0.48 }, // Artista 3
    { x: screenWidth * 0.75, y: screenHeight * 0.65 }, // Artista 4
    { x: screenWidth * 0.25, y: screenHeight * 0.6 }, // Album 2
    { x: screenWidth * 0.35, y: screenHeight * 0.08 }, // Album 4

  ];
  
  const centerX = screenWidth * 0.53;
  const centerY = screenHeight * 0.4; // Usar porcentaje fijo en lugar de cálculo dinámico
  
  const getZIndex = (type: 'artist' | 'album', position: number) => {
    if (type === 'artist') {
      return 6 - position;
    } else {
      return 11 - position;
    }
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {
    artistsY,
    artistsOpacity,
    textY,
    animateOut,
    reset: resetAnimations,
  } = useFloatingItemsAnimation(screenHeight);
  const [animateFloatingItems, setAnimateFloatingItems] = useState(false);

  const handleUploadPress = () => {
    setAnimateFloatingItems(true);
    animateOut(); // solo para el central y el texto
    setTimeout(() => navigation.navigate('Preview'), PREVIEW_SHOW_DELAY + circularItems.length * FLOATING_ITEM_STAGGER);
  };

  const bottomSectionAnimated = useBottomSectionAnimation(textY);

  useFocusEffect(
    React.useCallback(() => {
      resetAnimations();
      setAnimateFloatingItems(false);
    }, [])
  );

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Elementos flotantes */}
          {circularItems.map((item, index) => (
            <FloatingItem
              key={item.key}
              item={item}
              index={index}
              predefinedPositions={predefinedPositions}
              animateOut={animateFloatingItems}
            />
          ))}

          {/* Artista top 1 en el centro con flotación sutil */}
          {topArtist && (
            <CenterFloatingItem
              artist={topArtist}
              centerX={centerX}
              centerY={centerY}
              artistsY={artistsY}
              artistsOpacity={artistsOpacity}
            />
          )}
        </View>

        {/* Gradiente desde abajo, encima del content pero debajo del texto y botón */}
        <LinearGradient
          colors={[Colors.background, 'transparent']}
          start={{ x: 0.5, y: 0.5 }}
          end={{ x: 0.5, y: 0 }}
          style={styles.gradientOverlay}
        />

        <Animated.View style={[styles.bottomSection, bottomSectionAnimated]}>
          <AppText variant="h2" fontWeight="bold" fontFamily='raleway' color={Colors.white}>
            Sube tu primer <AppText variant="h2" fontWeight="bold" fontFamily='raleway' color={Colors.secondaryGreen}>looped</AppText>
          </AppText>
          <ResizingButton
            onPress={handleUploadPress}
            title="Ver looped"
            backgroundColor={Colors.white}
            textColor={Colors.background}
            height={46}
          />
        </Animated.View>

      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingBottom: 75,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  bottomSection: {
    paddingHorizontal: 24,
    gap: 16,
    position: 'relative',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 250,
    zIndex: 1,
  },
});