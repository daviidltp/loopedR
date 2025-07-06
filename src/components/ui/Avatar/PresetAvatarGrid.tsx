import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';
import { Colors } from '../../../constants/Colors';

interface PresetAvatarGridProps {
  onSelectAvatar: (avatar: any) => void;
  selectedAvatar?: any;
  avatarBackgrounds: string[];
  onBackgroundChange: (avatarIndex: number, color: string) => void;
  selectedColorIndex?: number;
  onColorSelect: (colorIndex: number) => void;
}

const PRESET_AVATARS = [
  require('../../../../assets/images/profilePics/profileicon1.png'),
  require('../../../../assets/images/profilePics/profileicon2.png'),
  require('../../../../assets/images/profilePics/profileicon3.png'),
  require('../../../../assets/images/profilePics/profileicon4.png'),
  require('../../../../assets/images/profilePics/profileicon5.png'),
  require('../../../../assets/images/profilePics/profileicon6.png'),
];

// Colores de fondo por defecto para cada imagen
const DEFAULT_BACKGROUNDS = [
  '#ffffff', // profileicon1
  '#8e8d55', // profileicon2
  '#2d2d2d', // profileicon3
  '#dde23d', // profileicon4
  '#06332e', // profileicon5
  '#903837', // profileicon6
];

// Colores seleccionables
const SELECTABLE_COLORS = [
  '#3baee4',
  '#8e8d55',
  '#2d2d2d',
  '#dde23d',
  '#06332e',
  '#903837',
];

const DURATION = 150;
const PRESS_SCALE = 0.95;
const SELECTED_SCALE = 0.9; // Zoom out para seleccionados

const PresetAvatar: React.FC<{
  avatar: any;
  isSelected: boolean;
  onPress: () => void;
  avatarIndex: number;
  backgroundColor: string;
}> = memo(({ avatar, isSelected, onPress, avatarIndex, backgroundColor }) => {
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
            <Image
              source={avatar}
              style={styles.avatar}
              resizeMode="contain"
            />
            
            <Animated.View style={[styles.selectionOverlay, overlayStyle]} />
          </Animated.View>
        </View>
      </Pressable>
    </View>
  );
});

const ColorSelector: React.FC<{
  colors: string[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
}> = memo(({ colors, selectedIndex, onSelect }) => {
  return (
    <View style={styles.colorSelectorContainer}>
      {colors.map((color, index) => (
        <Pressable
          key={index}
          onPress={() => onSelect(index)}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            selectedIndex === index && styles.selectedColor
          ]}
        />
      ))}
    </View>
  );
});

export const PresetAvatarGrid: React.FC<PresetAvatarGridProps> = memo(({
  onSelectAvatar,
  selectedAvatar,
  avatarBackgrounds,
  onBackgroundChange,
  selectedColorIndex,
  onColorSelect
}) => {
  const handleColorSelect = React.useCallback((colorIndex: number) => {
    onColorSelect(colorIndex);
    const selectedAvatarIndex = PRESET_AVATARS.findIndex(avatar => avatar === selectedAvatar);
    if (selectedAvatarIndex !== -1) {
      onBackgroundChange(selectedAvatarIndex, SELECTABLE_COLORS[colorIndex]);
    }
  }, [onColorSelect, selectedAvatar, onBackgroundChange]);

  return (
    <View style={styles.container}>
      <View style={styles.avatarsContainer}>
        {PRESET_AVATARS.map((avatar, index) => (
          <PresetAvatar
            key={index}
            avatar={avatar}
            avatarIndex={index}
            backgroundColor={avatarBackgrounds[index]}
            isSelected={selectedAvatar === avatar}
            onPress={() => onSelectAvatar(avatar)}
          />
        ))}
      </View>
      
      {/* <ColorSelector
        colors={SELECTABLE_COLORS}
        selectedIndex={selectedColorIndex}
        onSelect={handleColorSelect}
      /> */}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  avatarsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 35,
  },
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
  colorSelectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  colorOption: {
    width: 35,
    height: 35,
    borderRadius: 100,
  },
  selectedColor: {
    borderColor: Colors.white,
    borderWidth: 3,
  },
}); 

export { DEFAULT_BACKGROUNDS, SELECTABLE_COLORS };
