import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { BackHandler, Dimensions, Pressable, StyleSheet, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { HomeScreen } from '../../screens/HomeScreen';
import { InboxScreen } from '../../screens/InboxScreen';
import { ProfileScreen } from '../../screens/ProfileScreen';
import { SearchScreen } from '../../screens/SearchScreen';
import { UploadScreen } from '../../screens/UploadScreen';
import { DefaultAvatar } from '../Avatar/DefaultAvatar';

// Importar los iconos como imágenes

import { useProfile } from '@/src/contexts/ProfileContext';
import AddFilledIcon from '../../../../assets/icons/add_filled.svg';
import HeartIcon from '../../../../assets/icons/heart.svg';
import HeartFilledIcon from '../../../../assets/icons/heart_filled.svg';
import HouseIcon from '../../../../assets/icons/house.svg';
import HouseFilledIcon from '../../../../assets/icons/house_filled.svg';
import SearchIcon from '../../../../assets/icons/search.svg';
import SearchFilledIcon from '../../../../assets/icons/search_filled.svg';
import { useFollowers } from '../../../contexts/FollowersContext';

export type BottomNavigationParamList = {
  Home: undefined;
  Search: { fromSearchAnimation?: boolean } | undefined;
  Upload: undefined;
  Inbox: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomNavigationParamList>();

// Obtener el ancho de la pantalla
const { width: screenWidth } = Dimensions.get('window');

// Componente ProfileAvatar usando DefaultAvatar
const ProfileAvatar = ({ focused }: { focused: boolean }) => {
  const { profile: currentUser } = useProfile();

  const opacity = focused ? 1 : 0.6;
  const avatarUrl = currentUser?.avatar_url;
  const displayName = currentUser?.display_name || 'Usuario';

  return (
    <View style={{ opacity }}>
      <DefaultAvatar
        name={displayName}
        size={28}
        avatarUrl={avatarUrl}
        backgroundColor={Colors.backgroundUltraSoft}
        showUploadButton={false}
        disabled={true}
      />
    </View>
  );
};

const DURATION = 100;

// Botón personalizado con efecto de escala usando reanimated
const CustomTabButton = (props: BottomTabBarButtonProps) => {
  const transition = useSharedValue(0);
  const isActive = useSharedValue(false);
  const scale = 1; //0.9;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(transition.value, [0, 1], [1, scale]),
      },
    ],
  }));

  return (
    <Pressable
      style={styles.tabButton}
      onPress={props.onPress}
      hitSlop={8}
      onPressIn={() => {
        isActive.value = true;
        transition.value = withTiming(1, { duration: DURATION }, () => {
          if (!isActive.value) {
            transition.value = withTiming(0, { duration: DURATION });
          }
        });
      }}
      onPressOut={() => {
        if (transition.value === 1) {
          transition.value = withTiming(0, { duration: DURATION });
        }
        isActive.value = false;
      }}
    >
      <Animated.View 
        style={[
          styles.iconContainer,
          animatedStyle
        ]}
      >
        {props.children}
      </Animated.View>
    </Pressable>
  );
};


export const BottomNavigationBar = ({ onUploadPress }: { onUploadPress?: () => void }) => {
  const insets = useSafeAreaInsets();
  const backPressedOnce = useRef(false);
  const { followRequests } = useFollowers();
  const hasFollowRequests = followRequests.length > 0;

  useEffect(() => {
    const backAction = () => {
      if (backPressedOnce.current) {
        BackHandler.exitApp();
        return true;
      } else {
        backPressedOnce.current = true;
        
        setTimeout(() => {
          backPressedOnce.current = false;
        }, 2000);
        
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: [styles.tabBar, { paddingBottom: insets.bottom }],
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors.white,
          tabBarInactiveTintColor: Colors.white,
          // Forzar background negro para evitar flash blanco
          cardStyle: { backgroundColor: Colors.background },
          sceneStyle: { backgroundColor: Colors.background },
          tabBarBackground: () => (
            <View style={styles.blurContainer}>
              <LinearGradient
                colors={['rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.95)']}
                style={styles.gradientOverlay}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
              />
            </View>
          ),
          tabBarIcon: ({ focused }) => {
            let IconComponent;
            let iconSize = 24;
            let isSpecial = false;
            const opacity = focused ? 1 : 0.6;
            let iconColor = Colors.white;

            switch (route.name) {
              case 'Home':
                IconComponent = focused ? HouseFilledIcon : HouseIcon;
                break;
              case 'Search':
                IconComponent = focused ? SearchFilledIcon : SearchIcon;
                break;
              case 'Upload':
                IconComponent = AddFilledIcon; // Siempre filled para el especial
                iconSize = 32;
                isSpecial = true;
                break;
              case 'Inbox':
                IconComponent = focused ? HeartFilledIcon : HeartIcon;
                return (
                  <View style={[styles.iconWrapper]}>
                    <View style={{ position: 'relative', width: iconSize, height: iconSize }}>
                      <IconComponent
                        width={iconSize}
                        height={iconSize}
                        fill={Colors.white}
                        opacity={opacity}
                      />
                      {hasFollowRequests && (
                        <View style={styles.redDot} />
                      )}
                    </View>
                  </View>
                );
              case 'Profile':
                return <ProfileAvatar focused={focused} />;
            }

            return (
              <View style={[styles.iconWrapper]}>
                <View style={{ position: 'relative', width: iconSize, height: iconSize }}>
                  <IconComponent
                    width={iconSize}
                    height={iconSize}
                    fill={Colors.white}
                    opacity={opacity}
                  />
                </View>
              </View>
            );
          },
          tabBarButton: (props) => {
            // Manejar el press del botón
            const handlePress = (e: any) => {
              if (route.name === 'Upload' && onUploadPress) {
                onUploadPress();
              }
              
              if (props.onPress) {
                props.onPress(e);
              }
            };

            return (
              <CustomTabButton
                {...props}
                onPress={handlePress}
              />
            );
          },
          tabBarItemStyle: styles.tabBarItem,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Search" component={SearchScreen} />
        <Tab.Screen name="Upload" component={UploadScreen} />
        <Tab.Screen name="Inbox" component={InboxScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  tabBar: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: 80,
    bottom: 0,
    paddingHorizontal: 12,
    paddingBottom: 10,
    elevation: 0,
    position: 'absolute',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    overflow: 'hidden',
  },
  tabBarItem: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  tabButton: {
    flex: 1,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: 32,
  },

  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  gradientOverlay: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  redDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.appleRed,
    borderWidth: 2,
    borderColor: Colors.background,
    zIndex: 10,
  },
}); 