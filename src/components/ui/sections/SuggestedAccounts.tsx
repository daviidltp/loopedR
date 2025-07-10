import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { User } from '../../../utils/mockData';
import { UserCard } from '../cards';
import { AppText } from '../Text/AppText';

interface SuggestedAccountsProps {
  users: User[];
  onFollowPress: (userId: string) => void;
}

export const SuggestedAccounts: React.FC<SuggestedAccountsProps> = ({
  users,
  onFollowPress,
}) => {
  const renderUserCards = (): React.ReactElement[] => {
    const cards: React.ReactElement[] = [];
    
    users.forEach((user, index) => {
      // Agregar UserCard
      cards.push(
        <UserCard
          key={user.id}
          user={user}
          onFollowPress={onFollowPress}
        />
      );
      
      // Agregar espacio entre cards (excepto después de la última)
      if (index < users.length - 1) {
        cards.push(
          <View 
            key={`space-${user.id}`} 
            style={styles.cardSpacer} 
          />
        );
      }
    });
    
    return cards;
  };

  return (
    <View style={styles.suggestedSection}>
      <View style={styles.sectionTitleContainer}>
        <AppText 
          fontSize={16} 
          fontFamily='inter' 
          fontWeight='semiBold' 
          color="#888"
          style={styles.sectionTitle}
        >
          Cuentas sugeridas
        </AppText>
      </View>
      
      <View style={styles.scrollContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.suggestedScroll}
          contentContainerStyle={styles.suggestedScrollContent}
          scrollEventThrottle={16}
          decelerationRate="normal"
          bounces={true}
          directionalLockEnabled={true}
          nestedScrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.initialSpace} />
          
          {renderUserCards()}
          
          <View style={styles.finalSpace} />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  suggestedSection: {
    marginTop: 64,
    minHeight: 300, // Altura mínima para la sección de sugeridos
  },
  sectionTitleContainer: {
    paddingHorizontal: 0,
    marginBottom: 16,
  },
  sectionTitle: {
    // Sin margin adicional
  },
  scrollContainer: {
    height: 280, // Altura fija para el scroll horizontal
  },
  suggestedScroll: {
    flex: 1,
    marginHorizontal: -24, // Compensar el padding del container padre
  },
  suggestedScrollContent: {
    paddingVertical: 0,
  },
  initialSpace: {
    width: 24, // Espacio inicial
    height: 260,
  },
  cardSpacer: {
    width: 12, // Espacio reducido entre cards
    height: 260,
  },
  finalSpace: {
    width: 24, // Espacio final reducido
    height: 260,
  },
}); 