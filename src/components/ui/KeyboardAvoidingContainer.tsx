import { useRef } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const KeyboardAvoidingContainer = ({ children }: { children: React.ReactNode }) => {
  
    const insets = useSafeAreaInsets();
    const scrollViewRef = useRef<ScrollView>(null);

    const handleInputFocus = (event: any) => {
      // Hacer scroll hacia el input cuando recibe focus
      scrollViewRef.current?.scrollTo({
        y: event.target.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          scrollViewRef.current?.scrollTo({ y: pageY - 100, animated: true });
        })
      });
    };
  
    return (
     
          <KeyboardAvoidingView
            style={{ flex: 1}}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={insets.top + 54 + 10}
          >
            <ScrollView
              ref={scrollViewRef}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainer}
            >
              {children}
            </ScrollView>
          </KeyboardAvoidingView>

    );
  };

export default KeyboardAvoidingContainer;

const styles = StyleSheet.create({
    contentContainer: {
      padding: 20,
      flexGrow: 1, // Permite que el contenido crezca
    },
});