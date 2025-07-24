import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { mockPosts } from '../../utils/mockData';
import { Post } from '../ui/Post/Post';

const { height: screenHeight } = Dimensions.get('window');

const PreviewScreen: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => {
  const initialY = screenHeight * 1.2;
  const translateY = useSharedValue(visible ? 0 : initialY);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 700, easing: Easing.inOut(Easing.cubic) });
    } else {
      translateY.value = initialY;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  }));

  // Buscar el primer post de tipo 'top-3-songs'
  const top3Post = mockPosts.find(p => p.type === 'top-3-songs');

  return (
    <Animated.View style={[animatedStyle, { justifyContent: 'center', alignItems: 'center', flex: 1, width: "100%" }]}> 
      <TouchableOpacity
        style={{ position: 'absolute', top: 40, left: 20, padding: 8, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 8 }}
        onPress={onClose}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Volver</Text>
      </TouchableOpacity>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, width: '100%' }}>
        {top3Post && <Post post={top3Post} colorName="blue" type="top-3-songs" showHeader={false} showDescription={false} />}
      </View>
    </Animated.View>
  );
};

export default PreviewScreen; 