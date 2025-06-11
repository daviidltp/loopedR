import { useNavigation as useReactNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './AppNavigator';

export type NavigationProp = StackNavigationProp<RootStackParamList>;

export const useNavigation = () => useReactNavigation<NavigationProp>(); 