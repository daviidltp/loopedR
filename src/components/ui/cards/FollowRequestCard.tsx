import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import verifiedBlue from '../../../../assets/icons/verified_blue.png';
import { Colors } from '../../../constants/Colors';
import { FollowRequest, getUserById } from '../../../utils/mockData';
import { DefaultAvatar } from '../Avatar/DefaultAvatar';
import { AppText } from '../Text/AppText';
import { ResizingButton } from '../buttons/ResizingButton';

interface FollowRequestCardProps {
  request: FollowRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export const FollowRequestCard: React.FC<FollowRequestCardProps> = ({
  request,
  onAccept,
  onReject,
}) => {
  const user = getUserById(request.fromUserId);

  if (!user) return null;

  const content = (
    <View style={styles.container}>
      {/* Avatar circular */}
      <DefaultAvatar
        name={user.displayName}
        size={52}
        avatarUrl={user.avatarUrl}
        showUploadButton={false}
      />

      {/* Información del usuario */}
      <View style={styles.userInfo}>
        <View style={styles.usernameRow}>
          <AppText 
            variant='bodySmall'
            fontFamily="inter" 
            fontWeight="semiBold" 
            color={Colors.white}
            numberOfLines={1}
          >
            {user.username}
          </AppText>
          {user.isVerified && (
            <Image 
              source={verifiedBlue} 
              style={styles.verifiedIcon}
            />
          )}
        </View>
        
        <AppText 
          variant='bodySmall'
          fontFamily="inter" 
          fontWeight="regular" 
          color={Colors.mutedWhite}
          numberOfLines={1}
        >
          {user.displayName}
        </AppText>
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonWrapper}>
          <ResizingButton
            title="Aceptar"
            onPress={() => onAccept(request.id)}
            textColor={Colors.white}
            backgroundColor={Colors.secondaryGreen}
            height={32}
            width={100} // Ancho fijo para el botón de aceptar
          />
        </View>
        <View style={styles.buttonWrapper}>
          <IconButton
            icon="close"
            size={22}
            onPress={() => onReject(request.id)}
            iconColor={Colors.white}
            style={{ backgroundColor: Colors.background, borderRadius: 20 }}
            accessibilityLabel="Rechazar solicitud"
          />
        </View>
      </View>
    </View>
  );

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16, // Reducido de 24 a 16 para acercar los botones al borde
    backgroundColor: Colors.background,
    minHeight: 80, // Altura mínima para dar más espacio
    justifyContent: 'space-between',
  },

  userInfo: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 0, // Padding adicional para evitar que el texto se pegue a los botones
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    marginRight: 32, // Padding adicional para evitar que el texto se pegue a los botones
  },
  verifiedIcon: {
    width: 18,
    height: 18,
    marginLeft: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
  },
  buttonWrapper: {
    // Sin ancho fijo para que los botones se ajusten a su contenido
  },
}); 