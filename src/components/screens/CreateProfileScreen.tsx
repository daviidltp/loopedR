import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Keyboard,
    Platform,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/Colors';
import { useFonts } from '../../hooks/useFonts';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Layout } from '../ui/Layout';
import { ResizingButton } from '../ui/ResizingButton';
import { TextInput } from '../ui/TextInput';

type CreateProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateProfile'>;

interface CreateProfileScreenProps {
  navigation: CreateProfileScreenNavigationProp;
}

// Simulación de nombres de usuario existentes
const EXISTING_USERNAMES = ['user123', 'musiclover', 'dj_cool', 'playlist_master'];

export const CreateProfileScreen: React.FC<CreateProfileScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const fontsLoaded = useFonts();

  // Animaciones con react-native-reanimated
  const slideAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(1);
  const buttonBottom = useSharedValue(40);

  // Manejo del teclado
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
        buttonBottom.value = withTiming(e.endCoordinates.height + 40, {
          duration: 250,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1.0)
        });
      }
    );
    
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
        buttonBottom.value = withTiming(40, {
          duration: 250,
          easing: Easing.bezier(0.6, 0.5, 0.25, 0.5)
        });
      }
    );

    return () => {
      keyboardWillShowListener?.remove();
      keyboardWillHideListener?.remove();
    };
  }, []);

  // Función para cerrar el teclado
  const dismissKeyboard = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  // Validar disponibilidad del nombre de usuario
  const validateUsername = useCallback((value: string) => {
    if (!value.trim()) {
      setUsernameError('');
      return;
    }

    if (value.length < 3) {
      setUsernameError('El nombre de usuario debe tener al menos 3 caracteres');
      return;
    }

    if (EXISTING_USERNAMES.includes(value.toLowerCase())) {
      setUsernameError('Este nombre de usuario ya está en uso');
      return;
    }

    setUsernameError('');
  }, []);

  // Manejar cambio en el campo username
  const handleUsernameChange = useCallback((value: string) => {
    setUsername(value);
    validateUsername(value);
  }, [validateUsername]);

  // Verificar si el botón debe estar habilitado
  const isButtonEnabled = name.trim().length > 0 && username.trim().length >= 3 && !usernameError;

  // Manejar creación del perfil
  const handleCreateProfile = useCallback(async () => {
    if (!isButtonEnabled) return;

    setIsLoading(true);

    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));

      Alert.alert(
        '¡Perfil creado!',
        `Bienvenido ${name}! Tu perfil ha sido creado exitosamente.`,
        [
          {
            text: 'Continuar',
            onPress: () => {
              // Navegar a la aplicación principal
              navigation.replace('MainApp');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el perfil. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }, [isButtonEnabled, name]);

  // Estilos animados
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnim.value }],
    opacity: opacityAnim.value,
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    bottom: buttonBottom.value,
  }));

  return (
    <Layout excludeBottomSafeArea={true}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <Animated.View style={[styles.container, animatedContainerStyle]}>
          {/* Título */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Crea tu perfil</Text>
          </View>

          {/* Contenido principal */}
          <View style={styles.mainContent}>
            <View style={styles.formContainer}>
              <TextInput
                label="¿Cómo quieres que te llamemos?"
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre"
                maxLength={50}
                autoCapitalize="words"
                autoCorrect={false}
              />

              <TextInput
                label="Elige tu nombre de usuario"
                value={username}
                onChangeText={handleUsernameChange}
                placeholder="usuario123"
                maxLength={30}
                autoCapitalize="none"
                autoCorrect={false}
                error={usernameError}
                isValid={username.length >= 3 && !usernameError}
              />
            </View>
          </View>

          {/* Botón animado que sube con el teclado */}
          <Animated.View style={[styles.bottomSection, animatedButtonStyle]}>
            <ResizingButton
              onPress={handleCreateProfile}
              title="Continuar"
              backgroundColor={Colors.white}
              textColor={Colors.background}
              isDisabled={!isButtonEnabled}
              isLoading={isLoading}
            />
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Asegurar fondo negro
  },
  titleContainer: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: '300',
    fontFamily: 'Raleway-Bold',
    textAlign: 'center',
    letterSpacing: -1,
    color: Colors.white,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  formContainer: {
    marginTop: 20,
  },
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
}); 