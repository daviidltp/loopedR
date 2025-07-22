import React from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import DeleteUserIcon from '../../../../assets/icons/delete-user.svg';
import { Colors } from '../../../constants/Colors';
import { FollowRequest } from '../../../utils/mockData';
import { FollowRequestCard } from '../cards/FollowRequestCard';
import { GlobalHeader } from '../headers/GlobalHeader';
import { Layout } from '../layout';
import { AppText } from '../Text/AppText';

interface FollowRequestsModalProps {
  visible: boolean;
  requests: FollowRequest[];
  onClose: () => void;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

export const FollowRequestsModal: React.FC<FollowRequestsModalProps> = ({
  visible,
  requests,
  onClose,
  onAccept,
  onReject,
}) => {
  if (!visible) return null;
  return (
    <Layout>
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <GlobalHeader
          goBack={true}
          onLeftIconPress={onClose}
          centerContent={<AppText variant='h4' fontFamily='raleway' fontWeight='bold' color="#fff">Solicitudes de seguimiento</AppText>}
        />

        {/* Lista de solicitudes */}
        {requests.length > 0 ? (
          <FlatList
            data={requests}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <FollowRequestCard
                request={item}
                onAccept={onAccept}
                onReject={onReject}
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
    </Modal>
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