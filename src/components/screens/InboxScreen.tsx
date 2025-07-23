import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useProfile } from '../../contexts/ProfileContext';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { FollowRequestSection } from '../ui/cards/FollowRequestSection';
import { NotificationsHeader } from '../ui/headers/NotificationsHeader';
import { Layout } from '../ui/layout/Layout';
// import { FollowRequestsModal } from '../ui/modals/FollowRequestsModal'; // Eliminar modal

export const InboxScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { profile: currentUser } = useProfile();
  // const [isModalVisible, setIsModalVisible] = useState(false); // Eliminar modal

  // Obtener solicitudes de seguimiento del usuario actual
  // const followRequests = currentUser ? getFollowRequestsForUser(currentUser.id) : [];
  // Ahora la lógica de solicitudes viene del contexto en FollowRequestSection

  // Aquí puedes agregar lógica para otras notificaciones si existen en el futuro
  // const hasNotifications = followRequests.length > 0; // Puedes expandir esto si hay más tipos

  const handleViewAllRequests = () => {
    navigation.navigate('FollowRequests');
  };

  // const handleAcceptRequest = (requestId: string) => { ... } // Eliminar modal
  // const handleRejectRequest = (requestId: string) => { ... } // Eliminar modal
  // const handleCloseModal = () => { ... } // Eliminar modal

  return (
    <Layout>
      <View style={styles.container}>
        <NotificationsHeader />
        <View style={styles.content}>
          <FollowRequestSection
            // requests={followRequests} // Ya no se pasa, el contexto lo gestiona
            onPress={handleViewAllRequests}
          />
          {/* Aquí puedes agregar más notificaciones si lo deseas */}
        </View>
        {/* Eliminar el modal */}
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