import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../ui/layout/Layout';

export const UploadScreen: React.FC = () => {
  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Subir Publicación</Text>
          <Text style={styles.subtitle}>Comparte tu música con la comunidad</Text>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
    fontFamily: 'Raleway-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[400],
    textAlign: 'center',
    fontFamily: 'Raleway-Regular',
  },
}); 