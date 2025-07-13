import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { AppText } from '../Text/AppText';

interface SettingsHeaderProps {
  onBackPress?: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({ 
  onBackPress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={Colors.white}
          onPress={onBackPress}
          style={styles.backButton}
        />
        
        <View style={styles.titleContainer}>
          <AppText 
            fontSize={20} 
            fontFamily="inter" 
            fontWeight="semiBold" 
            color={Colors.white}
            style={styles.titleText}
          >
            Ajustes
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    minHeight: 48,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 40,
  },
  backButton: {
    margin: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 40,
  },
  titleText: {
    lineHeight: 24,
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginLeft: 8,
  },
}); 