import { useState } from 'react';
import { Alert } from 'react-native';
import { Asset } from 'react-native-image-picker';
import { pickImage } from '../utils/imagePickerUtils';

interface UseImagePickerResult {
  selectedImage: Asset | null;
  isLoading: boolean;
  handleSelectImage: () => Promise<void>;
  handleTakePhoto: () => Promise<void>;
}

export const useImagePicker = (): UseImagePickerResult => {
  const [selectedImage, setSelectedImage] = useState<Asset | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageSelection = async (type: 'camera' | 'gallery') => {
    try {
      setIsLoading(true);
      const response = await pickImage(type);
      
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        Alert.alert(
          'Error',
          'Hubo un problema al seleccionar la imagen. Por favor, intenta de nuevo.'
        );
        return;
      }

      if (response.assets && response.assets[0]) {
        setSelectedImage(response.assets[0]);
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error al seleccionar la imagen'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectImage = async () => {
    await handleImageSelection('gallery');
  };

  const handleTakePhoto = async () => {
    await handleImageSelection('camera');
  };

  return {
    selectedImage,
    isLoading,
    handleSelectImage,
    handleTakePhoto,
  };
}; 