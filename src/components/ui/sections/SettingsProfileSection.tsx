import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Colors } from '../../../constants/Colors';
import { PlatformTouchable } from '../buttons/PlatformTouchable';
import { AppText } from '../Text/AppText';

interface SettingsProfileSectionProps {
  name: string;
  username: string;
  avatarUrl?: string; // Vuelvo a string porque currentUser del mockData usa avatarUrl como string
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
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          {avatarUrl ? (
            <Image 
              source={{ uri: avatarUrl }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.defaultAvatar}>
              <Icon source="account" size={40} color={Colors.gray[400]} />
            </View>
          )}
        </View>
        
        <View style={styles.textContainer}>
          <AppText 
            variant='body'
            fontFamily="inter" 
            fontWeight="semiBold" 
            color={Colors.white}
            style={styles.nameText}
          >
            {name}
          </AppText>
          <AppText 
            variant='bodySmall'
            fontFamily="inter" 
            fontWeight="regular" 
            color={Colors.mutedWhite}
            style={styles.usernameText}
          >
            @{username}
          </AppText>
        </View>
        
        <View style={styles.editButton}>
          <Icon source="chevron-right" size={16} color={Colors.mutedWhite} />
        </View>
      </View>
    </PlatformTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  defaultAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.gray[800],
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    marginBottom: 4,
  },
  usernameText: {
    lineHeight: 18,
    marginBottom: 4,
  },
  editButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
}); 