import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ShadowView } from 'react-native-inner-shadow';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { LoopColors } from '../../constants/LoopColors';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { mockPosts } from '../../utils/mockData';
import { ArtistCircle } from '../ui/FloatingItems/ArtistCircle';
import { Post } from '../ui/Post/Post';
import { PlatformTouchable } from '../ui/buttons/PlatformTouchable';
import { GlobalHeader } from '../ui/headers/GlobalHeader';
import { Layout } from '../ui/layout/Layout';

// Componente ColorItem con ShadowView
const ColorItem = ({ color, backgroundColor, size, selected }: { color: string; backgroundColor: string; size: number; selected?: boolean }) => (
  <ShadowView
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      transform: [{ scale: selected ? 1.2 : 1 }],
    }}
    inset={true}
    backgroundColor={"#111"}
    shadowColor={color}
    shadowOffset={{ width: 0, height: 0 }}
    shadowBlur={selected ? 14 : 8}
  />
);

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const PreviewScreen: React.FC<{ }> = ({ }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    navigation.goBack();
  };
  
  // Calcular el top padding considerando Android
  const getTopPadding = () => {
    if (Platform.OS === 'android') {
      // En Android, usar el StatusBar height + un poco más de espacio
      const statusBarHeight = StatusBar.currentHeight || 0;
      return Math.max(statusBarHeight + 20, insets.top + 20);
    }
    return insets.top + 20; // iOS usa safe area normalmente
  };

  const colorNames = Object.keys(LoopColors) as (keyof typeof LoopColors)[];
  const [selectedColor, setSelectedColor] = useState<keyof typeof LoopColors>(colorNames[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  
  // Cambiar tamaño de los círculos y layout relacionado
  // Configuración del carrusel
  const itemSize = 50;
  const itemMargin = 8;
  const itemWidth = itemSize + 16;
  const containerWidth = screenWidth - 24; // Considerando marginHorizontal del contenedor
  const sidePadding = (containerWidth - itemWidth) / 2;

  // Centrar el elemento seleccionado al abrir la pantalla
  useEffect(() => {
    if (scrollRef.current) {
      const initialIndex = colorNames.indexOf(selectedColor);
      if (initialIndex !== -1) {
        setTimeout(() => {
          scrollToIndex(initialIndex, false);
        }, 100);
      }
    }
  }, []);

  // Función para hacer scroll a un índice específico
  const scrollToIndex = (index: number, animated: boolean = true) => {
    if (scrollRef.current) {
      const scrollX = index * itemWidth;
      scrollRef.current.scrollTo({
        x: scrollX,
        animated,
      });
    }
  };

  // Detectar el elemento más centrado durante el scroll
  const handleScroll = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    
    // Calcular el índice del elemento centrado
    const centeredIndex = Math.round(scrollX / itemWidth);
    const clampedIndex = Math.max(0, Math.min(colorNames.length - 1, centeredIndex));
    
    if (clampedIndex !== selectedIndex) {
      setSelectedIndex(clampedIndex);
      setSelectedColor(colorNames[clampedIndex]);
    }
  };

  // Manejar el final del scroll
  const handleScrollEnd = (event: any) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const targetIndex = Math.round(scrollX / itemWidth);
    const clampedIndex = Math.max(0, Math.min(colorNames.length - 1, targetIndex));
    
    setSelectedIndex(clampedIndex);
    setSelectedColor(colorNames[clampedIndex]);
  };

  // Estado para el tipo de post
  const [postType, setPostType] = useState<'welcome' | 'top-3-songs' | 'top-3-artists'>('welcome');

  // Buscar el primer post de cada tipo
  const welcomePost = mockPosts.find(p => p.type === 'welcome');
  const top3Post = mockPosts.find(p => p.type === 'top-3-songs');
  // Para artistas, usamos el primer usuario con topArtists
  const topArtistsUser = mockPosts[0]?.user?.topArtists ? mockPosts[0].user : undefined;

  // Animación de fade para el post
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const [internalType, setInternalType] = useState(postType);

  React.useEffect(() => {
    if (postType !== internalType) {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setInternalType(postType);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [postType]);

  // Para animar el scroll del carrusel de colores
  const scrollX = React.useRef(new Animated.Value(0)).current;

  return (
    <Layout style={{flex: 1}}>
      <View style={styles.modalContainer}>
        <GlobalHeader
          goBack={true}
          onLeftIconPress={handleBackPress}
        />
        <View style={styles.contentContainer}>
          {/* Botones para cambiar el tipo de post */}
          <View style={styles.buttonRow}>
            <PlatformTouchable onPress={() => setPostType('welcome')} style={[styles.typeButton, ...(postType === 'welcome' ? [styles.typeButtonActive] : [])]}>
              <Text style={[styles.typeButtonText, ...(postType === 'welcome' ? [styles.typeButtonTextActive] : [])]}>Welcome</Text>
            </PlatformTouchable>
            <PlatformTouchable onPress={() => setPostType('top-3-songs')} style={[styles.typeButton, ...(postType === 'top-3-songs' ? [styles.typeButtonActive] : [])]}>
              <Text style={[styles.typeButtonText, ...(postType === 'top-3-songs' ? [styles.typeButtonTextActive] : [])]}>Bucles</Text>
            </PlatformTouchable>
            <PlatformTouchable onPress={() => setPostType('top-3-artists')} style={[styles.typeButton, ...(postType === 'top-3-artists' ? [styles.typeButtonActive] : [])]}>
              <Text style={[styles.typeButtonText, ...(postType === 'top-3-artists' ? [styles.typeButtonTextActive] : [])]}>Artistas</Text>
            </PlatformTouchable>
          </View>

          {/* Renderizado condicional del Post con animación */}
          <Animated.View style={[{ width: '100%' }, styles.fadeAnim, { opacity: fadeAnim }]}>
            {internalType === 'welcome' && welcomePost && (
              <Post 
                post={welcomePost} 
                colorName={selectedColor} 
                type="welcome" 
                showHeader={false} 
                showDescription={false} 
                preview={true} 
                style={{ marginBottom: 0, paddingBottom: 0 }} 
              />
            )}
            {internalType === 'top-3-songs' && top3Post && (
              <Post 
                post={top3Post} 
                colorName={selectedColor} 
                type="top-3-songs" 
                showHeader={false} 
                showDescription={false} 
                preview={true} 
                style={{ marginBottom: 0, paddingBottom: 0 }} 
              />
            )}
            {internalType === 'top-3-artists' && topArtistsUser && (
              <View style={styles.artistsRow}>
                {topArtistsUser.topArtists?.slice(0, 3).map((artist, idx) => (
                  <ArtistCircle key={artist.name} artist={artist} zIndex={3-idx} />
                ))}
              </View>
            )}
          </Animated.View>

          {/* Carrusel de colores mejorado */}
         <View style={{ width: containerWidth, height: 120, justifyContent: 'center', marginTop: 16, position: 'relative' }}>
           <Animated.ScrollView
             ref={scrollRef}
             horizontal
             showsHorizontalScrollIndicator={false}
             style={{ height: 120 }}
             contentContainerStyle={{
               alignItems: 'center',
               paddingLeft: sidePadding,
               paddingRight: sidePadding,
               paddingVertical: 15,
             }}
             onScroll={Animated.event(
               [{ nativeEvent: { contentOffset: { x: scrollX } } }],
               { useNativeDriver: true, listener: handleScroll }
             )}
             onMomentumScrollEnd={handleScrollEnd}
             scrollEventThrottle={16}
             snapToInterval={itemWidth}
             decelerationRate="fast"
             bounces={false}
           >
             {colorNames.map((colorName, idx) => {
               // Calcular la posición central del ítem
               const inputRange = [
                 (idx - 2) * itemWidth,
                 (idx - 1) * itemWidth,
                 idx * itemWidth,
                 (idx + 1) * itemWidth,
                 (idx + 2) * itemWidth,
               ];
               // El scrollX va de 0 a colorNames.length * itemWidth
               const translateY = scrollX.interpolate({
                 inputRange,
                 outputRange: [24, 12, 0, 12, 24],
                 extrapolate: 'clamp',
               });
               const scale = scrollX.interpolate({
                 inputRange,
                 outputRange: [0.85, 0.92, 1.15, 0.92, 0.85],
                 extrapolate: 'clamp',
               });
               return (
                 <View
                   key={colorName}
                   style={{
                     width: itemWidth,
                     height: itemSize,
                     justifyContent: 'center',
                     alignItems: 'center',
                   }}
                 >
                   <TouchableOpacity onPress={() => {
                     setSelectedColor(colorName);
                     scrollToIndex(idx);
                   }}>
                     <Animated.View style={{
                       borderRadius: itemSize / 2,
                       overflow: 'hidden',
                       transform: [{ translateY }, { scale }],
                     }}>
                       <ColorItem
                         color={LoopColors[colorName].basicColor}
                         backgroundColor={LoopColors[colorName].backgroundColor}
                         size={itemSize}
                         selected={selectedIndex === idx}
                       />
                     </Animated.View>
                   </TouchableOpacity>
                 </View>
               );
             })}
           </Animated.ScrollView>
           {/* LinearGradient overlay encima de los círculos */}
           <LinearGradient
             colors={["#000000E0", "transparent", "transparent", "#000000E0"]}
             locations={[0, 0.18, 0.82, 1]}
             start={{ x: 0, y: 0.5 }}
             end={{ x: 1, y: 0.5 }}
             style={{
               position: 'absolute',
               left: 0,
               right: 0,
               top: 0,
               bottom: 0,
               width: '100%',
               height: '100%',
               zIndex: 10,
               pointerEvents: 'none',
             }}
           />
         </View>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 80,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  typeButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: Colors.background,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: Colors.backgroundUltraSoft,
  },
  typeButtonText: {
    color: '#aaa',
    fontWeight: 'bold',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  artistsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  fadeAnim: {
    // width: '100%' lo dejamos en el JSX para evitar conflictos
  },
});

export { PreviewScreen };
