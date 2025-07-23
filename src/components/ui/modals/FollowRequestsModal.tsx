import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import DeleteUserIcon from '../../../../assets/icons/delete-user.svg';
import { Colors } from '../../../constants/Colors';
import { useFollowers } from '../../../contexts/FollowersContext';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import { convertSupabaseUserToUser } from '../../../utils/userActions';
import { FollowRequestCard } from '../cards/FollowRequestCard';
import { GlobalHeader } from '../headers/GlobalHeader';
import { Layout } from '../layout';
import { AppText } from '../Text/AppText';

export const FollowRequestsModal: React.FC = () => {
  const { followRequests, acceptFollowRequest, rejectFollowRequest, isLoading } = useFollowers();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleUserPress = (userId: string, userData: any) => {
    const user = convertSupabaseUserToUser(userData);
    navigation.navigate('UserProfile', { userId, userData: user });
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
        {followRequests.length > 0 ? (
          <FlatList
            data={followRequests.map(req => ({
              id: req.id,
              fromUserId: req.follower_id,
              toUserId: req.following_id,
              timestamp: new Date(req.created_at).getTime(),
              user: req.follower_profile,
            }))}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FollowRequestCard
                request={item}
                onAccept={() => acceptFollowRequest(item.id)}
                onReject={() => rejectFollowRequest(item.id)}
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
                width={80}
                height={80}
                fill={Colors.mutedWhite}
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