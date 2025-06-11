import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react';
import { BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { HomeScreen } from '../components/screens/HomeScreen';
import { ProfileScreen } from '../components/screens/ProfileScreen';
import { ResizingButtonCircular } from '../components/ui/ResizingButtonCircular';
import { Colors } from '../constants/Colors';

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

// Botón que ocupa toda su celda del grid con TouchableOpacity
const GridCellButton = (props: BottomTabBarButtonProps) => (
  <TouchableOpacity
    style={styles.gridCellButton}
    onPress={props.onPress}
    activeOpacity={0.7}
  >
    <View style={styles.gridCellContent}>
      {props.children}
    </View>
  </TouchableOpacity>
);

// Botón central flotante con ResizingButtonCircular
const FloatingCentralButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={styles.floatingButtonContainer} pointerEvents="box-none">
      <ResizingButtonCircular
        onPress={onPress}
        icon={
          <Icon
            source="plus"
            size={28}
            color={Colors.gray[900]}
          />
        }
        backgroundColor={Colors.white}
        size={56}
        scale={0.85}
        accessibilityLabel="Botón de upload"
        accessibilityHint="Presiona para abrir la pantalla de upload"
      />
    </View>
  );
};

export const MainTabNavigator = ({ onUploadPress }: { onUploadPress?: () => void }) => {
  const insets = useSafeAreaInsets();
  const backPressedOnce = useRef(false);

  useEffect(() => {
    const backAction = () => {
      if (backPressedOnce.current) {
        BackHandler.exitApp();
        return true;
      } else {
        backPressedOnce.current = true;
        Toast.show({
          type: 'info',
          text1: 'Presiona de nuevo para salir',
          visibilityTime: 2000,
          position: 'bottom',
        });
        
        setTimeout(() => {
          backPressedOnce.current = false;
        }, 2000);
        
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const handleUploadPress = () => {
    if (onUploadPress) {
      onUploadPress();
    } else {
      // Acción por defecto si no se proporciona onUploadPress
      console.log('Upload button pressed');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: [styles.tabBar, { paddingBottom: insets.bottom }],
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.white,
          tabBarInactiveTintColor: Colors.gray[500],
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';
            let iconSize = 24;
            let iconStyle = {};

            switch (route.name) {
              case 'Home':
                iconName = 'home';
                break;
              case 'Profile':
                iconName = 'account';
                break;
            }

            return (
              <View style={iconStyle}>
                <Icon
                  source={iconName}
                  size={iconSize}
                  color={color}
                />
              </View>
            );
          },
          tabBarButton: (props) => {
            return <GridCellButton {...props} />;
          },
          tabBarItemStyle: styles.tabBarItem,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
      
      <FloatingCentralButton onPress={handleUploadPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.backgroundSoft,
    borderTopWidth: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 80,
    bottom: 0,
    paddingHorizontal: 8,
    paddingTop: 0,
    elevation: 0,
    position: 'absolute',
    flexDirection: 'row',
    gap: 8,
  },
  tabBarItem: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  // Botón que ocupa toda su celda del grid (mitad izquierda o derecha)
  gridCellButton: {
    flex: 1,
    height: 80,
    width: '100%',
    margin: 0,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  gridCellContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Contenedor para el botón flotante central
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 25,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
}); 