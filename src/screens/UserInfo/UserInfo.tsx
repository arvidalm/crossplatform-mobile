import { StyleSheet, View, Image } from "react-native";
import { Button, Text } from "@rneui/themed";
import { logIn, logOut } from "../../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

export const UserInfo = ({ route, navigation }) => {
	const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const user = route?.params?.user || loggedInAs;
	const dispatch = useDispatch()

    const profileData = {
        email: user.email || 'user@example.com', // If you have email in user object, otherwise mock
        bio: 'We out here',
        // More profile fields can be added here
      };

      return (
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: user.profilePicture || 'https://s.yimg.com/ny/api/res/1.2/PMsgs4BBYyt0dDLTaaevoA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTM2MA--/https://media.zenfs.com/en/wrestle_zone_910/4017f03ebe9586c01755b4b3a524c81d' }}
              style={styles.avatar}
            />
            <Text h4 style={styles.name}>{`${user.firstName} ${user.lastName}`}</Text>
            <Text style={styles.email}>{profileData.email}</Text>
            <Text style={styles.bio}>{profileData.bio}</Text>
            {/* Additional profile info can be rendered here */}
          </View>
          <View style={styles.actionsContainer}>
            {loggedInAs?.id === user.id ? (
              <Button onPress={() => dispatch(logOut())} title="Logga ut" color="error"></Button>
            ) : (
              <Button onPress={() => dispatch(logIn(user))} title="Logga in"></Button>
            )}
          </View>
        </View>
      );
    };

    const styles = StyleSheet.create({
      container: {
        flex: 1,
        margin: 24,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 36,
      },
      profileContainer: {
        alignItems: 'center',
        marginBottom: 24,
      },
      avatar: {
        width: 150,
        height: 150,
        borderRadius: 60,
        marginBottom: 16,
      },
      name: {
        marginBottom: 4,
      },
      email: {
        marginBottom: 4,
      },
      bio: {
        textAlign: 'center',
        marginBottom: 16,
      },
      actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      // ...other styles if needed
    });

    export default UserInfo;
