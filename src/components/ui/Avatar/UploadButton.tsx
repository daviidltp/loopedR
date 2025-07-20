import React from 'react';
import { StyleSheet, View } from 'react-native';
import AddImage from '../../../../assets/icons/add-image.svg';
import { Colors } from '../../../constants/Colors';
import { ResizingButtonCircular } from '../buttons/ResizingButtonCircular';

interface UploadButtonProps {
  size?: number;
  disabled?: boolean;
  onPress?: () => void;
}

export const UploadButton: React.FC<UploadButtonProps> = ({ 
  size = 40,
  disabled = false,
  onPress,
}) => {
  const IconComponent = () => (
    <View style={[styles.iconContainer, { right: size * 0.17, bottom: size * 0.2 }]}> 
      <AddImage width={size * 0.6} height={size * 0.5} fill="#00000088" />
    </View>
  );

  return (
    <ResizingButtonCircular
      onPress={onPress || (() => {})}
      size={size}
      backgroundColor={Colors.secondaryGreen}
      icon={<IconComponent />}
      isDisabled={disabled}
      accessibilityLabel="Botón decorativo de subir imagen"
    />
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    position: 'absolute',
  },
}); 