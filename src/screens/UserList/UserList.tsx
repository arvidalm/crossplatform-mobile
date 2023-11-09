import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useGetUsersQuery } from '../../store/api/usersApi';
import { SearchBar, Avatar } from '@rneui/themed';

const UserList = ({ navigation }) => {
  const { data, isLoading } = useGetUsersQuery({});
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data) {
      const filtered = data.filter((item) => {
        const itemData = `${item.firstName.toUpperCase()} ${item.lastName.toUpperCase()}`;
        const searchData = search.toUpperCase();
        return itemData.indexOf(searchData) > -1;
      });
      setFilteredData(filtered);
    }
  }, [search, data]);

  const renderUserProfile = ({ item }) => (
    <View style={styles.profileCardContainer}>
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => navigation.navigate('UserInfo', { user: item })}
      >
        <Avatar
          size="large"
          rounded
          source={{
            uri: item.profilePicture || 'https://s.yimg.com/ny/api/res/1.2/PMsgs4BBYyt0dDLTaaevoA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTM2MA--/https://media.zenfs.com/en/wrestle_zone_910/4017f03ebe9586c01755b4b3a524c81d',
          }}
          containerStyle={styles.avatarContainer}
        />
        <Text style={styles.name}>{`${item.firstName} ${item.lastName}`}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search Users..."
        onChangeText={setSearch}
        value={search}
        lightTheme
        round
      />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderUserProfile}
          numColumns={2} // Adjust the number of columns for the grid layout
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  profileCardContainer: {
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    width: 150, // Fixed width for the card
    height: 200, // Fixed height for the card
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    marginBottom: 10, // Adjust as needed
  },
  name: {
    marginTop: 10,
    textAlign: 'center',
  },
  flatListContent: {
    paddingVertical: 10,
  },
});

export default UserList;
