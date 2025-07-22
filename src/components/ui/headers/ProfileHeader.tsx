import React, { useState } from 'react';
import { Platform, View } from 'react-native';
import { Icon, Snackbar } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { AnimatedVerifiedIcon } from '../../icons/AnimatedVerifiedIcon';
import { AppText } from '../Text/AppText';
import { GlobalHeader } from './GlobalHeader';

interface ProfileHeaderProps {
  username: string;
  onMenuPress?: () => void;
  onBackPress?: () => void;
  onMorePress?: () => void;
  isVerified?: boolean;
  isMyProfile?: boolean;
  isPublicProfile?: boolean;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  username, 
  onMenuPress,
  onBackPress,
  onMorePress,
  isVerified = true,
  isMyProfile = false,
  isPublicProfile = true,
}) => {
  // Estado para el Snackbar
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleBookmarkPress = () => {
    setSnackbarVisible(true);
  };

  const handleRightButtonPress = () => {
    if (!isMyProfile && onMorePress) {
      onMorePress();
    } else if (isMyProfile && onMenuPress) {
      onMenuPress();
    }
  };

  // Contenido central con username, icono de privacidad y verificación
  const centerContent = (
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginHorizontal: 12 }}>
      {isMyProfile && !isPublicProfile && (
        <View style={{ marginRight: 8 }}>
          <Icon
            source="lock"
            size={20}
            color={Colors.gray[400]}
          />
        </View>
      )}
      
      <AppText 
        variant={isMyProfile ? 'h3' : 'h4'}
        fontFamily="inter" 
        fontWeight="semiBold" 
        color={Colors.white}
        style={{
          includeFontPadding: false,
          textAlignVertical: 'top',
          marginRight: 6,
          marginBottom: 2,
        }}
        numberOfLines={1}
        lineHeight={isMyProfile ? 32 : 28}
      >
        {username}
      </AppText>
      
      {isVerified && (
        <AnimatedVerifiedIcon size={20} />
      )}
    </View>
  );

  // Botones de acción
  const actionButtons = [
    ...(isMyProfile ? [{
      id: 'bookmark',
      icon: <Icon source="bookmark-outline" size={22} color={Colors.white} />,
      onPress: handleBookmarkPress,
    }] : []),
    {
      id: 'menu',
      icon: <Icon source={!isMyProfile ? "dots-vertical" : "menu"} size={22} color={Colors.white} />,
      onPress: handleRightButtonPress,
    }
  ];

  return (
    <>
      <GlobalHeader
        goBack={!isMyProfile}
        onGoBack={onBackPress}
        centerContent={centerContent}
        actionButtons={actionButtons}
        containerStyle={{}}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={{
          backgroundColor: Colors.secondaryGreenDark,
          marginHorizontal: 16,
          marginBottom: Platform.OS === 'ios' ? insets.bottom : insets.bottom + 40,
          borderRadius: 12,
        }}
        theme={{ colors: { onSurface: Colors.white } }}
      >
        <View>
          <AppText
            style={{ color: Colors.white, fontSize: 18, fontWeight: '700', fontFamily: 'Raleway', textAlign: 'center' }}
          >
            Próximamente en looped... 🤫
          </AppText>
          <AppText
            style={{ color: Colors.mutedWhite, fontSize: 14, fontFamily: 'Raleway', textAlign: 'center' }}
          >
            aaa
          </AppText>
        </View>
      </Snackbar>
    </>
  );
}; 