import React from 'react';
import { FlatList, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { useFollowers } from '../../../contexts/FollowersContext';
import { CheckIcon } from '../../icons/CheckIcon';
import { CrossIcon } from '../../icons/CrossIcon';
import { AppText } from '../Text/AppText';

interface FollowRequestsModalProps {
  visible: boolean;
  requests: any[]; // This type will need to be updated based on the new structure
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
  const { followRequests, acceptFollowRequest, rejectFollowRequest, isLoading } = useFollowers();

  const handleAccept = async (requestId: string) => {
    await acceptFollowRequest(requestId);
  };
  const handleReject = async (requestId: string) => {
    await rejectFollowRequest(requestId);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={modalStyles.requestItem}>
      <Image source={{ uri: item.follower_profile?.avatar_url || '' }} style={modalStyles.avatar} />
      <View style={modalStyles.infoContainer}>
        <AppText variant="body" fontFamily="inter" fontWeight="semiBold" color={Colors.white}>
          {item.follower_profile?.display_name || item.follower_profile?.username || 'Usuario'}
        </AppText>
        <AppText variant="bodySmall" fontFamily="inter" color={Colors.mutedWhite}>
          @{item.follower_profile?.username || 'usuario'}
        </AppText>
        {item.follower_profile?.is_verified && (
          <AppText variant="bodySmall" fontFamily="inter" color={Colors.white}>
            ✔ Verificado
          </AppText>
        )}
      </View>
      <View style={modalStyles.actions}>
        <TouchableOpacity onPress={() => handleAccept(item.id)} disabled={isLoading} style={modalStyles.actionBtn}>
          <CheckIcon size={24} color={Colors.spotifyGreen || '#1DB954'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleReject(item.id)} disabled={isLoading} style={modalStyles.actionBtn}>
          <CrossIcon size={24} color={'#fa233b'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!visible) return null;
  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide" transparent>
      <View style={modalStyles.overlay}>
        <View style={modalStyles.modalContent}>
          <AppText variant="h5" fontFamily="inter" fontWeight="bold" color={Colors.white} style={modalStyles.title}>
            Solicitudes de seguimiento
          </AppText>
          {followRequests.length > 0 ? (
            <FlatList
              data={followRequests}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              style={modalStyles.list}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={modalStyles.emptyContainer}>
              <AppText variant="body" fontFamily="inter" color={Colors.mutedWhite}>
                No tienes solicitudes de seguimiento
              </AppText>
            </View>
          )}
          <TouchableOpacity onPress={onClose} style={modalStyles.closeBtn}>
            <AppText variant="body" fontFamily="inter" color={Colors.white}>Cerrar</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxHeight: '80%',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    marginBottom: 16,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: Colors.backgroundSoft,
  },
  infoContainer: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtn: {
    marginHorizontal: 4,
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginVertical: 32,
  },
  closeBtn: {
    alignSelf: 'center',
    marginTop: 8,
    padding: 8,
  },
}); 