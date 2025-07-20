import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Colors } from '../../../constants/Colors';
import { DefaultAvatar } from '../Avatar/DefaultAvatar';
import { PlatformTouchable } from '../buttons/PlatformTouchable';
import { AppText } from '../Text/AppText';

interface SettingsProfileSectionProps {
  name: string;
  username: string;
  avatarUrl?: string; // Puede ser preset, url o default_avatar
  onEditPress?: () => void;
}

export const SettingsProfileSection: React.FC<SettingsProfileSectionProps> = ({
  name,
  username,
  avatarUrl,
  onEditPress,
}) => {
  return (
    <PlatformTouchable 
      style={styles.container}
      onPress={onEditPress}
      rippleColor={Colors.gray[700]}
    >
      <View style={styles.mainContainer}>
        <View style={styles.profileContainer}>
          <DefaultAvatar
            name={name}
            size={65}
            avatarUrl={avatarUrl}
            showUploadButton={false}
            disabled={false}
          />
          
          <View style={styles.textContainer}>
            <AppText 
              variant='body'
              fontFamily="inter" 
              fontWeight="semiBold" 
              color={Colors.white}
            >
              {name}
            </AppText>
            <AppText 
              variant='bodySmall'
              fontFamily="inter" 
              fontWeight="regular" 
              color={Colors.mutedWhite}
            >
              @{username}
            </AppText>
          </View>
        </View>

        <Icon source="chevron-right" size={16} color={Colors.mutedWhite} />
      </View>
    </PlatformTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  textContainer: {
    gap: 2,
  },
}); 