import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';

interface AnimatedVerifiedIconProps {
  size?: number;
}

export const AnimatedVerifiedIcon: React.FC<AnimatedVerifiedIconProps> = ({ size = 28 }) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let isMounted = true;

    const startRotation = () => {
      if (!isMounted) return;
      rotateValue.setValue(0);
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 10000, // 4 segundos para una rotación completa
        easing: Easing.linear, // Animación lineal
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && isMounted) {
          startRotation(); // Reiniciar la animación sin transición perceptible
        }
      });
    };

    startRotation();

    return () => {
      isMounted = false;
      rotateValue.stopAnimation();
    };
  }, [rotateValue]);

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background que rota */}
      <Animated.Image
        source={require('../../../../assets/icons/verified_background.png')}
        style={[
          styles.background,
          {
            width: size,
            height: size,
            transform: [{ rotate }],
          },
        ]}
      />
      
      {/* Foreground estático centrado */}
      <Image
        source={require('../../../../assets/icons/quaver.png')}
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