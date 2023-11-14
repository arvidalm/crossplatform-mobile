    import { ListItem } from "@rneui/themed";
    import React from "react";
    import { useMemo } from "react";
    import { View, Text, FlatList, RefreshControl, Button } from "react-native";

    import {
    useGetUsersQuery,
    useDeleteUserMutation,
    } from "../../store/api/usersApi";

    const UserList = ({ navigation }) => {
    const { data, isLoading, refetch } = useGetUsersQuery({});
    const [deleteUser] = useDeleteUserMutation();

    const sortedData = useMemo(() => {
        if (!data) return [];
        return [...data].sort((a, b) => {
        const firstNameCompare = a.firstName.localeCompare(b.firstName);
        if (firstNameCompare !== 0) return firstNameCompare;
        return a.lastName.localeCompare(b.lastName);
        });
    }, [data]);

    const handleDelete = async (id) => {
        await deleteUser(id);
        refetch();
    };

    const handleNavigateToUserInfo = (user) => {
        navigation.navigate("UserInfo", { user });
    };

    return (
        <View>
        {isLoading ? (
            <Text>Loading...</Text>
        ) : (
            <FlatList
            data={sortedData}
            refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={refetch} />
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
                    onPress={() =>
                    navigation.navigate("UserForm", {
                        user: item,
                    })
                    }
                />
                <Button title="Delete" onPress={() => handleDelete(item.id)} />
                </ListItem>
            )}
            keyExtractor={(item) => item.id.toString()}
            />
        )}
        </View>
    );
    };

    export default UserList;
