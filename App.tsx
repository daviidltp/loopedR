import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from './src/components';

export default function App() {
  return (
    <SafeAreaProvider>
      <WelcomeScreen />
    </SafeAreaProvider>
  );
}
