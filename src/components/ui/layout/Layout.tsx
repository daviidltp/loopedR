import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { Colors } from '../../../constants/Colors';

interface LayoutProps {
  children: React.ReactNode;
  style?: object;
  excludeBottomSafeArea?: boolean;
}

export const Layout: React.FC<LayoutProps> = (props) => {
  const insets = useSafeAreaInsets();
  SystemNavigationBar.navigationShow();
  SystemNavigationBar.setNavigationColor(Colors.background);

  const bottomPadding = props.excludeBottomSafeArea 
    ? 0 
    : 0;

  return (
    <View style={[styles.container, props.style]}>
      <StatusBar style="light" translucent={true} />

      <View
        style={[
          styles.content,
          {
            paddingLeft: insets.left,
            paddingRight: insets.right,
            paddingBottom: props.excludeBottomSafeArea ? 0 : insets.bottom,
            paddingTop: insets.top,
          },
        ]}
      >
        {props.children}
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