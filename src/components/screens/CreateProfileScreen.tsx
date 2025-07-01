import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { TextInput } from '../ui/forms/TextInput';
import { Layout } from '../ui/layout/Layout';
import { AppText } from '../ui/Text/AppText';

// ===========================
// TYPES & INTERFACES
// ===========================

type CreateProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateProfile'>;

interface CreateProfileScreenProps {
  navigation: CreateProfileScreenNavigationProp;
}

type ProfileStep = 'name' | 'username';

// ===========================
// CONSTANTS
// ===========================

const ANIMATION_DURATION = 300;
const FADE_DURATION = 200;
const STEP_CHANGE_DELAY = 150;
const SLIDE_DISTANCE = 400;
const KEYBOARD_ANIMATION_DURATION = 250;

const EXISTING_USERNAMES = ['user123', 'musiclover', 'dj_cool', 'playlist_master'];

const ANIMATION_EASING = Easing.bezier(0.4, 0.0, 0.2, 1.0);
const KEYBOARD_SHOW_EASING = Easing.bezier(0.25, 0.1, 0.25, 1.0);
const KEYBOARD_HIDE_EASING = Easing.bezier(0.6, 0.5, 0.25, 0.5);

// ===========================
// MAIN COMPONENT
// ===========================

export const CreateProfileScreen: React.FC<CreateProfileScreenProps> = ({ navigation }) => {
  // ===========================
  // STATE
  // ===========================
  
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [nameError, setNameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<ProfileStep>('name');

  // ===========================
  // CONTEXT & HOOKS
  // ===========================
  
  const { setUserProfileData } = useAuth();

  // ===========================
  // ANIMATIONS
  // ===========================
  
  const nameStepSlideAnim = useSharedValue(0);
  const nameStepOpacityAnim = useSharedValue(1);
  const usernameStepSlideAnim = useSharedValue(SLIDE_DISTANCE);
  const usernameStepOpacityAnim = useSharedValue(0);
  const buttonBottom = useSharedValue(20);

  // ===========================
  // NAVIGATION EFFECTS
  // ===========================
  
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentStep === 'username') {
        handleBackToName();
        return true; // Prevent default behavior
      }
      return false; // Allow app exit
    });

    return () => backHandler.remove();
  }, [currentStep]);

  // ===========================
  // KEYBOARD EFFECTS
  // ===========================
  
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
        buttonBottom.value = withTiming(e.endCoordinates.height + 20, {
          duration: KEYBOARD_ANIMATION_DURATION,
          easing: KEYBOARD_SHOW_EASING
        });
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
        buttonBottom.value = withTiming(20, {
          duration: KEYBOARD_ANIMATION_DURATION,
          easing: KEYBOARD_HIDE_EASING
        });
      }
    );

    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  // ===========================
  // UTILITY FUNCTIONS
  // ===========================
  
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // ===========================
  // VALIDATION FUNCTIONS
  // ===========================
  
  const validateName = useCallback((value: string) => {
    if (!value.trim()) {
      setNameError('');
      return;
    }

    if (value.length < 2) {
      setNameError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    const validChars = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s.-]*$/;
    if (!validChars.test(value)) {
      setNameError('El nombre no puede contener esos caracteres');
      return;
    }

    setNameError('');
  }, []);

  const validateUsername = useCallback((value: string) => {
    if (!value.trim()) {
      setUsernameError('');
      return;
    }

    if (value.length < 3) {
      setUsernameError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    const validChars = /^[a-zA-Z0-9._]*$/;
    if (!validChars.test(value)) {
      setUsernameError('El nombre de usuario no puede contener esos caracteres');
      return;
    }

    if (EXISTING_USERNAMES.includes(value.toLowerCase())) {
      setUsernameError('Este nombre de usuario ya está en uso');
      return;
    }

    setUsernameError('');
  }, []);

  // ===========================
  // INPUT HANDLERS
  // ===========================
  
  const handleNameChange = useCallback((value: string) => {
    setName(value);
    validateName(value);
  }, [validateName]);

  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
    validateUsername(value);
  }, [validateUsername]);

  // ===========================
  // BUSINESS LOGIC
  // ===========================
  
  const isButtonEnabled = currentStep === 'name' 
    ? name.trim().length >= 2 && !nameError
    : username.trim().length >= 3 && !usernameError;

  // ===========================
  // ANIMATION FUNCTIONS
  // ===========================
  
  const animateStepTransition = useCallback(() => {
    // Animate name step exit (slide left)
    nameStepSlideAnim.value = withTiming(-SLIDE_DISTANCE, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING
    });
    nameStepOpacityAnim.value = withTiming(0, {
      duration: FADE_DURATION,
      easing: ANIMATION_EASING
    });
    
    // Animate username step entrance (slide in from right)
    usernameStepSlideAnim.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING
    });
    usernameStepOpacityAnim.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING
    });
    
    // Update step state after animation starts
    setTimeout(() => {
      setCurrentStep('username');
    }, STEP_CHANGE_DELAY);
  }, []);

  const handleBackToName = useCallback(() => {
    // Animate username step exit (slide right)
    usernameStepSlideAnim.value = withTiming(SLIDE_DISTANCE, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING
    });
    usernameStepOpacityAnim.value = withTiming(0, {
      duration: FADE_DURATION,
      easing: ANIMATION_EASING
    });
    
    // Animate name step entrance (slide in from left)
    nameStepSlideAnim.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING
    });
    nameStepOpacityAnim.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING
    });
    
    // Update step state after animation starts
    setTimeout(() => {
      setCurrentStep('name');
    }, STEP_CHANGE_DELAY);
  }, []);

  // ===========================
  // MAIN ACTION HANDLERS
  // ===========================
  
  const handleContinue = useCallback(async () => {
    if (!isButtonEnabled) return;

    if (currentStep === 'name') {
      // First step: transition to username
      animateStepTransition();
    } else {
      // Second step: create profile and navigate
      setIsLoading(true);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Save profile data to context
        await setUserProfileData(username, name);
        
        // Navigate to main app
        navigation.navigate('MainApp');
        
      } catch (error) {
        Alert.alert('Error', 'No se pudo crear el perfil. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [isButtonEnabled, currentStep, name, username, setUserProfileData, navigation, animateStepTransition]);

  // ===========================
  // ANIMATED STYLES
  // ===========================
  
  const nameStepAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: nameStepSlideAnim.value }],
    opacity: nameStepOpacityAnim.value,
  }));

  const usernameStepAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: usernameStepSlideAnim.value }],
    opacity: usernameStepOpacityAnim.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    bottom: buttonBottom.value,
  }));

  // ===========================
  // RENDER
  // ===========================
  
  return (
    <Layout excludeBottomSafeArea={true}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          {/* Content Area */}
          <View style={styles.content}>
            
            {/* Step 1: Name Input (Always Rendered) */}
            <Animated.View style={[styles.stepContainer, nameStepAnimatedStyle]}>
              <AppText 
                variant="h1"
                fontWeight="bold"
                fontFamily='raleway'
                style={styles.title}
              >
                ¿Cómo quieres que te llamemos?
              </AppText>
              
              <View style={styles.formContainer}>
                <View>
                  <TextInput
                    value={name}
                    onChangeText={handleNameChange}
                    placeholder="Tu nombre"
                    maxLength={50}
                    autoCapitalize="words"
                    autoCorrect={false}
                    error={nameError}
                    isValid={name.length >= 2 && !nameError}
                  />
                  
                  <AppText 
                    variant="body"
                    style={styles.helperText}
                  >
                    Este nombre será visible en tu perfil, pero no es tu nombre de usuario
                  </AppText>
                </View>
              </View>
            </Animated.View>

            {/* Step 2: Username Input (Always Rendered) */}
            <Animated.View style={[styles.stepContainer, usernameStepAnimatedStyle]}>
              <AppText 
                variant="h1"
                fontWeight="bold"
                fontFamily='raleway'
                style={styles.title}
              >
                Elige tu nombre de usuario
              </AppText>
              
              <View style={styles.formContainer}>
                <TextInput
                  value={username}
                  onChangeText={handleUsernameChange}
                  placeholder="username"
                  maxLength={20}
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={usernameError}
                  isValid={username.length >= 3 && !usernameError}
                  showFixedAtSymbol={true}
                />
              </View>
            </Animated.View>
            
          </View>

          {/* Continue Button (Static, only moves with keyboard) */}
          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            <ResizingButton
              onPress={handleContinue}
              title="Continuar"
              backgroundColor={Colors.white}
              textColor={Colors.background}
              isDisabled={!isButtonEnabled}
              isLoading={isLoading}
            />
          </Animated.View>
          
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
};

// ===========================
// STYLES
// ===========================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  stepContainer: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    bottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '200',
    color: Colors.white,
    textAlign: 'left',
    marginBottom: 20,
    letterSpacing: -0.5,
    lineHeight: 40,
    marginTop: 20,
  },
  formContainer: {
    flex: 1,
  },
  helperText: {
    paddingTop: 20,
    fontSize: 14,
    color: Colors.white,
    opacity: 0.6,
    lineHeight: 20,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
}); 