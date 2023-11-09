import React from 'react';
import { View, Text, FlatList, RefreshControl, Button } from 'react-native';
import { ListItem } from '@rneui/themed';
import {
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation, // This hook needs to be created and exported in your usersApi file.
} from '../../store/api/usersApi';

const UserList = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation(); // If this doesn't exist, you'll need to create it.

  const handleDelete = async (id) => {
    await deleteUser(id).unwrap();
    refetch();
  };

  const handleEdit = (user) => {
    navigation.navigate('UserForm', { user });
  };

  const handleNavigateToUserInfo = (user) => {
    navigation.navigate('UserInfo', { user });
  };

  const handleNavigateToPostForm = () => {
    navigation.navigate('PostForm'); // Use the correct screen name for PostForm.
  };

  return (
    <View>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={data}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refetch}
            />
          }
          renderItem={({ item }) => (
            <ListItem
              bottomDivider
              onPress={() => handleNavigateToUserInfo(item)}
            >
              <ListItem.Content>
                <ListItem.Title>{`${item.firstName} ${item.lastName}`}</ListItem.Title>
              </ListItem.Content>
              <Button
                title="Edit"
                onPress={() => handleEdit(item)}
              />
              <Button
                title="Delete"
                onPress={() => handleDelete(item.id)}
              />
            </ListItem>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Button title="Create Post" onPress={handleNavigateToPostForm} />
    </View>
  );
};

export default UserList;
