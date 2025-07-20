import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { RippleButton } from '../buttons';
import { AppText } from '../Text/AppText';

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
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const [shouldRender, setShouldRender] = React.useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (shouldRender) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 50,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [visible, shouldRender, fadeAnim, translateYAnim]);

  if (!shouldRender) return null;

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <Pressable 
        style={styles.backdrop} 
        onPress={onCancel}
      />
      <Animated.View 
        style={[
          styles.container, 
          { 
            transform: [{ translateY: translateYAnim }] 
          }
        ]}
      >
        <AppText
          variant="h5"
          fontFamily="inter"
          fontWeight="bold"
          color={Colors.white}
          style={styles.title}
        >
          {title}
        </AppText>
        <AppText
          variant="body"
          fontFamily="inter"
          fontWeight="regular"
          color={Colors.white}
          style={styles.description}
        >
          {description}
        </AppText>
        
        <View style={styles.buttonsContainer}>
          <View style={[styles.buttonWrapper, styles.cancelButtonWrapper]}>
            <RippleButton 
              onPress={onCancel}
              title={cancelText}
              backgroundColor={Colors.backgroundUltraSoft}
              textColor={Colors.white}
              borderColor={Colors.backgroundUltraSoft}
              height={48}
              rippleColor='#ffffff22'
            />
          </View>
          
          <View style={[styles.buttonWrapper, styles.confirmButtonWrapper]}>
            <RippleButton 
              onPress={onConfirm}
              title={confirmText}
              backgroundColor={Colors.appleRed}
              textColor={Colors.white}
              borderColor={Colors.appleRed}
              height={48}
              rippleColor='#ffffff22'
            />
          </View>
        </View>
      </Animated.View>
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
    textAlign: 'left',
    marginBottom: 16,
    width: '100%',
    alignSelf: 'flex-start',
  },
  description: {
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
  },
  cancelButtonText: {
    color: Colors.white,
  },
  confirmButtonText: {
    color: Colors.white,
  },
}); 