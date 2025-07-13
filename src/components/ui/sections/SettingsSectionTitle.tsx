import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { AppText } from '../Text/AppText';

interface SettingsSectionTitleProps {
  title: string;
}

export const SettingsSectionTitle: React.FC<SettingsSectionTitleProps> = ({
  title,
}) => {
  return (
    <View style={styles.container}>
      <AppText 
        variant='body'
        fontFamily="inter" 
        fontWeight="semiBold" 
        color={Colors.white}
        style={styles.titleText}
      >
        {title}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 12,
  },
  titleText: {
    lineHeight: 20,
  },
}); 