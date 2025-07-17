import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { Colors } from '../../../constants/Colors';
import { ResizingButton } from './ResizingButton';

interface DangerButtonProps {
  icon: string;
  title: string;
  onPress?: () => void;
}

export const DangerButton: React.FC<DangerButtonProps> = ({
  icon,
  title,
  onPress,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <View style={styles.container}>
      <ResizingButton
        title={title}
        onPress={handlePress}
        backgroundColor={Colors.backgroundSoft}
        textColor={Colors.appleRed}
        icon={<Icon source={icon} size={20} color={Colors.appleRed} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
}); 