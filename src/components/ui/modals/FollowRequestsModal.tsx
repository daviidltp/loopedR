import React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-paper';
import DeleteUserIcon from '../../../../assets/icons/delete-user.svg';
import { Colors } from '../../../constants/Colors';
import { FollowRequest } from '../../../utils/mockData';
import { AppText } from '../Text/AppText';
import { FollowRequestCard } from '../cards/FollowRequestCard';

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
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.leftSection}>
            <Pressable
              style={styles.backButton}
              onPress={onClose}
              android_ripple={{ 
                color: 'rgba(255, 255, 255, 0.2)',
                borderless: true,
                radius: 20
              }}
            >
              <Icon
                source="arrow-left"
                size={26}
                color={Colors.white}
              />
            </Pressable>
        
            <View style={styles.titleContainer}>
              <AppText 
                fontSize={20} 
                fontFamily="inter" 
                fontWeight="semiBold" 
                color={Colors.white}
                style={styles.titleText}
              >
                Solicitudes de seguimiento
              </AppText>
            </View>
          </View>
        </View>

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
                fill={Colors.gray[400]}
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
              fontSize={14}
              fontFamily="inter" 
              fontWeight="regular" 
              color={Colors.gray[500]}
              style={styles.emptySubtext}
            >
              Te avisaremos cuando recibas una solicitud
            </AppText>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    minHeight: 48,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 40,
  },
  titleText: {
    lineHeight: 24,
    includeFontPadding: false,
    textAlignVertical: 'center',
    marginLeft: 8,
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
    lineHeight: 20,
  },
}); 