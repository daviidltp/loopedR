import React from 'react';
import { View } from 'react-native';
import { Notifier } from 'react-native-notifier';
import { Icon } from 'react-native-paper';
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
  const handleBookmarkPress = () => {
    Notifier.showNotification({
      title: 'Próximamente en looped... 🤫',
      description: '',
      duration: 2000,
      showAnimationDuration: 300,
      hideAnimationDuration: 300,
      onPress: () => {
        Notifier.hideNotification();
      },
      swipeEnabled: true,
      queueMode: 'next',
      componentProps: {
        containerStyle: {
          backgroundColor: Colors.secondaryGreenDark,
          marginHorizontal: 0,
          marginTop: 0,
          paddingVertical: 16,
          paddingTop: 45,
          borderRadius: 0,
        },
        titleStyle: {
          color: Colors.white,
          fontSize: 20,
          fontWeight: '700',
          fontFamily: 'Raleway',
        },
        descriptionStyle: {
          color: Colors.mutedWhite,
          fontSize: 14,
          fontFamily: 'Raleway',
        },
      },
    });
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
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
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
    <GlobalHeader
      goBack={!isMyProfile}
      onGoBack={onBackPress}
      centerContent={centerContent}
      actionButtons={actionButtons}
      containerStyle={{
        marginHorizontal: 10,
      }}
    />
  );
}; 