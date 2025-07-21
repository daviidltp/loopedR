import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { User } from '../../../utils/mockData';
import { UserListItem } from './UserListItem';

interface UserListProps {
  users: User[];
  onUserPress?: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  onUserPress,
}) => {
  const renderUser = ({ item }: { item: User }) => (
    <UserListItem 
      user={item}
      onPress={onUserPress}
    />
  );

  return (
    <FlatList
      data={users}
      renderItem={renderUser}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 0,
  },
}); 