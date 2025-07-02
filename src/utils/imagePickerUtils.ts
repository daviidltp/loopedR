import { PermissionsAndroid, Platform } from 'react-native';
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';

const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Permiso de cámara',
          message: 'Necesitamos acceso a tu cámara para tomar fotos.',
          buttonNeutral: 'Pregúntame luego',
          buttonNegative: 'Cancelar',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

export const pickImage = async (
  type: 'camera' | 'gallery' = 'gallery'
): Promise<ImagePickerResponse> => {
  if (type === 'camera') {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      throw new Error('No se otorgaron los permisos de cámara');
    }
    return launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    });
  }

  return launchImageLibrary({
    mediaType: 'photo',
    quality: 0.8,
    selectionLimit: 1,
  });
}; 