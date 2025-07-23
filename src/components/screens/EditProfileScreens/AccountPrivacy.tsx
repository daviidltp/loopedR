import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useProfile } from '../../../contexts/ProfileContext';
import { PlatformTouchable } from '../../ui/buttons/PlatformTouchable';
import { CustomSwitch } from '../../ui/forms/CustomSwitch';
import { GlobalHeader } from '../../ui/headers/GlobalHeader';
import { Layout } from '../../ui/layout';
import { AppText } from '../../ui/Text/AppText';

export const AccountPrivacy = () => {
  const navigation = useNavigation();
  const {profile, updateProfile, refetch } = useProfile();
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Sincroniza el estado local con el valor real del perfil
  useEffect(() => {
    if (profile && typeof profile.is_public === 'boolean') {
      setIsPublic(profile.is_public);
    }
  }, [profile]);

  const handleToggle = async (value: boolean) => {
    setIsLoading(true);
    setIsPublic(value);
    try {
      if (profile) {
        await updateProfile({ is_public: value });
        await refetch();
      }
    } catch (error) {
      // Si hay error, revertimos el valor local
      setIsPublic(!value);
      // Aquí podrías mostrar un toast o alerta
      console.error('Error al actualizar privacidad:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <GlobalHeader
          goBack={true}
          onLeftIconPress={() => navigation.goBack()}
          centerContent={
            <AppText variant="h4" fontFamily="raleway" fontWeight="bold" color="#fff">
              Privacidad de la cuenta
            </AppText>
          }
        />
        <PlatformTouchable
          onPress={() => handleToggle(!isPublic)}
          rippleColor={Colors.gray[700]}
          disabled={isLoading}
          style={styles.touchableContainer}
        >
          <View style={styles.row}>
            <AppText variant="bodyLarge" fontFamily="inter" color="#fff" fontWeight='semiBold'>
              Cuenta pública
            </AppText>
            <CustomSwitch
                value={isPublic}
                onValueChange={handleToggle}
                disabled={isLoading}
            />
          </View>
        </PlatformTouchable>
        <View style={styles.explanationContainer}>
        <AppText variant='bodySmall' fontFamily='inter' color={Colors.mutedWhite}>
            Cuando tu cuenta es pública, <AppText variant='bodySmall' fontFamily='inter' color={Colors.white} fontWeight='medium'>cualquier persona</AppText> podrá ver tus publicaciones, comentar y seguirte. 
            Si cambias de una cuenta privada a pública, {''}
              <AppText variant='bodySmall' fontFamily='inter' color={Colors.white} fontWeight='medium'>
                se aprobarán todas las solicitudes de seguimiento que tengas pendientes.
              </AppText>
          </AppText>
          <AppText variant='bodySmall' fontFamily='inter' color={Colors.mutedWhite}>
            Cuando tu cuenta es privada, solo las personas que apruebes podrán ver tus publicaciones. {''}
            <AppText variant='bodySmall' fontFamily='inter' color={Colors.white} fontWeight='medium'>
              Tus seguidores actuales no se verán afectados.
            </AppText>
          </AppText>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  touchableContainer: {
    justifyContent: 'center', // Centra verticalmente el contenido
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    paddingVertical: 32,
  },
  explanationContainer: {
    marginHorizontal: 24,
    marginTop: 0,
    gap: 16,
  },
});

export default AccountPrivacy;
