import { StackNavigationProp } from '@react-navigation/stack';
import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  InteractionManager,
  Keyboard,
  Platform,
  TextInput as RNTextInput,
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
import { DefaultAvatar } from '../ui/Avatar/DefaultAvatar';
import { UploadButton } from '../ui/Avatar/UploadButton';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { TextInput } from '../ui/forms/TextInput';
import { Layout } from '../ui/layout/Layout';
import { AppText } from '../ui/Text/AppText';

// Cargar PresetAvatarGrid de manera diferida
const PresetAvatarGrid = lazy(() => 
  import('../ui/Avatar/PresetAvatarGrid').then(module => ({
    default: module.PresetAvatarGrid
  }))
);

// Importamos los arrays necesarios para calcular el índice del avatar
const PRESET_AVATARS = [
  require('../../../assets/images/profilePics/profileicon1.png'),
  require('../../../assets/images/profilePics/profileicon2.png'),
  require('../../../assets/images/profilePics/profileicon3.png'),
  require('../../../assets/images/profilePics/profileicon4.png'),
  require('../../../assets/images/profilePics/profileicon5.png'),
  require('../../../assets/images/profilePics/profileicon6.png'),
];

const SELECTABLE_COLORS = [
  '#c9e4de',
  '#8e8d55',
  '#2d2d2d',
  '#dde23d',
  '#06332e',
  '#903837',
];

// ===========================
// TYPES & INTERFACES
// ===========================

type CreateProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateProfile'>;

interface CreateProfileScreenProps {
  navigation: CreateProfileScreenNavigationProp;
}

type ProfileStep = 'name' | 'username' | 'avatar';

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
  const [selectedAvatar, setSelectedAvatar] = useState<any>();
  const [avatarBackgrounds, setAvatarBackgrounds] = useState<string[]>([
    '#f1bc97', '#a7ddc9', '#2d2d2d', '#f2c6de', '#06332e', '#e2f0cd'
  ]);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState<ProfileStep>('name');
  const [shouldFocusNameInput, setShouldFocusNameInput] = useState(true);

  // Nuevo estado para controlar la carga diferida de componentes pesados
  const [shouldLoadAvatarGrid, setShouldLoadAvatarGrid] = useState(false);

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
  const avatarStepSlideAnim = useSharedValue(SLIDE_DISTANCE);
  const avatarStepOpacityAnim = useSharedValue(0);
  const buttonBottom = useSharedValue(20);

  // Cargar el grid después de la transición de navegación
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setShouldLoadAvatarGrid(true);
      
      // Iniciar animación inicial
      nameStepSlideAnim.value = withTiming(0, {
        duration: ANIMATION_DURATION,
        easing: ANIMATION_EASING,
      });
    });

    return () => task.cancel();
  }, []);

  // Efectos del teclado
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

  // Navegación hacia atrás
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentStep === 'username') {
        handleBackToName();
        return true;
      } else if (currentStep === 'avatar') {
        handleBackToUsername();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [currentStep]);

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
      setNameError('El nombre no puede contener caracteres especiales');
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
      setUsernameError('El nombre de usuario no puede contener caracteres especiales');
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
    : currentStep === 'username'
    ? username.trim().length >= 3 && !usernameError
    : true; // Avatar selection is now optional

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

  const animateToAvatarStep = useCallback(() => {
    // Cerrar el teclado
    Keyboard.dismiss();

    // Animate username step exit
    usernameStepSlideAnim.value = withTiming(-SLIDE_DISTANCE, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING
    });
    usernameStepOpacityAnim.value = withTiming(0, {
      duration: FADE_DURATION,
      easing: ANIMATION_EASING
    });
    
    // Animate avatar step entrance
    avatarStepSlideAnim.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING
    });
    avatarStepOpacityAnim.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING
    });
    
    setTimeout(() => {
      setCurrentStep('avatar');
    }, STEP_CHANGE_DELAY);
  }, []);

  const handleBackToUsername = useCallback(() => {
    // Animate avatar step exit
    avatarStepSlideAnim.value = withTiming(SLIDE_DISTANCE, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING
    });
    avatarStepOpacityAnim.value = withTiming(0, {
      duration: FADE_DURATION,
      easing: ANIMATION_EASING
    });
    
    // Animate username step entrance
    usernameStepSlideAnim.value = withTiming(0, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING
    });
    usernameStepOpacityAnim.value = withTiming(1, {
      duration: ANIMATION_DURATION,
      easing: ANIMATION_EASING
    });
    
    setTimeout(() => {
      setCurrentStep('username');
    }, STEP_CHANGE_DELAY);
  }, []);

  // ===========================
  // HANDLERS
  // ===========================

  const handleUploadAvatar = useCallback(() => {
    // Función vacía para mantener la estética pero sin funcionalidad
  }, []);

  const handleSelectPresetAvatar = useCallback((avatar: any) => {
    setSelectedAvatar(avatar);
  }, []);

  const handleBackgroundChange = useCallback((avatarIndex: number, color: string) => {
    setAvatarBackgrounds(prev => {
      const newBackgrounds = [...prev];
      newBackgrounds[avatarIndex] = color;
      return newBackgrounds;
    });
  }, []);

  const handleColorSelect = useCallback((colorIndex: number) => {
    setSelectedColorIndex(colorIndex);
  }, []);

  // ===========================
  // MAIN ACTION HANDLERS
  // ===========================
  
  const handleContinue = useCallback(async () => {
    if (!isButtonEnabled) return;

    if (currentStep === 'name') {
      // First step: transition to username
      animateStepTransition();
    } else if (currentStep === 'username') {
      // Second step: transition to avatar
      animateToAvatarStep();
    } else {
      // Final step: create profile and navigate
      setIsLoading(true);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 0));

        // Save profile data to context
        await setUserProfileData(username, name);
        
        // La navegación será manejada automáticamente por AppNavigator
        // basándose en el estado de hasCompletedProfile
        
      } catch (error) {
        Alert.alert('Error', 'No se pudo crear el perfil. Inténtalo de nuevo.');
      } finally {
        setIsLoading(false);
      }
    }
  }, [isButtonEnabled, currentStep, name, username, selectedAvatar, setUserProfileData, animateStepTransition, animateToAvatarStep]);

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

  const avatarStepAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: avatarStepSlideAnim.value }],
    opacity: avatarStepOpacityAnim.value,
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    bottom: buttonBottom.value,
  }));

  // ===========================
  // REFS
  // ===========================

  const nameInputRef = useRef<RNTextInput>(null);
  const usernameInputRef = useRef<RNTextInput>(null);

  useEffect(() => {
    if (shouldFocusNameInput && currentStep === 'name') {
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
        setShouldFocusNameInput(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [shouldFocusNameInput]);

  useEffect(() => {
    if (currentStep === 'name') {
      nameInputRef.current?.focus();
    } else if (currentStep === 'username') {
      usernameInputRef.current?.focus();
    }
  }, [currentStep]);

  // Renderizado del grid de avatares
  const renderAvatarGrid = () => (
    shouldLoadAvatarGrid ? (
      <Suspense fallback={
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      }>
        <PresetAvatarGrid
          onSelectAvatar={handleSelectPresetAvatar}
          selectedAvatar={selectedAvatar}
          avatarBackgrounds={avatarBackgrounds}
          onBackgroundChange={handleBackgroundChange}
          selectedColorIndex={selectedColorIndex}
          onColorSelect={handleColorSelect}
        />
      </Suspense>
    ) : null
  );

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
                    ref={nameInputRef}
                    value={name}
                    onChangeText={handleNameChange}
                    placeholder="Tu nombre"
                    maxLength={50}
                    autoCapitalize="words"
                    autoCorrect={false}
                    autoFocus={true}
                    error={nameError}
                    helperText="Este nombre será visible en tu perfil, pero no es tu nombre de usuario"
                  />
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
                  ref={usernameInputRef}
                  value={username}
                  onChangeText={handleUsernameChange}
                  placeholder="username"
                  maxLength={20}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={true}
                  error={usernameError}
                  isValid={username.length >= 3 && !usernameError}
                  showFixedAtSymbol={true}
                  helperText="No te preocupes, podrás cambiarlo más adelante"
                />
              </View>
            </Animated.View>

            {/* Step 3: Avatar Selection (Always Rendered) */}
            <Animated.View style={[styles.stepContainer, avatarStepAnimatedStyle]}>
              <AppText 
                variant="h1"
                fontWeight="bold"
                fontFamily='raleway'
                style={styles.title}
              >
                Elige tu imagen de perfil
              </AppText>
              
              <View style={styles.formContainer}>
                <View style={styles.avatarSection}>
                  <View style={styles.defaultAvatarContainer}>
                    <DefaultAvatar 
                      name={name} 
                      size={200}
                      borderStyle='dashed'
                      selectedImage={selectedAvatar}
                      backgroundColor={
                        selectedAvatar 
                          ? avatarBackgrounds[PRESET_AVATARS.findIndex((avatar: any) => avatar === selectedAvatar)]
                          : selectedColorIndex !== undefined 
                            ? SELECTABLE_COLORS[selectedColorIndex] 
                            : undefined
                      }
                    />
                    <View style={styles.uploadButtonContainer}>
                      <UploadButton 
                        size={40}
                      />
                    </View>
                  </View>

                  <View style={styles.separatorContainer}>
                    <AppText 
                      variant="body"
                      fontFamily="raleway"
                      fontWeight="light"
                      style={styles.separatorText}
                    >
                      o utiliza una imagen de looped
                    </AppText>
                  </View>

                  <View style={styles.presetAvatarsContainer}>
                    {renderAvatarGrid()}
                  </View>
                </View>
              </View>
            </Animated.View>
            
          </View>

          {/* Continue Button */}
          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            <ResizingButton
              onPress={handleContinue}
              title={currentStep === 'avatar' ? 'Comenzar' : 'Continuar'}
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
    justifyContent: 'center',
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
    marginBottom: 30,
    letterSpacing: -0.5,
    lineHeight: 40,
    marginTop: 40,
  },
  formContainer: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  avatarSection: {
    alignItems: 'center',
  },
  defaultAvatarContainer: {
    position: 'relative',
  },
  uploadButtonContainer: {
    position: 'absolute',
    right: '5%',
    bottom: '3%',
    transform: [
      { translateX: 0 }, // Radio / 2
      { translateY: 0 }, // Radio / 2
    ],
  },
  presetAvatarsContainer: {
    width: '100%',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  separatorContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  separatorText: {
    color: Colors.gray[400],
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 