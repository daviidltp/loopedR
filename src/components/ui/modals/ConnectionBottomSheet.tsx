import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../../constants/Colors';
import { AppleMusicIcon } from '../../icons/AppleMusicIcon';
import { SpotifyIcon } from '../../icons/SpotifyIcon';
import { ResizingButton } from '../buttons/ResizingButton';
import { AppText } from '../Text';

// Componente de fondo personalizado para redondear bordes
const BottomSheetBackground = ({ style }: any) => (
  <View
    style={[
      style,
      {
        backgroundColor: Colors.backgroundSoft,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
      },
    ]}
  />
);

export interface ConnectionBottomSheetRef {
  expand: () => void;
  close: () => void;
}

interface ConnectionBottomSheetProps {
  onConnectSpotify: () => void;
  onConnectAppleMusic: () => void;
  onShowSkipAlert: () => void;
}

export const ConnectionBottomSheet = forwardRef<ConnectionBottomSheetRef, ConnectionBottomSheetProps>(
  ({ onConnectSpotify, onConnectAppleMusic, onShowSkipAlert }, ref) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const insets = useSafeAreaInsets();

    const snapPoints = useMemo(() => ['32%'], []);

    const handleCloseSheet = useCallback(() => {
      bottomSheetRef.current?.close();
    }, []);

    // Componente backdrop para cerrar solo al tocar fuera
    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
          onPress={handleCloseSheet}
          pressBehavior="close"
        />
      ),
      [handleCloseSheet]
    );

    const handleSkipConnection = useCallback(() => {
      onShowSkipAlert();
    }, [onShowSkipAlert]);

    const handleConnectSpotifyWrapper = useCallback(() => {
      handleCloseSheet();
      onConnectSpotify();
    }, [handleCloseSheet, onConnectSpotify]);

    const handleConnectAppleMusicWrapper = useCallback(() => {
      handleCloseSheet();
      onConnectAppleMusic();
    }, [handleCloseSheet, onConnectAppleMusic]);

    useImperativeHandle(ref, () => ({
      expand: () => {
        bottomSheetRef.current?.expand();
      },
      close: () => {
        handleCloseSheet();
      },
    }));

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableContentPanningGesture={true}
        enableHandlePanningGesture={false}
        detached={true}
        backgroundComponent={props => <BottomSheetBackground {...props} />}
        onClose={handleCloseSheet}
        enableOverDrag={false}
        handleIndicatorStyle={{display: 'none'}}
        backdropComponent={renderBackdrop}
        enableDynamicSizing={false}
      >
        <BottomSheetView style={styles.sheetContent}>
          {/* Texto descriptivo arriba de los botones */}
          <AppText variant="h3" color={Colors.white} style={styles.sheetTitle} numberOfLines={2}>
            Vincula Looped con tu plataforma favorita
          </AppText>
          
          <View style={styles.buttonsContainer}>
            {/* Botones de conexión con gap de 10 */}
            <View style={styles.connectionButtonsContainer}>
              <ResizingButton
                onPress={handleConnectSpotifyWrapper}
                title="Conectar con Spotify"
                icon={<SpotifyIcon size={24} color={Colors.white} />}
                backgroundColor={Colors.backgroundUltraSoft}
                textColor={Colors.white}
              />
              
              <ResizingButton
                onPress={handleConnectAppleMusicWrapper}
                title="Conectar con Apple Music"
                icon={<AppleMusicIcon size={24} color={Colors.white} />}
                backgroundColor={Colors.backgroundUltraSoft}
                textColor={Colors.white}
                isDisabled={true}
              />
            </View>

            {/* Descomenta la sección de abajo para agregar el botón de "Seguir sin vinculación" */}
            {/*
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <ResizingButton
              onPress={handleSkipConnection}
              title="Seguir sin vinculación"
              backgroundColor={Colors.backgroundSoft}
              textColor={Colors.white}
            />
            */}
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 0,
    paddingTop: 0,
    top: 0,
  },
  sheetTitle: {
    fontSize: 24,
    paddingHorizontal: 0,
    lineHeight: 28,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 0,
  },
  connectionButtonsContainer: {
    width: '100%',
    gap: 10,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    paddingHorizontal: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.white,
    opacity: 0.3,
  },
  dividerText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 16,
    opacity: 0.7,
  },
}); 