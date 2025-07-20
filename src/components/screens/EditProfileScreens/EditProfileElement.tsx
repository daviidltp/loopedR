import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
import { Colors } from '../../../constants/Colors';
import { useProfile } from '../../../contexts/ProfileContext';
import { updateUserProfile } from '../../../utils/userActions';
import { ResizingButton } from '../../ui/buttons/ResizingButton';
import { TextInput } from '../../ui/forms/TextInput';
import { GlobalHeader } from '../../ui/headers/GlobalHeader';
import { Layout } from '../../ui/layout/Layout';
import { ConfirmationDialog } from '../../ui/modals/ConfirmationDialog';
import { AppText } from '../../ui/Text/AppText';

type RouteParams = {
  field: 'name' | 'username' | 'bio';
  currentValue: string;
  title: string;
};

export const EditProfileElement: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { field, currentValue, title } = route.params as RouteParams;
  const { profile, refetch } = useProfile();
  
  // Estados del formulario
  const [value, setValue] = useState(currentValue);
  const [error, setError] = useState('');
  
  // Estados de UI
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  // Verificar si hubo cambios
  const hasChanges = value !== currentValue;

  // Animaciones
  const buttonBottom = useSharedValue(20);

  // Validaciones
  const validateName = useCallback((value: string) => {
    if (!value.trim()) {
      setError('El nombre es requerido');
      return false;
    }

    if (value.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return false;
    }

    if (value.length > 50) {
      setError('El nombre debe tener máximo 50 caracteres');
      return false;
    }

    setError('');
    return true;
  }, []);

  const validateUsername = useCallback((value: string) => {
    if (!value.trim()) {
      setError('El nombre de usuario es requerido');
      return false;
    }

    if (value.length < 2) {
      setError('El nombre de usuario debe tener al menos 2 caracteres');
      return false;
    }

    if (value.length > 30) {
      setError('El nombre de usuario debe tener máximo 30 caracteres');
      return false;
    }

    if (!/^[a-zA-Z0-9._]+$/.test(value)) {
      setError('Solo se permiten letras, números, puntos y guiones bajos');
      return false;
    }

    setError('');
    return true;
  }, []);

  const validateBio = useCallback((value: string) => {
    if (value.length > 160) {
      setError('La biografía debe tener máximo 160 caracteres');
      return false;
    }

    setError('');
    return true;
  }, []);

  // Handlers
  const handleValueChange = useCallback((newValue: string) => {
    setValue(newValue);
    
    // Validar en tiempo real
    if (field === 'name') {
      validateName(newValue);
    } else if (field === 'username') {
      // No limpiar automáticamente, solo validar
      validateUsername(newValue);
    } else if (field === 'bio') {
      validateBio(newValue);
    }
  }, [field, validateName, validateUsername, validateBio]);

  const handleSave = useCallback(async () => {
    if (!profile) return;

    let isValid = false;
    
    if (field === 'name') {
      isValid = validateName(value);
    } else if (field === 'username') {
      isValid = validateUsername(value);
    } else if (field === 'bio') {
      isValid = validateBio(value);
    }

    if (!isValid) {
      return;
    }

    setIsLoading(true);

    try {
      const updateFields: any = {};
      
      if (field === 'name') {
        updateFields.display_name = value.trim();
      } else if (field === 'username') {
        updateFields.username = value.trim();
      } else if (field === 'bio') {
        updateFields.bio = value.trim();
      }

      await updateUserProfile(profile.id, updateFields);
      await refetch();

      console.log(`[EditProfileElement] ${field} actualizado correctamente`);
      navigation.goBack();

    } catch (error) {
      console.error(`[EditProfileElement] Error al actualizar ${field}:`, error);
      Alert.alert(
        'Error',
        `No se pudo actualizar el ${field}. Inténtalo de nuevo.`,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [profile, field, value, validateName, validateUsername, validateBio, updateUserProfile, refetch, navigation]);

  const handleBackPress = useCallback(() => {
    if (hasChanges) {
      setShowDiscardDialog(true);
    } else {
      navigation.goBack();
    }
  }, [navigation, hasChanges]);

  const handleConfirmDiscard = useCallback(() => {
    setShowDiscardDialog(false);
    // Usar setTimeout para esperar a que termine la animación del diálogo
    setTimeout(() => {
      navigation.goBack();
    }, 300); // Duración de la animación de salida del diálogo
  }, [navigation]);

  const handleCancelDiscard = useCallback(() => {
    setShowDiscardDialog(false);
  }, []);

  // Efectos de teclado
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (event) => {
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

  // Configuración específica por campo
  const getFieldConfig = (): {
    label: string;
    placeholder: string;
    description: React.ReactNode[];
    maxLength: number;
    autoCapitalize: 'words' | 'none' | 'sentences';
    autoCorrect: boolean;
    returnKeyType: 'done';
    multiline?: boolean;
    numberOfLines?: number;
    inputHeight?: number;
    showCharacterCount?: boolean;
  } => {
    switch (field) {
              case 'name':
          return {
            label: 'Nombre',
            placeholder: 'Tu nombre completo',
            description: [
              <AppText variant='bodySmall' fontFamily='inter' color={Colors.mutedWhite}>
                Este es el nombre que verán otros usuarios.{' '}
                <AppText variant='bodySmall' fontFamily='inter' color={Colors.white} fontWeight='medium'>
                  Puede ser tu nombre real o un nombre artístico.
                </AppText>
              </AppText>
            ],
            maxLength: 50,
            autoCapitalize: 'words' as const,
            autoCorrect: false,
            returnKeyType: 'done' as const,
          };
              case 'username':
          return {
            label: 'Nombre de usuario',
            placeholder: 'nombre_usuario',
            description: [
              <AppText variant='bodySmall' fontFamily='inter' color={Colors.mutedWhite}>
                Tu nombre de usuario único.{' '}
                <AppText variant='bodySmall' fontFamily='inter' color={Colors.white}>
                  Solo puedes cambiarlo 3 veces en total.
                </AppText>
              </AppText>,
            <AppText variant='bodySmall' fontFamily='inter' color={Colors.mutedWhite}>
                {`¿Quieres cambiarlo más veces? `}
                <AppText variant='bodySmall' fontFamily='inter' textDecorationLine='underline' color={Colors.secondaryGreen}>
                 {`looped+`}
                </AppText>
            </AppText>
              
            ],
            maxLength: 30,
            autoCapitalize: 'none' as const,
            autoCorrect: false,
            returnKeyType: 'done' as const,
          };
              case 'bio':
          return {
            label: 'Biografía',
            placeholder: 'Cuéntanos sobre ti...',
            description: [
              <AppText variant='bodySmall' fontFamily='inter' color={Colors.mutedWhite}>
                Comparte algo sobre ti, tu música, tus intereses{' '}
                <AppText variant='bodySmall' fontFamily='inter' color={Colors.white} fontWeight='medium'>
                  o cualquier cosa que quieras que otros usuarios sepan.
                </AppText>
              </AppText>
            ],
            maxLength: 50,
            autoCapitalize: 'sentences' as const,
            autoCorrect: true,
            returnKeyType: 'done' as const,
            multiline: true,
            numberOfLines: 4,
            inputHeight: 112,
            showCharacterCount: true,
          };
              default:
          return {
            label: '',
            placeholder: '',
            description: [],
            maxLength: 50,
            autoCapitalize: 'none',
            autoCorrect: false,
            returnKeyType: 'done',
          };
    }
  };

  const fieldConfig = getFieldConfig();

  // Mostrar loading mientras se cargan los datos del usuario
  if (!profile) {
    return (
      <Layout>
        <View style={[styles.container, styles.loadingContainer]}>
          <GlobalHeader 
            goBack={true} 
            goBackIcon='close'
            onLeftIconPress={handleBackPress} 
            centerContent={<AppText variant='h4' fontFamily='raleway' fontWeight='bold' color="#fff">{title}</AppText>} 
          />
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <GlobalHeader 
            goBack={true} 
            goBackIcon='close'
            onLeftIconPress={handleBackPress} 
            centerContent={<AppText variant='h4' fontFamily='raleway' fontWeight='bold' color="#fff">{title}</AppText>} 
          />
          
          <View style={styles.content}>
            <TextInput
              label={fieldConfig.label}
              value={value}
              onChangeText={handleValueChange}
              placeholder={fieldConfig.placeholder}
              autoCapitalize={fieldConfig.autoCapitalize}
              autoCorrect={fieldConfig.autoCorrect}
              returnKeyType={fieldConfig.returnKeyType}
              error={error}
              maxLength={fieldConfig.maxLength}
              multiline={fieldConfig.multiline}
              numberOfLines={fieldConfig.numberOfLines}
              inputHeight={fieldConfig.inputHeight}
              showCharacterCount={fieldConfig.showCharacterCount}
            />

            <View style={styles.descriptionContainer}>
              {fieldConfig.description.map((item, index) => (
                <View key={index}>
                  <AppText variant='bodySmall' fontFamily='inter' color={Colors.mutedWhite}>
                    {item}
                  </AppText>
                  <View style={{height: 10}} />
                </View>
              ))}
            </View>
          </View>
          
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

      <ConfirmationDialog
        visible={showDiscardDialog}
        title="Descartar cambios"
        description="¿Estás seguro de que quieres salir sin guardar los cambios? Se perderán todas las modificaciones realizadas."
        onConfirm={handleConfirmDiscard}
        onCancel={handleCancelDiscard}
        confirmText="Descartar"
        cancelText="Cancelar"
      />
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
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    flex: 1,
    gap: 16
  },
  descriptionContainer: {
    paddingHorizontal: 4,
  },
  description: {
    lineHeight: 20,
  },
  buttonContainer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 32,
  },
});
