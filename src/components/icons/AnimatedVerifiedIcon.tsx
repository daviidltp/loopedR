import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';
import quaver from '../../../assets/icons/quaver.png';
import verifiedBackground from '../../../assets/icons/verified_background.png';
import { Colors } from '../../constants/Colors';

interface AnimatedVerifiedIconProps {
  size?: number;
  animated?: boolean;
}

export const AnimatedVerifiedIcon: React.FC<AnimatedVerifiedIconProps> = ({ size = 28, animated = true }) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!animated) return;
    let isMounted = true;

    const startRotation = () => {
      if (!isMounted) return;
      rotateValue.setValue(0);
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && isMounted) {
          startRotation();
        }
      });
    };

    startRotation();

    return () => {
      isMounted = false;
      rotateValue.stopAnimation();
    };
  }, [rotateValue, animated]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}> 
      {animated ? (
        <Animated.Image
          source={verifiedBackground}
          style={[
            styles.background,
            {
              width: size,
              height: size,
              transform: [{ rotate }],
            },
          ]}
        />
      ) : (
        <Image
          source={verifiedBackground}
          style={[
            styles.background,
            {
              width: size,
              height: size,
            },
          ]}
        />
      )}
      <Image
        source={quaver}
        style={[
          styles.foreground,
          {
            width: size/2 + 1,
            height: size/2 + 1,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    tintColor: Colors.secondaryGreen,
  },
  foreground: {
    position: 'absolute',
    tintColor: 'black',
  },
}); 