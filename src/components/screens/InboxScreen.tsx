import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import {
  currentUser,
  getFollowRequestsForUser,
  getOlderNotifications,
  getTodayNotifications,
  getWeekNotifications
} from '../../utils/mockData';
import { FollowRequestSection, NotificationCard } from '../ui/cards';
import { NotificationsHeader } from '../ui/headers/NotificationsHeader';
import { Layout } from '../ui/layout/Layout';
import { FollowRequestsModal } from '../ui/modals';
import { AppText } from '../ui/Text/AppText';

export const InboxScreen: React.FC = () => {
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [followRequests, setFollowRequests] = useState(
    getFollowRequestsForUser(currentUser.id)
  );

  // Obtener todas las notificaciones y ordenarlas por fecha
  const allNotifications = [
    ...getTodayNotifications(),
    ...getWeekNotifications(),
    ...getOlderNotifications()
  ].sort((a, b) => b.timestamp - a.timestamp);

  const handleAcceptRequest = (requestId: string) => {
    setFollowRequests(prev => prev.filter(req => req.id !== requestId));
    // Aquí añadirías la lógica para aceptar la solicitud
    console.log('Solicitud aceptada:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    setFollowRequests(prev => prev.filter(req => req.id !== requestId));
    // Aquí añadirías la lógica para rechazar la solicitud
    console.log('Solicitud rechazada:', requestId);
  };

  const handleNotificationPress = (notification: any) => {
    // Aquí añadirías la lógica para manejar el tap en la notificación
    console.log('Notificación presionada:', notification.id);
  };

  return (
    <Layout>
      
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <NotificationsHeader/>
        {/* Sección de solicitudes de seguimiento */}
        {followRequests.length > 0 && (
          <View style={styles.followRequestsContainer}>
            <FollowRequestSection
              requests={followRequests}
              onPress={() => setShowRequestsModal(true)}
            />
          </View>
        )}

        <AppText variant='body' fontFamily="inter" fontWeight="semiBold" color={Colors.white} style={styles.otherNotificationsText}>Otras notificaciones</AppText>

        {/* Sección de notificaciones */}
        <View style={styles.notificationsContainer}>
          {allNotifications.length > 0 ? (
            allNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={() => handleNotificationPress(notification)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <AppText 
                variant='body' 
                fontFamily="inter" 
                fontWeight="regular" 
                color={Colors.mutedWhite}
                style={styles.emptyText}
              >
                No tienes notificaciones
              </AppText>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de solicitudes de seguimiento */}
      <FollowRequestsModal
        visible={showRequestsModal}
        requests={followRequests}
        onClose={() => setShowRequestsModal(false)}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingBottom: 80, // Altura de la bottomNavigationBar
  },
  followRequestsContainer: {
    backgroundColor: Colors.background,
  },
  otherNotificationsText: {
    paddingVertical: 12,
    marginLeft: 28,
  },
  notificationsContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyText: {
    textAlign: 'center',
  },
}); 