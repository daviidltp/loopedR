import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';

interface LayoutProps {
  children: React.ReactNode;
  style?: object;
  excludeBottomSafeArea?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, style, excludeBottomSafeArea = false}) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync('hidden');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  const bottomPadding = excludeBottomSafeArea 
    ? 0 
    : 0;

  return (
    <View style={[styles.container, style]}>

      <View
        style={[
          styles.content,
          {
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: excludeBottomSafeArea ? 0 : insets.bottom,
            paddingTop: insets.top,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
}); 