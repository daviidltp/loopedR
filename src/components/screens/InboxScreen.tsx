import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useProfile } from '../../contexts/ProfileContext';
import {
  getFollowRequestsForUser
} from '../../utils/mockData';
import { FollowRequestSection } from '../ui/cards/FollowRequestSection';
import { NotificationsHeader } from '../ui/headers/NotificationsHeader';
import { Layout } from '../ui/layout/Layout';
import { FollowRequestsModal } from '../ui/modals/FollowRequestsModal';
import { AppText } from '../ui/Text/AppText';

export const InboxScreen: React.FC = () => {
  const navigation = useNavigation();
  const { profile: currentUser } = useProfile();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Obtener solicitudes de seguimiento del usuario actual
  const followRequests = currentUser ? getFollowRequestsForUser(currentUser.id) : [];

  // Aquí puedes agregar lógica para otras notificaciones si existen en el futuro
  const hasNotifications = followRequests.length > 0; // Puedes expandir esto si hay más tipos

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
          {!hasNotifications && (
            <View style={styles.emptyStateContainer}>
              <AppText variant="body" fontFamily="inter" color="#888" style={{textAlign:'center'}}>
                No tienes notificaciones
              </AppText>
            </View>
          )}
          
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
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyStateContainer: {
    justifyContent:'center', 
    alignItems:'center',
    flex: 1,
    paddingBottom: 80,
    width: '100%',
    height: '80%',
  }
}); 