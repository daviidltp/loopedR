import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useFollowers } from '../../contexts/FollowersContext';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { convertSupabaseUserToUser } from '../../utils/userActions';
import { DeleteUserIcon } from '../icons/DeleteUserIcon';
import { FollowRequestCard } from '../ui/cards/FollowRequestCard';
import { GlobalHeader } from '../ui/headers/GlobalHeader';
import { Layout } from '../ui/layout/Layout';
import { AppText } from '../ui/Text/AppText';

export const FollowRequestsScreen: React.FC = () => {
  const { followRequests, acceptFollowRequest, rejectFollowRequest } = useFollowers();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Estado local para las solicitudes
  const [localRequests, setLocalRequests] = useState<any[]>([]);

  // Sincroniza el estado local cuando cambian las solicitudes globales
  useEffect(() => {
    setLocalRequests(
      followRequests.map(req => ({
        id: req.id,
        fromUserId: req.follower_id,
        toUserId: req.following_id,
        timestamp: new Date(req.created_at).getTime(),
        user: req.follower_profile,
      }))
    );
  }, [followRequests]);

  const handleUserPress = (userId: string, userData: any) => {
    const user = convertSupabaseUserToUser(userData);
    navigation.navigate('UserProfile', { userId, userData: user });
  };

  // Elimina la solicitud localmente y luego llama a la función de fondo
  const handleAccept = (id: string) => {
    setLocalRequests(prev => prev.filter(req => req.id !== id));
    acceptFollowRequest(id);
  };
  const handleReject = (id: string) => {
    setLocalRequests(prev => prev.filter(req => req.id !== id));
    rejectFollowRequest(id);
  };

  return (
    <Layout>
      <View style={styles.container}>
        {/* Header */}
        <GlobalHeader
          goBack={true}
          onLeftIconPress={() => navigation.goBack()}
          centerContent={<AppText variant='h4' fontFamily='raleway' fontWeight='bold' color="#fff">Solicitudes de seguimiento</AppText>}
        />

        {/* Lista de solicitudes */}
        {localRequests.length > 0 ? (
          <FlatList
            data={localRequests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FollowRequestCard
                request={item}
                onAccept={() => handleAccept(item.id)}
                onReject={() => handleReject(item.id)}
                onUserPress={handleUserPress}
              />
            )}
            style={styles.list}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <DeleteUserIcon
                size={80}
                color={Colors.mutedWhite}
              />
            </View>
            <AppText 
              variant="h6"
              fontFamily="inter" 
              fontWeight="bold" 
              style={styles.emptyText}
            >
              No tienes solicitudes de seguimiento
            </AppText>
            <AppText 
              variant='bodySmall'
              fontFamily="inter" 
              fontWeight="regular" 
              color={Colors.mutedWhite}
              style={styles.emptySubtext}
            >
              Te avisaremos cuando recibas una solicitud
            </AppText>
          </View>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
  },
}); 