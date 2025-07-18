import React from 'react';
import { Button, Keyboard, KeyboardAvoidingView, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native';


export const KeyboardAvoidScreen = () => {
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>

          <TextInput placeholder="Username" style={styles.textInput} />
          <View style={styles.btnContainer}>

            <TextInput placeholder="Username" style={styles.textInput} />
            <TextInput placeholder="Username" style={styles.textInput} />
            <TextInput placeholder="Username" style={styles.textInput} />
            <Button title="Submit" onPress={() => null} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});
export default KeyboardAvoidScreen;
