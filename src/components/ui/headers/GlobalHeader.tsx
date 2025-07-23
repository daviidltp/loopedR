import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon';
import { CloseIcon } from '../../icons/CloseIcon';
import { PlatformIconButton } from '../buttons';

interface ActionButton {
  id: string;
  icon: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

interface GlobalHeaderProps {
  leftIcon?: React.ReactNode;
  onLeftIconPress?: () => void;
  leftIconStyle?: ViewStyle;
  centerContent?: React.ReactNode;
  actionButtons?: ActionButton[];
  containerStyle?: ViewStyle;
  goBack?: boolean;
  onGoBack?: () => void;
  goBackIcon?: 'arrow' | 'close';
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({ 
  leftIcon,
  onLeftIconPress,
  leftIconStyle,
  centerContent,
  actionButtons = [],
  containerStyle,
  goBack = false,
  onGoBack,
  goBackIcon = 'arrow',
}) => {
  const handleLeftIconPress = () => {
    if (goBack && onGoBack) {
      onGoBack();
    } else if (onLeftIconPress) {
      onLeftIconPress();
    }
  };

  const renderLeftIcon = () => {
    if (goBack) {
      if (goBackIcon === 'close') {
        return <CloseIcon size={28} color={Colors.white} />;
      }
      return <ArrowLeftIcon size={28} color={Colors.white} />;
    }
    return leftIcon;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftSection}>
        {(leftIcon || goBack) && (
          <PlatformIconButton
            icon={renderLeftIcon()}
            onPress={handleLeftIconPress}
            style={leftIconStyle ? [styles.leftIconButton, leftIconStyle] : styles.leftIconButton}
            size={24}
          />
        )}
        
        <View style={styles.centerContainer}>
          {centerContent}
        </View>
      </View>
      
      {actionButtons.length > 0 && (
        <View style={styles.rightSection}>
          {actionButtons.map((button, index) => (
            <PlatformIconButton
              key={button.id}
              icon={button.icon}
              onPress={button.onPress}
              disabled={button.disabled}
              rippleColor={Colors.foregroundSoft}
              style={button.style ? [styles.actionButton, button.style] : styles.actionButton}
              size={20}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    minHeight: 70,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 40,
    gap: 12,
  },
  leftIconButton: {
    margin: 0,
  },
  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 40,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 0,
  },
}); 