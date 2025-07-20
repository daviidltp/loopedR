import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Keyboard,
  Platform,
  ScrollView,
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
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { DefaultAvatar } from '../ui/Avatar/DefaultAvatar';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { TextInput } from '../ui/forms/TextInput';
import { GlobalHeader } from '../ui/headers/GlobalHeader';
import { Layout } from '../ui/layout/Layout';
import { AppText } from '../ui/Text/AppText';

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const bioInputRef = useRef(null);
  const { currentUser, isLoading: userLoading } = useCurrentUser();
  const { setUserProfileData } = useAuth();
  
  // Estados del formulario
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  
  // Estados de validación
  const [nameError, setNameError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Avatar states
  const [selectedAvatar, setSelectedAvatar] = useState<string>('default_avatar');

  // Inicializar datos cuando se carga el usuario
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName);
      setUsername(currentUser.username);
      setBio(currentUser.bio || '');
      setSelectedAvatar(currentUser.avatarUrl || 'default_avatar');
    }
  }, [currentUser]);

  // Animaciones
  const buttonBottom = useSharedValue(20);

  // Validaciones
  const validateName = useCallback((value: string) => {
    if (!value.trim()) {
      setNameError('El nombre es requerido');
      return false;
    }

    if (value.length < 2) {
      setNameError('El nombre debe tener al menos 2 caracteres');
      return false;
    }

    if (value.length > 50) {
      setNameError('El nombre debe tener máximo 50 caracteres');
      return false;
    }

    setNameError('');
    return true;
  }, []);

  const validateUsername = useCallback((value: string) => {
    if (!value.trim()) {
      setUsernameError('El nombre de usuario es requerido');
      return false;
    }

    if (value.length < 2) {
      setUsernameError('El nombre de usuario debe tener al menos 2 caracteres');
      return false;
    }

    if (value.length > 30) {
      setUsernameError('El nombre de usuario debe tener máximo 30 caracteres');
      return false;
    }

    if (!/^[a-zA-Z0-9._]+$/.test(value)) {
      setUsernameError('Solo se permiten letras, números, puntos y guiones bajos');
      return false;
    }

    setUsernameError('');
    return true;
  }, []);

  // Handlers
  const handleNameChange = useCallback((value: string) => {
    setName(value);
    if (nameError) {
      validateName(value);
    }
  }, [nameError, validateName]);

  const handleUsernameChange = useCallback((value: string) => {
    const cleanValue = value.toLowerCase().replace(/[^a-zA-Z0-9._]/g, '');
    setUsername(cleanValue);
    if (usernameError) {
      validateUsername(cleanValue);
    }
  }, [usernameError, validateUsername]);

  const handleSave = useCallback(async () => {
    if (!currentUser) return;

    const isNameValid = validateName(name);
    const isUsernameValid = validateUsername(username);

    if (!isNameValid || !isUsernameValid) {
      return;
    }

    setIsLoading(true);

    try {
      await setUserProfileData(
        username.trim(),
        name.trim(),
        selectedAvatar,
        bio
      );

      console.log('[EditProfile] Perfil actualizado correctamente');
      navigation.goBack();

    } catch (error) {
      console.error('[EditProfile] Error al actualizar perfil:', error);
      Alert.alert(
        'Error',
        'No se pudo actualizar el perfil. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentUser, name, username, selectedAvatar, bio, setUserProfileData, navigation, validateName, validateUsername]);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Efectos de teclado
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
        setIsKeyboardVisible(true);
        setKeyboardHeight(event.endCoordinates.height);
        buttonBottom.value = withTiming(
          event.endCoordinates.height + 20,
          { duration: 250, easing: Easing.bezier(0.25, 0.1, 0.25, 1.0) }
        );
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        setKeyboardHeight(0);
        buttonBottom.value = withTiming(
          20,
          { duration: 250, easing: Easing.bezier(0.6, 0.5, 0.25, 0.5) }
        );
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [buttonBottom]);

  // Efecto para manejar botón atrás de Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackPress();
      return true;
    });

    return () => backHandler.remove();
  }, [handleBackPress]);

  // Estilos animados
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      bottom: buttonBottom.value,
    };
  });

  // Mostrar loading mientras se cargan los datos del usuario
  if (userLoading || !currentUser) {
    return (
      <Layout>
        <View style={[styles.container, styles.loadingContainer]}>
          <GlobalHeader leftIcon={<ArrowLeftIcon size={28} color={Colors.white} />} onLeftIconPress={handleBackPress} centerContent={<AppText variant='h2' fontFamily='raleway' fontWeight='bold' color="#fff">looped</AppText>} />
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      </Layout>
    );
  }

  // Verificar si hubo cambios
  const hasChanges = 
    name !== currentUser.displayName ||
    username !== currentUser.username ||
    bio !== (currentUser.bio || '') ||
    selectedAvatar !== currentUser.avatarUrl;

  return (
    <Layout>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <GlobalHeader goBack={true} onLeftIconPress={handleBackPress} 
          centerContent={<AppText variant='h4' fontFamily='raleway' fontWeight='bold' color="#fff">Editar perfil</AppText>} 
          />
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <DefaultAvatar
                  name={name}
                  size={150}
                  avatarUrl={selectedAvatar}
                  showUploadButton={true}
                  uploadButtonSize={30}
                  onUploadPress={() => { console.log('upload') }}
                />
              </View>

              {/* Form Section */}
              <View style={styles.formSection}>
                <TextInput
                  label="Nombre"
                  value={name}
                  onChangeText={handleNameChange}
                  placeholder="Nombre"
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  error={nameError}
                  maxLength={50}
                />

                <TextInput
                  label="Nombre de usuario"
                  value={username}
                  onChangeText={handleUsernameChange}
                  placeholder="Nombre de usuario"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  error={usernameError}
                  maxLength={30}
                />

                <TextInput
                  label="Biografía"
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Biografía (opcional)"
                  maxLength={160}
                  autoCapitalize="sentences"
                  autoCorrect={true}
                  returnKeyType="done"
                  showCharacterCount={true}
                />
              </View>
            </View>
          </ScrollView>

          {/* Save Button */}
          <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
            <ResizingButton
              title="Guardar cambios"
              onPress={handleSave}
              backgroundColor={Colors.white}
              textColor={Colors.background}
              isLoading={isLoading}
              isDisabled={isLoading || !hasChanges}
              height={52}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 12,
  },
  uploadButtonOverlay: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    zIndex: 2,
  },
  formSection: {
    gap: 0,
    marginTop: 8,
  },
  buttonContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 32,
  },
}); 