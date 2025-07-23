import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { AnimatedVerifiedIcon } from '../../icons/AnimatedVerifiedIcon';
import { AppText } from '../Text/AppText';

export const HomeHeader: React.FC = () => {
  const handlePremiumPress = () => {
    console.log('Premium button pressed');
    // TODO: Implementar funcionalidad premium
  };

  return (
    <View style={styles.header}>
      <AppText variant='h2' fontFamily='raleway' fontWeight='bold' color="#fff">looped</AppText>
      
      {/* Botón premium unificado */}
      <View style={styles.premiumButtonContainer}>
        <Pressable
          onPress={handlePremiumPress}
          style={styles.premiumButton}
          android_ripple={{
            color: 'rgba(255, 255, 255, 0.2)',
            borderless: false
          }}
        >
          <AnimatedVerifiedIcon size={24} />
          <AppText variant='body' fontFamily='inter' lineHeight={22} fontWeight='bold' color={Colors.secondaryGreen}>Obtener Plus</AppText>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
  },
  premiumButtonContainer: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  premiumButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#00B2901A",
  },
}); 