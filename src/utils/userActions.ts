import { deleteUserAccount, signOutUser } from './supabase';

/**
 * Lógica modular para cerrar sesión, con control de estado y feedback visual.
 * Recibe un setter para el estado de loading.
 */
export const handleLogout = async (
  isLoggingOut: boolean,
  setIsLoggingOut: (val: boolean) => void
) => {
  if (isLoggingOut) {
    console.log('Logout already in progress, ignoring duplicate request');
    return;
  }
  try {
    setIsLoggingOut(true);
    console.log('Initiating logout sequence');
    await signOutUser();
    console.log('Logout sequence completed successfully');
  } catch (error) {
    console.error('Error during logout sequence:', error);
  } finally {
    setTimeout(() => {
      setIsLoggingOut(false);
    }, 1000);
  }
};

/**
 * Lógica modular para eliminar la cuenta del usuario.
 */
export const handleDeleteAccount = async () => {
  try {
    await deleteUserAccount();
    console.log('Cuenta eliminada correctamente');
  } catch (error) {
    console.error('Error al eliminar la cuenta:', error);
  }
}; 