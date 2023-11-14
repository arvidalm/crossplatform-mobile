    /* eslint-disable import/no-duplicates */
    import { Input, Button } from "@rneui/themed";
    import React from "react";
    import { useRef, useState } from "react";
    import {
    Text,
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    } from "react-native";
    import { useToast } from "react-native-toast-notifications";

    import {
    useCreateUserMutation,
    useUpdateUserMutation,
    } from "../../store/api/usersApi";

    export const UserForm = ({ route, navigation }) => {
    const lastNameRef = useRef(null);
    const [id, setId] = useState(route?.params?.user?.id || "");
    const [firstName, setFirstName] = useState(
        route?.params?.user?.firstName || "",
    );
    const [lastName, setLastName] = useState(route?.params?.user?.lastName || "");
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const toast = useToast();

    const isUpdatingUser = id !== ""; // Om vi har ett ID, betyder det att vi uppdaterar en användare

    const handleSubmit = async () => {
        if (firstName === "" || lastName === "") {
        toast.show("Please fill out all inputs", {
            type: "warning",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
        });
        return;
        }

        try {
        if (isUpdatingUser) {
            await updateUser({ user: { id, firstName, lastName } });
            toast.show("Användaren uppdaterad!", {
            type: "success",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
            });
        } else {
            await createUser({ user: { firstName, lastName } });
            toast.show("Användare skapad!", {
            type: "success",
            placement: "top",
            duration: 4000,
            animationType: "slide-in",
            });
        }
        } catch (error) {
        toast.show(error.message, { type: "danger" });
        } finally {
        navigation.goBack();
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.parentContainer}>
            <View style={styles.container}>
            <Text style={styles.title}>
                {isUpdatingUser ? "Update your user" : "Create your user"}
            </Text>
            <Input
                returnKeyType="next"
                onSubmitEditing={() => lastNameRef.current?.focus()}
                blurOnSubmit={false}
                value={firstName}
                disabled={isCreating || isUpdating}
                onChangeText={setFirstName}
                placeholder="First name"
            />
            <Input
                ref={lastNameRef}
                value={lastName}
                disabled={isCreating || isUpdating}
                returnKeyType="send"
                onSubmitEditing={handleSubmit}
                onChangeText={setLastName}
                placeholder="Last name"
            />
            <Button
                title={isUpdatingUser ? "Update user" : "Create user"}
                disabled={isCreating || isUpdating}
                loading={isCreating || isUpdating}
                onPress={handleSubmit}
            />
            </View>
        </View>
        </TouchableWithoutFeedback>
    );
    };

    const styles = StyleSheet.create({
    parentContainer: {
        flex: 1,
        backgroundColor: "white",
        borderColor: "#eee",
        borderWidth: 1,
        borderRadius: 16,
        justifyContent: "center",
    },
    container: {
        padding: 16,
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
    },
    });

    export default UserForm;
