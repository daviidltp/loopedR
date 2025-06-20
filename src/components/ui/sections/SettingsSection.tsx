import React from 'react';
import { Platform, Pressable, StyleSheet, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { Colors } from '../../../constants/Colors';
import { ResizingButton } from '../buttons/ResizingButton';

export interface SettingsSectionProps {
  title: string;
  items: SettingsItem[];
}

export interface SettingsItem {
  label: string;
  icon: string;
  onPress: () => void;
  description?: string;
  showChevron?: boolean;
  isDestructive?: boolean;
  useResizingButton?: boolean;
}

// Componente para botones con ripple effect
const RippleButton = ({ onPress, children, isDestructive }: { 
  onPress: () => void; 
  children: React.ReactNode;
  isDestructive?: boolean;
}) => {
  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(
          isDestructive ? Colors.appleRed : Colors.white, 
          false
        )}
        useForeground={true}
      >
        <View>{children}</View>
      </TouchableNativeFeedback>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
};

interface SettingsOptionProps {
  iconName: string;
  title: string;
  subtitle?: string;
  onPress: () => void;
}

export const SettingsOption = ({ title, subtitle, onPress }: SettingsOptionProps) => (
  <Pressable
    style={styles.settingsOption}
    onPress={onPress}
    android_ripple={{ 
      color: 'rgba(255, 255, 255, 0.1)',
      borderless: false 
    }}
  >
    <View style={styles.optionContent}>
      <View style={styles.textContainer}>
        <Text style={styles.optionTitle}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
      <Icon
        source="chevron-right"
        size={24}
        color={Colors.gray[400]}
      />
    </View>
  </Pressable>
);

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, items }) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.itemsContainer}>
        {items.map((item, index) => {
          // Si es el botón de cerrar sesión, usar ResizingButton
          if (item.useResizingButton) {
            return (
              <View key={index} style={styles.resizingButtonContainer}>
                <ResizingButton
                  onPress={item.onPress}
                  title={item.label}
                  backgroundColor={Colors.appleRed}
                  textColor={Colors.white}
                  icon={
                    <Icon
                      source={item.icon}
                      size={20}
                      color={Colors.white}
                    />
                  }
                />
              </View>
            );
          }

          // Para el resto de items, usar RippleButton
          return (
            <RippleButton
              key={index}
              onPress={item.onPress}
              isDestructive={item.isDestructive}
            >
              <View style={[
                styles.itemContainer,
                index === items.length - 1 && styles.lastItem,
              ]}>
                <View style={styles.itemContent}>
                  <View style={styles.leftContent}>
                    <View style={[
                      styles.iconContainer,
                      item.isDestructive && styles.destructiveIconContainer
                    ]}>
                      <Icon
                        source={item.icon}
                        size={20}
                        color={item.isDestructive ? Colors.appleRed : Colors.white}
                      />
                    </View>
                    <View style={styles.textContainer}>
                      <Text style={[
                        styles.itemLabel,
                        item.isDestructive && styles.destructiveText
                      ]}>
                        {item.label}
                      </Text>
                      {item.description && (
                        <Text style={styles.itemDescription}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                  </View>
                  
                  {(item.showChevron !== false) && (
                    <Icon
                      source="chevron-right"
                      size={20}
                      color={Colors.gray[400]}
                    />
                  )}
                </View>
              </View>
            </RippleButton>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 12,
    marginLeft: 4,
  },
  itemsContainer: {
    backgroundColor: Colors.backgroundSoft,
    borderRadius: 16,
    overflow: 'hidden',
  },
  itemContainer: {
  },
  lastItem: {
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.gray[700],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destructiveIconContainer: {
    backgroundColor: Colors.gray[900],
  },
  textContainer: {
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.white,
    marginBottom: 2,
  },
  destructiveText: {
    color: Colors.appleRed,
  },
  itemDescription: {
    fontSize: 14,
    color: Colors.gray[400],
    lineHeight: 18,
  },
  resizingButtonContainer: {
    padding: 16,
  },
  settingsOption: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '500',
    color: Colors.white,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 14,
    color: Colors.gray[400],
  },
}); 