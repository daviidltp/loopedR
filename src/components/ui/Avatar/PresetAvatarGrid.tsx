import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../../constants/Colors';

interface PresetAvatarGridProps {
  onSelectAvatar: (avatarPath: string) => void;
  selectedAvatar?: string;
}

const PRESET_AVATARS = [
  require('../../../../assets/images/profilePics/carita_sonrojada.png'),
  require('../../../../assets/images/profilePics/carita_sonrojada.png'),
  require('../../../../assets/images/profilePics/carita_sonrojada.png'),
  require('../../../../assets/images/profilePics/carita_sonrojada.png'),
  require('../../../../assets/images/profilePics/carita_sonrojada.png'),
  require('../../../../assets/images/profilePics/carita_sonrojada.png'),
];

const DURATION = 100;
const SCALE = 0.9;

const PresetAvatar: React.FC<{
  avatar: any;
  isSelected: boolean;
  onPress: () => void;
}> = ({ avatar, isSelected, onPress }) => {
  const transition = useSharedValue(0);
  const isActive = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(transition.value, [0, 1], [1, SCALE]),
      },
    ],
  }));

  return (
    <View style={styles.avatarWrapper}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          isActive.value = true;
          transition.value = withTiming(1, { duration: DURATION }, () => {
            if (!isActive.value) {
              transition.value = withTiming(0, {
                duration: DURATION,
              });
            }
          });
        }}
        onPressOut={() => {
          if (transition.value === 1) {
            transition.value = withTiming(0, { duration: DURATION });
          }
          isActive.value = false;
        }}
      >
        <Animated.View
          style={[
            styles.avatarContainer,
            isSelected && styles.selectedAvatar,
            animatedStyle,
          ]}
        >
          <Image
            source={avatar}
            style={styles.avatar}
            resizeMode="cover"
          />
        </Animated.View>
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
    borderRadius: 1000,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    backgroundColor: Colors.backgroundUltraSoft,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
}); 