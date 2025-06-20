import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/Colors';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = 'Continuar',
  cancelText = 'Cancelar',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <Pressable style={styles.backdrop} onPress={onCancel} />
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        
        <View style={styles.buttonsContainer}>
          <View style={[styles.buttonWrapper, styles.cancelButtonWrapper]}>
            <Pressable 
              style={styles.button}
              onPress={onCancel}
              android_ripple={{ 
                color: 'rgba(255, 255, 255, 0.2)',
                borderless: false
              }}
            >
              <Text style={styles.buttonText}>{cancelText}</Text>
            </Pressable>
          </View>
          
          <View style={[styles.buttonWrapper, styles.confirmButtonWrapper]}>
            <Pressable 
              style={styles.button}
              onPress={onConfirm}
              android_ripple={{ 
                color: 'rgba(255, 255, 255, 0.2)',
                borderless: false
              }}
            >
              <Text style={styles.buttonText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    backgroundColor: Colors.backgroundSoft,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'left',
    marginBottom: 16,
    width: '100%',
    alignSelf: 'flex-start',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: Colors.white,
    textAlign: 'left',
    opacity: 0.9,
    marginBottom: 24,
    width: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 48,
  },
  buttonWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
  },
  cancelButtonWrapper: {
    backgroundColor: Colors.backgroundUltraSoft,
  },
  confirmButtonWrapper: {
    backgroundColor: Colors.appleRed,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  cancelButtonText: {
    color: Colors.white,
  },
  confirmButtonText: {
    color: Colors.white,
  },
}); 