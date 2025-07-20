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
import { useProfile } from '../../contexts/ProfileContext';
import { useNavigation } from '../../navigation/useNavigation';
import { updateUserProfile } from '../../utils/userActions';
import { DefaultAvatar } from '../ui/Avatar/DefaultAvatar';
import { ResizingButton } from '../ui/buttons/ResizingButton';
import { TextInput } from '../ui/forms/TextInput';
import { GlobalHeader } from '../ui/headers/GlobalHeader';
import { Layout } from '../ui/layout/Layout';
import { AppText } from '../ui/Text/AppText';

export const EditProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const bioInputRef = useRef(null);
    const { profile, isLoading: userLoading, updateProfile, refetch } = useProfile();
  
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
    if (!profile) return;

    const isNameValid = validateName(name);
    const isUsernameValid = validateUsername(username);

    if (!isNameValid || !isUsernameValid) {
      return;
    }

    setIsLoading(true);

    try {

      // Usar la función de userActions
      await updateUserProfile(profile.id, {
        username: username.trim(),
        display_name: name.trim(),
       // avatar_url: avatarUrl || undefined,
        bio: bio,
      });

      // Refetch del perfil para actualizar el contexto
      await refetch();

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
  }, [profile, name, username, selectedAvatar, bio, navigation, validateName, validateUsername]);

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

  // Cargar datos del perfil desde el contexto
  useEffect(() => {
    if (profile) {
      setName(profile.display_name || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setSelectedAvatar(profile.avatar_url || 'default_avatar');
    }
  }, [profile]);

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
  if (userLoading || !profile) {
    return (
      <Layout>
        <View style={[styles.container, styles.loadingContainer]}>
          <GlobalHeader 
          goBack={true} onLeftIconPress={handleBackPress} 
          centerContent={<AppText variant='h4' fontFamily='raleway' fontWeight='bold' color="#fff">Editar perfil</AppText>} 
          />
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      </Layout>
    );
  }

  // Verificar si hubo cambios
  const getCurrentAvatarUrl = () => {
    if (selectedAvatar === 'default_avatar') {
      return 'default_avatar';
    }
    
    // Si es una URL válida, devolverla tal cual
    if (typeof selectedAvatar === 'string' && (selectedAvatar.startsWith('http://') || selectedAvatar.startsWith('https://'))) {
      return selectedAvatar;
    }
    
    // Si es un nombre de archivo de avatar predefinido, devolverlo tal cual
    const presetAvatarNames = [
      'profileicon1.png',
      'profileicon2.png', 
      'profileicon6.png',
      'profileicon4.png',
      'profileicon5.png'
    ];
    
    if (presetAvatarNames.includes(selectedAvatar)) {
      return selectedAvatar;
    }
    
    return 'default_avatar';
  };

  const hasChanges = 
    name !== (profile?.display_name || '') ||
    username !== (profile?.username || '') ||
    bio !== (profile?.bio || '') ||
    getCurrentAvatarUrl() !== (profile?.avatar_url || 'default_avatar');

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
                  readOnly={true}
                  onReadOnlyPress={() => {
                    navigation.navigate('EditProfileElement', {
                      field: 'name',
                      currentValue: name,
                      title: 'Editar nombre'
                    });
                  }}
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
                  readOnly={true}
                  onReadOnlyPress={() => {
                    navigation.navigate('EditProfileElement', {
                      field: 'username',
                      currentValue: username,
                      title: 'Editar nombre de usuario'
                    });
                  }}
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
                  numberOfLines={4}
                  inputHeight={112}
                  readOnly={true}
                  onReadOnlyPress={() => {
                    navigation.navigate('EditProfileElement', {
                      field: 'bio',
                      currentValue: bio,
                      title: 'Editar biografía'
                    });
                  }}
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
    gap: 20,
    marginTop: 8,
  },
  buttonContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 32,
  },
}); 