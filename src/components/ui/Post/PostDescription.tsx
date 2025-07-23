import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { AppText } from '../Text';

interface PostDescriptionProps {
  description: string;
}

// Función para dividir el texto en partes y detectar menciones
function renderDescriptionWithMentions(description: string) {
  // Expresión regular: palabras que empiezan con @ seguidas de letras, números, guion bajo o punto
  const mentionRegex = /(@[\w.]+)/g;
  const parts = description.split(mentionRegex);


  return parts.map((part, idx) => {
    if (mentionRegex.test(part)) {
      // Es una mención
      return (
        <AppText
          key={idx}
          variant='body'
          fontFamily='inter'
          fontWeight='bold'
          color={Colors.secondaryGreen}
          lineHeight={22}
        >
          {part}
        </AppText>
      );
    } else {
      // Texto normal
      return (
        <AppText
          key={idx}
          variant='body'
          fontFamily='inter'
          fontWeight='regular'
          color={Colors.white}
          lineHeight={20}
        >
          {part}
        </AppText>
      );
    }
  });
}

export const PostDescription: React.FC<PostDescriptionProps> = ({
  description,
}) => {
  return (
    <View style={styles.container}>
      <AppText variant='body' fontFamily='inter' fontWeight='regular' lineHeight={20} color={Colors.white}>
        {renderDescriptionWithMentions(description)}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
}); 