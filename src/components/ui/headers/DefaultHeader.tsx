import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { PlatformIconButton } from '../buttons/PlatformIconButton';
import { AppText } from '../Text/AppText';

interface DefaultHeaderProps {
  title: string;
  onBackPress?: () => void;
}

export const DefaultHeader: React.FC<DefaultHeaderProps> = ({ 
  title,
  onBackPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <PlatformIconButton
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
            {title}
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
    minHeight: 54,
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
    lineHeight: 28,
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginLeft: 8,
  },
}); 