import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Keyboard, Animated as RNAnimated, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { ShadowView } from 'react-native-inner-shadow';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { VerifiedIcon } from '../../components/icons/VerifiedIcon';
import { Colors } from '../../constants/Colors';
import { LoopColors } from '../../constants/LoopColors';
import { useProfile } from '../../contexts/ProfileContext';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { supabase } from '../../utils/supabase';
import { DefaultAvatar } from '../ui/Avatar/DefaultAvatar';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { HorizontalPicker } from '../ui/carousels/HorizontalPicker';
import { GlobalHeader } from '../ui/headers/GlobalHeader';
import { Layout } from '../ui/layout/Layout';
import { Post } from '../ui/Post/Post';
import { AppText } from '../ui/Text/AppText';

// Componente ColorItem con ShadowView
const ColorItem = ({ color, backgroundColor, size, selected }: { color: string; backgroundColor: string; size: number; selected?: boolean }) => (
  <ShadowView
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,

    }}
    inset={true}
    backgroundColor={"#111"}
    shadowColor={color}
    shadowOffset={{ width: 0, height: 0 }}
    shadowBlur={selected ? 14 : 8}
  />
);

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const POST_TYPES: Array<'welcome' | 'top-3-songs' | 'top-3-artists'> = ['welcome', 'top-3-songs', 'top-3-artists'];

// Elimina la interfaz PreviewScreenProps y la definición con props directos
const PreviewScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const { profile, topMonthlySongs, topWeeklySongs, topMonthlyArtists } = useProfile();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const colorNames = Object.keys(LoopColors) as (keyof typeof LoopColors)[];
  const [selectedColor, setSelectedColor] = useState<keyof typeof LoopColors>(colorNames[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Cambiar tamaño de los círculos y layout relacionado
  // Configuración del carrusel
  const itemSize = 50;
  const itemMargin = 8;
  const itemWidth = itemSize + 16;
  const containerWidth = screenWidth - 24; // Considerando marginHorizontal del contenedor
  const sidePadding = (containerWidth - itemWidth) / 2;


  // Ref para saber si el cambio de postType viene de un tab/click
  const isTabPressRef = useRef(false);

  // Estado para el tipo de post
  const [postType, setPostType] = useState<'welcome' | 'top-3-songs' | 'top-3-artists'>('welcome');
  const [internalType, setInternalType] = useState(postType);
  // Carrusel de posts
  const carouselRef = useRef<any>(null);
  const carouselWidth = screenWidth; // igual que containerWidth

  // Animated value para el progreso del carrusel
  const tabProgress = useSharedValue(POST_TYPES.indexOf(postType));

  // Solo sincroniza el scroll del carrusel si el cambio viene de un tab/click
  useEffect(() => {
    if (isTabPressRef.current) {
      const idx = POST_TYPES.indexOf(postType);
      if (carouselRef.current && idx !== -1) {
        carouselRef.current.scrollTo({ index: idx, animated: true });
      }
      isTabPressRef.current = false;
    }
    setInternalType(postType);
  }, [postType]);

  // Animar el progreso del tab con el swipe
  const handleProgressChange = (_: any, absoluteProgress: number) => {
    tabProgress.value = absoluteProgress; // sin animación
    console.log('absoluteProgress', absoluteProgress);
    const nextIndex = Math.round(absoluteProgress);
    if (POST_TYPES[nextIndex] && postType !== POST_TYPES[nextIndex]) {
      runOnJS(setPostType)(POST_TYPES[nextIndex]);
    }
  };

  // El carrusel ya no actualiza el picker ni el estado postType
  // Solo el picker controla el carrusel
  // Buscar los datos para cada tipo de post
  const welcomeTopSongs = topMonthlySongs.slice(0, 3).map(song => ({
    position: song.position,
    title: song.song_name,
    artist: song.artist_name,
    plays: '',
    albumCover: song.album_cover_url,
  }));
  const top3Songs = topWeeklySongs.slice(0, 3).map(song => ({
    position: song.position,
    title: song.song_name,
    artist: song.artist_name,
    plays: song.total_play_count?.toString() || '',
    albumCover: song.album_cover_url,
  }));
  const top3Artists = topMonthlyArtists.slice(0, 3).map(artist => ({
    position: artist.position,
    artist_name: artist.artist_name,
    artist_image_url: artist.artist_image_url,
    plays: '',
  }));
  const welcomeDescription = '¡Bienvenido a tu resumen mensual!';
  const top3SongsDescription = 'Tus 3 canciones más escuchadas esta semana.';
  const top3ArtistsDescription = 'Tus 3 artistas más escuchados este mes.';

  // Animación de fade para el post
  const fadeAnim = React.useRef(new RNAnimated.Value(1)).current;

  React.useEffect(() => {
    if (postType !== internalType) {
      // Fade out
      RNAnimated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        setInternalType(postType);
        // Fade in
        RNAnimated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [postType]);

  // Para animar el scroll del carrusel de colores
  const scrollX = React.useRef(new RNAnimated.Value(0)).current;

  // Para la animación del fondo resaltado de los tabs
  const TAB_WIDTH = 100;
  const TAB_HEIGHT = 40;
  const TAB_RADIUS = 32;
  const TAB_MARGIN = 6;

  const animatedTabStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: tabProgress.value * (TAB_WIDTH + 2 * TAB_MARGIN),
      },
    ],
  }));

  React.useEffect(() => {
    tabProgress.value = withTiming(POST_TYPES.indexOf(postType), { duration: 300 });
  }, [postType]);

  // Subida de publicación a Supabase
  const [uploading, setUploading] = useState(false);

  // Utilidad para generar UUID si no existe crypto.randomUUID
  function generateUUID() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    // Fallback simple (no tan seguro como crypto.randomUUID)
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Estado para la descripción del post
  const [description, setDescription] = useState('');

  const handleDescriptionChange = (text: string) => {
    // Divide el texto en líneas
    const lines = text.split('\n');
    if (lines.length <= 3) {
      setDescription(text);
    } else {
      // Si ya hay 3 líneas, ignora el cambio o recorta
      setDescription(lines.slice(0, 3).join('\n'));
    }
  };

  const handleUploadPost = async () => {
    try {
      setUploading(true);
      // 1. Obtener user_id autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('No se pudo obtener el usuario autenticado.');
      // 2. Preparar datos según tipo
      let content: any = {};
      let description = '';
      if (postType === 'welcome') {
        content = {
          topSongs: welcomeTopSongs,
        };
        description = welcomeDescription;
      } else if (postType === 'top-3-songs') {
        content = {
          topSongs: top3Songs,
        };
        description = top3SongsDescription;
      } else if (postType === 'top-3-artists') {
        content = {
          topArtists: top3Artists,
        };
        description = top3ArtistsDescription;
      }
      // 3. Color
      const color_hex = LoopColors[selectedColor].basicColor;
      // 4. Generar id único
      const id = generateUUID();
      // 5. Insertar en Supabase
      const { error } = await supabase.from('posts').insert([
        {
          id,
          user_id: user.id,
          description,
          type: postType,
          content,
          color_hex,
        },
      ]);
      if (error) throw error;
      // 6. Animación de éxito (puedes mejorar esto con un modal/toast)
      // 7. Redirigir a HomeScreen
      navigation.navigate('MainApp');
    } catch (err: any) {
      alert('Error al subir la publicación: ' + (err.message || err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout  >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.modalContainer}>
          <GlobalHeader
            goBack={true}
            onLeftIconPress={handleBackPress}
          />
          <View style={styles.contentContainer}>
            {/* TextInput de ancho completo encima del carrusel */}
            <View style={{ width: '100%', paddingHorizontal: 24 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <DefaultAvatar 
                  size={40} 
                  name={profile?.display_name || profile?.username || ''} 
                  avatarUrl={profile?.avatar_url}
                  showUploadButton={false}
                />
                <View style={{ flex: 1, marginLeft: 12, flexDirection: 'row', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
                    {/* Username + verificado */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                      <AppText
                        fontFamily="inter"
                        fontWeight="semiBold"
                        color={Colors.white}
                        fontSize={16}
                        numberOfLines={1}
                        style={{ marginRight: 6 }}
                      >
                        {profile?.username}
                      </AppText>
                      {profile?.is_verified && (
                        <VerifiedIcon size={12} />
                      )}
                      </View>
                      <AppText
                      fontFamily="inter"
                      fontSize={13}
                      color={description.length === 80 ? Colors.appleRed : Colors.mutedWhite}
                    >
                      {description.length}/80
                    </AppText>
                    </View>
                    <TextInput 
                      placeholder="Añade una descripción"
                      value={description}
                      onChangeText={handleDescriptionChange}
                      maxLength={80}
                      multiline
                      numberOfLines={2}
                      placeholderTextColor={Colors.mutedWhite}
                      style={{
                        textAlignVertical: 'top',
                        fontSize: 16,
                        minHeight: 30,
                        maxHeight: 60,
                        color: Colors.white,
                        padding: 0
                      }}
                    />
                  </View>

                </View>
              </View>
            </View>
            {/* Carrusel animado de posts con react-native-reanimated-carousel */}
        <Carousel
          ref={carouselRef}
          width={carouselWidth}
          height={440}
          data={POST_TYPES}
          loop={false}

          
          style={{justifyContent: 'center', alignItems: 'center', alignSelf: 'center', alignContent: 'center'}}
          pagingEnabled={true}
          onProgressChange={handleProgressChange}
          renderItem={({ item }) => {
            if (item === 'welcome') {
              return (
                <View style={{ width: carouselWidth, justifyContent: 'center', alignItems: 'center', flex: 1}}>
                  <Post
                    colorName={selectedColor}
                    type="welcome"
                    topSongs={welcomeTopSongs}
                    description={welcomeDescription}
                    user={profile}
                    showHeader={false}
                    showDescription={false}
                    preview={true}
                  />
                </View>
              );
            } else if (item === 'top-3-songs') {
              return (
                <View style={{ width: carouselWidth, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                 <Post
                    colorName={selectedColor}
                    type="welcome"
                    topSongs={welcomeTopSongs}
                    description={welcomeDescription}
                    user={profile}
                    showHeader={false}
                    showDescription={false}
                    preview={true}
                  />
                </View>
              );
            } else if (item === 'top-3-artists') {
              return (
                <View style={{ width: carouselWidth, justifyContent: 'center', alignItems: 'center', flex: 1}}>
                  <Post
                    colorName={selectedColor}
                    type="welcome"
                    topSongs={welcomeTopSongs}
                    description={welcomeDescription}
                    user={profile}
                    showHeader={false}
                    showDescription={false}
                    preview={true}
                  />
                </View>
              );
            }
            return <View />;
          }}
        />

        {/* Botones de tipo de post debajo del carrusel con fondo animado */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 8, position: 'relative', height: TAB_HEIGHT }}>
          {/* Fondo animado */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: TAB_MARGIN,
                top: 0,
                width: TAB_WIDTH,
                height: TAB_HEIGHT,
                borderRadius: TAB_RADIUS,
                backgroundColor: '#151515',
                zIndex: 1,
              },
              animatedTabStyle,
            ]}
          />
          {POST_TYPES.map((type, idx) => {
            let label = '';
            if (type === 'welcome') label = 'Welcome';
            else if (type === 'top-3-songs') label = 'Bucles';
            else if (type === 'top-3-artists') label = 'Artistas';
            const isSelected = postType === type;
            return (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  if (!isSelected) {
                    isTabPressRef.current = true;
                    setPostType(type);
                  }
                }}
                activeOpacity={0.8}
                style={{
                  width: TAB_WIDTH,
                  height: TAB_HEIGHT,
                  borderRadius: TAB_RADIUS,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: TAB_MARGIN,
                  zIndex: 2,
                }}
              >
                <AppText
                  fontWeight="bold"
                  fontFamily="inter"
                  fontSize={14}
                  color={isSelected ? Colors.white : Colors.lessMutedWhite}
                >
                  {label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <HorizontalPicker
            items={colorNames}
            selectedIndex={selectedIndex}
            onSelect={idx => {
              setSelectedIndex(idx);
              setSelectedColor(colorNames[idx]);
            }}
            renderItem={(colorName, idx, scrollX) => {
              // Animaciones igual que antes
              const inputRange = [
                (idx - 2) * itemWidth,
                (idx - 1) * itemWidth,
                idx * itemWidth,
                (idx + 1) * itemWidth,
                (idx + 2) * itemWidth,
              ];
              const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.85, 0.92, 1.15, 0.92, 0.85],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View style={{
                  borderRadius: itemSize / 2,
                  overflow: 'hidden',

                }}>
                  <ColorItem
                    color={LoopColors[colorName].basicColor}
                    backgroundColor={LoopColors[colorName].backgroundColor}
                    size={itemSize}
                    selected={selectedIndex === idx}
                  />
                </Animated.View>
              );
            }}
            itemWidth={itemWidth}
            itemSize={itemSize}
            containerWidth={containerWidth}
            gradientOverlay={
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
            }
          />

        </View>

        {/* Botón fijo abajo para subir publicación */}
        <View style={{ width: '100%', position: 'absolute', bottom: 15, left: 0, paddingHorizontal: 24 }}>
          <ResizingButton
            title={uploading ? 'Subiendo...' : 'Subir publicación'}
            onPress={uploading ? () => {} : handleUploadPost}
            backgroundColor={Colors.white}
            textColor={Colors.background}
            height={48}
            borderColor={Colors.background}
            isDisabled={uploading}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  </Layout>
);
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 0
  },
  contentContainer: {

    alignSelf: 'center',
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

