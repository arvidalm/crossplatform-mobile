import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Button,
  StyleSheet,
} from "react-native";
import { useToast } from "react-native-toast-notifications";

import UserItem from "../../components/UserItem";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../store/api/usersApi";

const UserList = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetUsersQuery({});
  const [deleteUser] = useDeleteUserMutation();
  const [selectedUsers, setSelectedUsers] = useState({});
  const toast = useToast();

  const sortedData = useMemo(() => {
    if (!data) return [];
    return [...data].sort(
      (a, b) =>
        a.firstName.localeCompare(b.firstName) ||
        a.lastName.localeCompare(b.lastName),
    );
  }, [data]);

  const handleSelectUser = (userId, isSelected) => {
    setSelectedUsers((prev) => ({
      ...prev,
      [userId]: isSelected,
    }));
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      refetch();
      toast.show("User deleted successfully!", { type: "success" });
    } catch (error) {
      toast.show("Failed to delete user.", { type: "danger" });
    }
  };

  const handleBulkDelete = async () => {
    try {
      const usersToDelete = Object.keys(selectedUsers).filter(
        (userId) => selectedUsers[userId],
      );
      await Promise.all(
        usersToDelete.map((userId) => deleteUser(userId).unwrap()),
      );
      setSelectedUsers({}); // Rensa urval efter radering
      refetch();
      toast.show("Users deleted successfully!", { type: "success" });
    } catch (error) {
      toast.show("Failed to delete users.", { type: "danger" });
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <FlatList
            data={sortedData}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            renderItem={({ item }) => (
              <UserItem
                user={item}
                isSelected={!!selectedUsers[item.id]}
                onSelect={(isSelected) => handleSelectUser(item.id, isSelected)}
                onEdit={() => navigation.navigate("UserForm", { user: item })}
                onDelete={() => handleDelete(item.id)}
                onNavigate={() =>
                  navigation.navigate("UserInfo", { user: item })
                }
              />
            )}
            keyExtractor={(item) => item.id.toString()}
          />
          {Object.values(selectedUsers).some((isSelected) => isSelected) && (
            <Button title="Bulk Delete" onPress={handleBulkDelete} />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Lägg till fler stilar om det behövs
});

export default UserList;
