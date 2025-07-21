import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming
} from 'react-native-reanimated';
import { Colors } from '../../../constants/Colors';
import { DefaultAvatar } from './DefaultAvatar';

// Constantes de animación
const DURATION = 150;
const PRESS_SCALE = 0.95;
const SELECTED_SCALE = 0.9; // Zoom out para seleccionados

interface PresetAvatarProps {
  avatarKey: string; // nombre del archivo o 'default_avatar'
  isSelected: boolean;
  onPress: () => void;
  avatarIndex: number;
  backgroundColor: string;
  userName?: string;
}

export const PresetAvatar: React.FC<PresetAvatarProps> = memo(({ 
  avatarKey, 
  isSelected, 
  onPress, 
  avatarIndex, 
  backgroundColor, 
  userName
}) => {
  const selectionScale = useSharedValue(1);
  const selectionOpacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  // Optimizar animaciones iniciales
  React.useEffect(() => {
    if (isSelected) {
      selectionScale.value = withTiming(SELECTED_SCALE, { duration: 300 });
      selectionOpacity.value = withTiming(1, { duration: 300 });
      rotation.value = withRepeat(
        withTiming(360, { 
          duration: 15000,
          easing: Easing.linear
        }),
        -1,
        false
      );
    } else {
      selectionScale.value = withTiming(1, { duration: 300 });
      selectionOpacity.value = withTiming(0, { duration: 300 });
      rotation.value = withTiming(0, { duration: 300 });
    }

    return () => {
      cancelAnimation(selectionScale);
      cancelAnimation(selectionOpacity);
      cancelAnimation(rotation);
    };
  }, [isSelected]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: selectionScale.value,
      },
    ],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: selectionOpacity.value * 0.1,
  }));

  const borderStyle = useAnimatedStyle(() => ({
    opacity: selectionOpacity.value,
    transform: [{ rotate: `${rotation.value}deg` }],
    borderColor: backgroundColor,
  }));

  return (
    <View style={styles.avatarWrapper}>
      <Pressable onPress={onPress}>
        <View style={styles.avatarContainer}>
          <Animated.View style={[styles.rotatingBorder, borderStyle]} />
          
          <Animated.View style={[styles.imageContainer, animatedStyle, { backgroundColor }]}>
            <DefaultAvatar
              name={userName || 'Usuario'}
              size={80}
              avatarUrl={avatarKey} // Siempre pasar el string
              backgroundColor="transparent"
              disabled={false}
              showUploadButton={false}
            />
            
            <Animated.View style={[styles.selectionOverlay, overlayStyle]} />
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  avatarWrapper: {
    width: '25%',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '50%', // Reducido al 50%
    height: '50%', // Reducido al 50%
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