import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { FONT_FAMILIES } from '../../../constants/Fonts';

interface PostDescriptionProps {
  description: string;
}

export const PostDescription: React.FC<PostDescriptionProps> = ({
  description,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: FONT_FAMILIES.regular,
    color: Colors.white,
    lineHeight: 20,
  },
}); 