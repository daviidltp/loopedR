import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import {
	getFollowRequestsForUser
} from '../../utils/mockData';
import { FollowRequestSection } from '../ui/cards/FollowRequestSection';
import { NotificationsHeader } from '../ui/headers/NotificationsHeader';
import { Layout } from '../ui/layout/Layout';
import { FollowRequestsModal } from '../ui/modals/FollowRequestsModal';

export const InboxScreen: React.FC = () => {
  const navigation = useNavigation();
  const { currentUser } = useCurrentUser();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Obtener solicitudes de seguimiento del usuario actual
  const followRequests = currentUser ? getFollowRequestsForUser(currentUser.id) : [];

  const handleViewAllRequests = () => {
    setIsModalVisible(true);
  };

  const handleAcceptRequest = (requestId: string) => {
    console.log('Aceptar solicitud:', requestId);
    // TODO: Implementar aceptar solicitud
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Rechazar solicitud:', requestId);
    // TODO: Implementar rechazar solicitud
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout>
      <View style={styles.container}>
        <NotificationsHeader />
        
        <View style={styles.content}>
          <FollowRequestSection
            requests={followRequests}
            onPress={handleViewAllRequests}
          />
        </View>

        <FollowRequestsModal
          visible={isModalVisible}
          requests={followRequests}
          onClose={handleCloseModal}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
        />
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
}); 