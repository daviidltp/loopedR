import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Switch } from 'react-native-switch';
import { Colors } from '../../../constants/Colors';
import { PlatformTouchable } from '../buttons/PlatformTouchable';
import { AppText } from '../Text/AppText';

interface SettingsItemProps {
  icon?: string;
  customIcon?: React.ReactNode;
  title: string;
  subtitle?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  showChevron?: boolean;
  iconColor?: string;
  textColor?: string;
  isLast?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  customIcon,
  title,
  subtitle,
  hasSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
  showChevron = true,
  iconColor = Colors.mutedWhite,
  textColor = Colors.white,
  isLast = false,
}) => {
  const handlePress = () => {
    if (hasSwitch && onSwitchChange) {
      onSwitchChange(!switchValue);
    } else if (onPress) {
      onPress();
    }
  };

  const renderIcon = () => {
    if (customIcon) {
      return customIcon;
    }
    if (icon) {
      return <Icon source={icon} size={24} color={iconColor} />;
    }
    return null;
  };

  return (
    <PlatformTouchable 
      style={[
        styles.container,
        ...(isLast ? [styles.lastItem] : [])
      ]} 
      onPress={handlePress}
      disabled={!onPress && !hasSwitch}
      rippleColor={Colors.gray[700]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            {renderIcon()}
          </View>
          
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <AppText 
                fontSize={16} 
                fontFamily="inter" 
                fontWeight="medium" 
                color={textColor}
                style={styles.titleText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {title}
              </AppText>
              {subtitle && (
                <AppText 
                  fontSize={14} 
                  fontFamily="inter" 
                  fontWeight="regular" 
                  color={Colors.gray[400]}
                  style={styles.subtitleText}
                >
                  {subtitle}
                </AppText>
              )}
            </View>
          </View>
        </View>
        
        <View style={styles.rightSection}>
          {hasSwitch ? (
            
              <Switch
                value={switchValue}
                onValueChange={onSwitchChange}
                circleBorderWidth={0}
                backgroundActive={Colors.secondaryGreenDark}
                backgroundInactive={Colors.gray[700]}
                circleActiveColor={Colors.secondaryGreen}
                circleInActiveColor={Colors.gray[300]}
                renderActiveText={false}
                renderInActiveText={false}
                switchRightPx={2}
                switchLeftPx={2}
                circleSize={20}
                barHeight={30}
                switchWidthMultiplier={2.5}
              />
            
          ) : (
            showChevron && (
              <Icon source="chevron-right" size={20} color={Colors.gray[500]} />
            )
          )}
        </View>
      </View>
    </PlatformTouchable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[800],
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    height: 64,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    flex: 1,
  },
  subtitleText: {
    marginLeft: 12,
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
}); 