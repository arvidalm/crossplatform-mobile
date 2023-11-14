import { Button, Text } from "@rneui/themed";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import { logIn, logOut } from "../../store/slices/authSlice";

export const UserInfo = ({ route, navigation }) => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const user = route?.params?.user || loggedInAs;
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text h4>{`${user.firstName} ${user.lastName}`}</Text>
      </View>
      <View style={styles.actionsContainer}>
        {loggedInAs?.id === user.id ? (
          <>
            <View style={styles.buttonWrapper}>
              <Button
                onPress={() => dispatch(logOut())}
                title="Logga ut"
                color="error"
              />
            </View>
          </>
        ) : (
          <View style={styles.buttonWrapper}>
            <Button onPress={() => dispatch(logIn(user))} title="Logga in" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 24,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 36,
  },
  infoContainer: {
    marginBottom: 24,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  buttonWrapper: {
    width: "50%", // Kontrollerar bredden på knappen
    alignSelf: "center", // Centrerar knappen
  },
});
