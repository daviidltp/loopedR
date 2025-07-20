import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import profileicon1 from '../../../../assets/images/profilePics/profileicon1.png';
import profileicon2 from '../../../../assets/images/profilePics/profileicon2.png';
import profileicon4 from '../../../../assets/images/profilePics/profileicon4.png';
import profileicon5 from '../../../../assets/images/profilePics/profileicon5.png';
import profileicon6 from '../../../../assets/images/profilePics/profileicon6.png';

import { Colors } from '../../../constants/Colors';
import { PresetAvatar } from './PresetAvatar';

interface PresetAvatarGridProps {
  onSelectAvatar: (avatar: any) => void;
  selectedAvatar?: any;
  avatarBackgrounds: string[];
  onBackgroundChange: (avatarIndex: number, color: string) => void;
  selectedColorIndex?: number;
  onColorSelect: (colorIndex: number) => void;
  userName?: string; // Nueva prop para el nombre del usuario
}

const PRESET_AVATAR_FILENAMES = [
  'profileicon1.png',
  'profileicon2.png',
  'profileicon6.png',
  'profileicon4.png',
  'profileicon5.png',
];

const PRESET_AVATAR_IMAGES: Record<string, any> = {
  'profileicon1.png': profileicon1,
  'profileicon2.png': profileicon2,
  'profileicon6.png': profileicon6,
  'profileicon4.png': profileicon4,
  'profileicon5.png': profileicon5,
};

// Identificador especial para el DefaultAvatar
const DEFAULT_AVATAR_ID = 'default_avatar';

// Colores de fondo por defecto para cada imagen (5 preestablecidos + 1 para DefaultAvatar)
const DEFAULT_BACKGROUNDS = [
  '#f1bc97', // profileicon1
  '#6571ff', // profileicon2
  '#e2f0cd', // profileicon6 (ahora en posición 3)
  '#f2c6de', // profileicon4
  '#06332e', // profileicon5
  '#222222', // DefaultAvatar
];

// Colores seleccionables
const SELECTABLE_COLORS = [
  '#ffffff',
  '#8e8d55',
  '#2d2d2d',
  '#dde23d',
  '#06332e',
  '#903837',
];

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
  onColorSelect,
  userName
}) => {
  const handleColorSelect = React.useCallback((colorIndex: number) => {
    onColorSelect(colorIndex);
    let selectedAvatarIndex = PRESET_AVATAR_FILENAMES.findIndex(avatar => avatar === selectedAvatar);
    
    // Si es el DefaultAvatar, su índice es 5 (posición 6)
    if (selectedAvatar === DEFAULT_AVATAR_ID) {
      selectedAvatarIndex = 5;
    }
    
    if (selectedAvatarIndex !== -1) {
      onBackgroundChange(selectedAvatarIndex, SELECTABLE_COLORS[colorIndex]);
    }
  }, [onColorSelect, selectedAvatar, onBackgroundChange]);

  // Crear array con los 5 avatares preestablecidos (por nombre) + el DefaultAvatar
  const allAvatars = [...PRESET_AVATAR_FILENAMES, DEFAULT_AVATAR_ID];

  return (
    <View style={styles.container}>
      <View style={styles.avatarsContainer}>
        {allAvatars.map((avatar, index) => {
          // Si es default_avatar, no hay imagen
          const image = avatar === DEFAULT_AVATAR_ID ? undefined : PRESET_AVATAR_IMAGES[avatar];
          return (
            <PresetAvatar
              key={index}
              avatarKey={avatar}
              avatarIndex={index}
              backgroundColor={avatarBackgrounds[index]}
              isSelected={selectedAvatar === avatar}
              onPress={() => onSelectAvatar(avatar)}
              userName={userName}
            />
          );
        })}
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

export { DEFAULT_AVATAR_ID, DEFAULT_BACKGROUNDS, SELECTABLE_COLORS };

