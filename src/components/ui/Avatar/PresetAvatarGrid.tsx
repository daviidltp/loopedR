import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../../constants/Colors';

interface PresetAvatarGridProps {
  onSelectAvatar: (avatar: any) => void;
  selectedAvatar?: any;
}

const PRESET_AVATARS = [
  require('../../../../assets/images/profilePics/profilepic1.jpg'),
  require('../../../../assets/images/profilePics/profilepic2.jpg'),
  require('../../../../assets/images/profilePics/profilepic3.jpg'),
  require('../../../../assets/images/profilePics/profilepic4.jpg'),
  require('../../../../assets/images/profilePics/profilepic5.jpg'),
  require('../../../../assets/images/profilePics/profilepic6.jpg'),
];

// Colores dominantes extraídos de cada imagen de perfil
const AVATAR_COLORS = [
  '#3881a3', // profilepic1 - tonos cálidos de piel
  '#8d8b28', // profilepic2 - tonos dorados
  '#888888', // profilepic3 - tonos marrones
  '#dde23d', // profilepic4 - tonos arena
  '#037669', // profilepic5 - tonos beige
  '#873534', // profilepic6 - tonos amarillo claro
];

const DURATION = 150;
const PRESS_SCALE = 0.95;
const SELECTED_SCALE = 0.9; // Zoom out para seleccionados

const PresetAvatar: React.FC<{
  avatar: any;
  isSelected: boolean;
  onPress: () => void;
  avatarIndex: number;
}> = ({ avatar, isSelected, onPress, avatarIndex }) => {
  const pressTransition = useSharedValue(0);
  const selectionScale = useSharedValue(isSelected ? SELECTED_SCALE : 1);
  const selectionOpacity = useSharedValue(isSelected ? 1 : 0);
  const rotation = useSharedValue(0);

  // Iniciar animación constante y lineal al montar el componente
  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { 
        duration: 3000,
        easing: Easing.linear // Animación lineal sin pausas
      }),
      -1,
      false
    );
  }, []);

  React.useEffect(() => {
    selectionScale.value = withTiming(isSelected ? SELECTED_SCALE : 1, {
      duration: 300,
    });
    selectionOpacity.value = withTiming(isSelected ? 1 : 0, {
      duration: 300,
    });
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(pressTransition.value, [0, 1], [selectionScale.value, selectionScale.value * PRESS_SCALE]),
      },
    ],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: selectionOpacity.value * 0.2, // Aplicar la opacidad baja aquí
  }));

  const borderStyle = useAnimatedStyle(() => ({
    opacity: selectionOpacity.value,
    transform: [{ rotate: `${rotation.value}deg` }],
    borderColor: AVATAR_COLORS[avatarIndex], // Color específico para cada avatar
  }));

  return (
    <View style={styles.avatarWrapper}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          pressTransition.value = withTiming(1, { duration: DURATION });
        }}
        onPressOut={() => {
          pressTransition.value = withTiming(0, { duration: DURATION });
        }}
      >
        <View style={styles.avatarContainer}>
          {/* Rotating dashed border */}
          <Animated.View style={[styles.rotatingBorder, borderStyle]} />
          
          <Animated.View style={[styles.imageContainer, animatedStyle]}>
            <Image
              source={avatar}
              style={styles.avatar}
              resizeMode="cover"
            />
            
            {/* Very soft white overlay */}
            <Animated.View style={[styles.selectionOverlay, overlayStyle]} />
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
};

export const PresetAvatarGrid: React.FC<PresetAvatarGridProps> = ({
  onSelectAvatar,
  selectedAvatar
}) => {
  return (
    <View style={styles.container}>
      {PRESET_AVATARS.map((avatar, index) => (
        <PresetAvatar
          key={index}
          avatar={avatar}
          avatarIndex={index}
          isSelected={selectedAvatar === avatar}
          onPress={() => onSelectAvatar(avatar)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  avatarWrapper: {
    width: '30%',
  },
  avatarContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotatingBorder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 1000,
    overflow: 'hidden',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  selectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.white,
  },
}); 