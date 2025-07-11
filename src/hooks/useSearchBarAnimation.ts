import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import type { BottomNavigationParamList } from '../components/ui/navigation/BottomNavigationBar';

type SearchBarAnimationProps = {
  initialPosition: number;
  targetPosition: number;
};

type HomeScreenNavigationProp = BottomTabNavigationProp<BottomNavigationParamList, 'Home'>;

export const useSearchBarAnimation = ({ initialPosition, targetPosition }: SearchBarAnimationProps) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const fadeOpacity = useSharedValue(1);
  const searchBarTranslateY = useSharedValue(0);

  const navigateToSearch = useCallback(() => {
    navigation.navigate('Search', { fromSearchAnimation: true });
  }, [navigation]);

  const resetAnimations = useCallback(() => {
    fadeOpacity.value = 1;
    searchBarTranslateY.value = 0;
  }, [fadeOpacity, searchBarTranslateY]);

  const handleSearchFocus = useCallback(() => {
    const translateDistance = targetPosition - initialPosition;

    // Configuración de la animación con curva bezier personalizada
    const config = {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1.0)
    };

    // Animar opacidad
    fadeOpacity.value = withTiming(0, {
      ...config,
      duration: 200
    });

    // Animar posición
    searchBarTranslateY.value = withTiming(translateDistance, config, (finished) => {
      if (finished) {
        runOnJS(navigateToSearch)();
      }
    });
  }, [fadeOpacity, searchBarTranslateY, initialPosition, targetPosition, navigateToSearch]);

  const fadeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value
  }));

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: searchBarTranslateY.value }]
  }));

  return {
    fadeAnimatedStyle,
    searchBarAnimatedStyle,
    handleSearchFocus,
    resetAnimations
  };
}; 