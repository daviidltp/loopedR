import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const ONBOARDING_COMPLETED_KEY = '@loopedr_onboarding_completed';

export const useOnboardingStatus = () => {
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar el estado de onboarding al iniciar
  useEffect(() => {
    const loadOnboardingStatus = async () => {
      try {
        const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        const isCompleted = completed === 'true';
        setIsOnboardingCompleted(isCompleted);
      } catch (error) {
        console.error('[useOnboardingStatus] Error cargando estado de onboarding:', error);
        setIsOnboardingCompleted(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadOnboardingStatus();
  }, []);

  // Marcar onboarding como completado
  const markOnboardingCompleted = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      setIsOnboardingCompleted(true);
    } catch (error) {
      console.error('[useOnboardingStatus] Error marcando onboarding como completado:', error);
    }
  }, []);

  // Resetear estado de onboarding (útil para logout)
  const resetOnboardingStatus = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
      setIsOnboardingCompleted(false);
    } catch (error) {
      console.error('[useOnboardingStatus] Error reseteando estado de onboarding:', error);
    }
  }, []);

  return {
    isOnboardingCompleted,
    isLoading,
    markOnboardingCompleted,
    resetOnboardingStatus,
  };
}; 