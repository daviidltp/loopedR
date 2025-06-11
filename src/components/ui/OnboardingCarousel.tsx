import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '../../constants/Colors';

const { width: screenWidth } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  emoji: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Sube tus bucles',
    description: 'Cada domingo, comparte los temas que más has escuchado durante la semana',
    emoji: '🎵',
  },
  {
    id: 2,
    title: 'Descubre música nueva',
    description: 'Explora los bucles de tus amigos y encuentra tu próxima obsesión musical',
    emoji: '🔍',
  },
  {
    id: 3,
    title: 'Conecta con amigos',
    description: 'Ve qué están escuchando las personas que más te importan',
    emoji: '👥',
  },
  {
    id: 4,
    title: 'Cada domingo es especial',
    description: 'Una nueva oportunidad de compartir y descubrir música increíble',
    emoji: '📅',
  },
];

export const OnboardingCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const dotAnimations = useRef(slides.map(() => new Animated.Value(0))).current;
  const autoScrollTimer = useRef<any>(null);
  const inactivityTimer = useRef<any>(null);
  const lastInteraction = useRef<number>(Date.now());

  useEffect(() => {
    // Animar los indicadores cuando cambia el slide
    dotAnimations.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: index === currentSlide ? 1 : 0,
        useNativeDriver: false,
       // tension: 300,
        friction: 10,
      }).start();
    });
  }, [currentSlide]);

  // Auto-scroll después de inactividad
  useEffect(() => {
    const startInactivityTimer = () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }

      inactivityTimer.current = setTimeout(() => {
        startAutoScroll();
      }, 5000); // 10 segundos de inactividad
    };

    const startAutoScroll = () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }

      autoScrollTimer.current = setInterval(() => {
        setCurrentSlide(prevSlide => {
          const nextSlide = (prevSlide + 1) % slides.length;
          scrollViewRef.current?.scrollTo({
            x: nextSlide * screenWidth,
            animated: true,
          });
          return nextSlide;
        });
      }, 5000); // Cambiar cada 5 segundos
    };

    const resetTimers = () => {
      lastInteraction.current = Date.now();
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
        autoScrollTimer.current = null;
      }
      startInactivityTimer();
    };

    // Iniciar timer de inactividad
    startInactivityTimer();

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, []);

  // Función para manejar interacción del usuario
  const handleUserInteraction = () => {
    lastInteraction.current = Date.now();
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
      autoScrollTimer.current = null;
    }
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    // Reiniciar timer de inactividad después de la interacción
    inactivityTimer.current = setTimeout(() => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }

      autoScrollTimer.current = setInterval(() => {
        setCurrentSlide(prevSlide => {
          const nextSlide = (prevSlide + 1) % slides.length;
          scrollViewRef.current?.scrollTo({
            x: nextSlide * screenWidth,
            animated: true,
          });
          return nextSlide;
        });
      }, 5000);
    }, 10000);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentSlide(slideIndex);
    handleUserInteraction(); // Reset timers on manual scroll
  };

  const renderSlide = (slide: OnboardingSlide) => (
    <View key={slide.id} style={styles.slide}>
      <Text style={styles.emoji}>{slide.emoji}</Text>
      <Text style={styles.slideTitle}>{slide.title}</Text>
      <Text style={styles.slideDescription}>{slide.description}</Text>
    </View>
  );

  const renderPaginationDots = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.dot,
            {
              width: dotAnimations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [12, 20], // Ancho: de 12 a 24
              }),
              opacity: dotAnimations[index].interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 1],
              }),
            }
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
        onTouchStart={handleUserInteraction} // Reset timers on touch
      >
        {slides.map(renderSlide)}
      </ScrollView>
      {renderPaginationDots()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    flex: 1,
    width: screenWidth,
  },
  slide: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: Colors.white,
  },
  slideDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: Colors.white,
    opacity: 0.9,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    width: '100%',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
    backgroundColor: Colors.white,
  },
}); 