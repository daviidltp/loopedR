import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';

interface HorizontalPickerProps<T> {
  items: T[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  renderItem: (item: T, index: number, animatedValue: Animated.Value) => React.ReactNode;
  itemWidth: number;
  itemSize: number;
  containerWidth: number;
  style?: StyleProp<ViewStyle>;
  gradientOverlay?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

export function HorizontalPicker<T = any>({
  items,
  selectedIndex,
  onSelect,
  renderItem,
  itemWidth,
  itemSize,
  containerWidth,
  style,
  gradientOverlay,
  containerStyle,
}: HorizontalPickerProps<T>) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const sidePadding = (containerWidth - itemWidth) / 2;
  // Ref para saber si el scroll fue por tap
  const tappedIndex = useRef<number | null>(null);

  // Centrar el elemento seleccionado al abrir la pantalla
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollToIndex(selectedIndex, false);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para hacer scroll a un índice específico
  const scrollToIndex = (index: number, animated: boolean = true) => {
    if (scrollRef.current) {
      const scrollTarget = index * itemWidth;
      scrollRef.current.scrollTo({
        x: scrollTarget,
        animated,
      });
    }
  };

  // Actualiza el seleccionado en tiempo real durante el scroll
  const handleScroll = (event: any) => {
    // Solo actualiza animaciones visuales, no llama a onSelect
    // El renderItem ya recibe scrollX para animar el centrado
  };

  // Al terminar el scroll, solo actualiza si el índice es diferente
  const handleScrollEnd = (event: any) => {
    const scrollXValue = event.nativeEvent.contentOffset.x;
    const targetIndex = Math.round(scrollXValue / itemWidth);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, targetIndex));
    if (clampedIndex !== selectedIndex) {
      onSelect(clampedIndex);
    }
  };

  // Al hacer tap, primero anima el scroll y luego actualiza el seleccionado solo cuando termina el scroll
  const handleTap = (idx: number) => {
    tappedIndex.current = idx;
    scrollToIndex(idx, true);
    // No llamamos a onSelect aquí, solo cuando termine el scroll animado (handleScrollEnd)
  };

  return (
    <View style={[{ width: containerWidth, height: itemSize + 40, justifyContent: 'center', position: 'relative' }, containerStyle, style]}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ height: itemSize + 40 }}
        contentContainerStyle={{
          alignItems: 'center',
          paddingLeft: sidePadding,
          paddingRight: sidePadding,
          paddingVertical: 15,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true, listener: handleScroll }
        )}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        snapToInterval={itemWidth}
        decelerationRate="fast"
        bounces={false}
      >
        {items.map((item, idx) => (
          <View
            key={idx}
            style={{
              width: itemWidth,
              height: itemSize,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => handleTap(idx)}>
              {renderItem(item, idx, scrollX)}
            </TouchableOpacity>
          </View>
        ))}
      </Animated.ScrollView>
      {gradientOverlay}
    </View>
  );
} 