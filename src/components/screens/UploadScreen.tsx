import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { currentUser } from '../../utils/mockData';
import { AlbumSquare, ArtistCircle } from '../ui/FloatingItems';
import { AppText } from '../ui/Text/AppText';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { Layout } from '../ui/layout/Layout';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

  const handleUploadPress = () => {
    console.log('Upload button pressed');
    // TODO: Implementar funcionalidad de upload
  };

  // Componente para elementos flotantes
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
  }> = ({ item, index }) => {
    // Obtener posición aleatoria de las predefinidas
    const position = predefinedPositions[index % predefinedPositions.length];
    
    // Valores para la animación de flotación
    const floatX = useSharedValue(0);
    const floatY = useSharedValue(0);
    
    useEffect(() => {
      // Generar movimientos sutiles pero fluidos para cada elemento
      const floatDistance = 3 + Math.random() ; // Distancia de flotación entre 3-7px
      const durationX = 6000 + Math.random() * 7500; // Duración X entre 1.5-2.5 segundos
      const durationY = 6000 + Math.random() * 7500; // Duración Y entre 1.4-2.6 segundos
      
      // Animación en X (izquierda-derecha)
      floatX.value = withRepeat(
        withTiming(floatDistance, {
          duration: durationX,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true
      );
      
      // Animación en Y (arriba-abajo) con desfase
      setTimeout(() => {
        floatY.value = withRepeat(
          withTiming(floatDistance * 0.7, {
            duration: durationY,
            easing: Easing.inOut(Easing.sin),
          }),
          -1,
          true
        );
      }, Math.random() * 800); // Desfase aleatorio hasta 0.8 segundos
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        position: 'absolute',
        left: position.x + floatX.value - 40,
        top: position.y + floatY.value - 40,
        transform: [
          {
            translateX: floatX.value,
          },
          {
            translateY: floatY.value,
          },
        ],
      };
    });

    return (
      <Animated.View style={animatedStyle}>
        {item.type === 'artist' ? (
          <ArtistCircle 
            artist={item.data as { position: number; name: string; imageUrl: string; plays: string; }} 
            zIndex={getZIndex(item.type, item.data.position)} 
          />
        ) : (
          <AlbumSquare 
            album={item.data as { position: number; title: string; artist: string; imageUrl: string; plays: string; }} 
            zIndex={getZIndex(item.type, item.data.position)} 
          />
        )}
      </Animated.View>
    );
  };

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
            />
          ))}

          {/* Artista top 1 en el centro con flotación sutil */}
          {topArtist && (
            <CenterFloatingItem
              artist={topArtist}
              centerX={centerX}
              centerY={centerY}
              getZIndex={getZIndex}
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

        <View style={styles.bottomSection}>
          <AppText variant="h2" fontWeight="bold" fontFamily='raleway' color={Colors.white}>
            Sube tu primer <AppText variant="h2" fontWeight="bold" fontFamily='raleway' color={Colors.secondaryGreen}>looped</AppText>
          </AppText>
          
          <ResizingButton
            onPress={handleUploadPress}
            title="Ver looped"
            backgroundColor={Colors.white}
            textColor={Colors.background}
          />
        </View>
      </View>
    </Layout>
  );
};

// Componente separado para el artista central
const CenterFloatingItem: React.FC<{
  artist: any;
  centerX: number;
  centerY: number;
  getZIndex: (type: 'artist' | 'album', position: number) => number;
}> = ({ artist, centerX, centerY, getZIndex }) => {
  return (
    <View style={{
      position: 'absolute',
      left: centerX - 50,
      top: centerY - 50,
      width: 80,
      height: 80,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <ArtistCircle 
        artist={artist} 
        zIndex={getZIndex('artist', artist.position)} 
      />
    </View>
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