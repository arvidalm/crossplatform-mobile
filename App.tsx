import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider, useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ToastProvider } from 'react-native-toast-notifications';

// Import the Redux store and components
import { store } from './src/store/store';
import UserList from './src/screens/UserList/UserList';
import { UserForm } from './src/screens/UserForm/UserForm';
import { UserInfo } from './src/screens/UserInfo/UserInfo';
import UserPost from './src/screens/UserPost/UserPost'; // Make sure this import path matches your file structure

const UserListStack = createNativeStackNavigator();

const UserListStackScreen = () => {
  return (
    <UserListStack.Navigator>
      <UserListStack.Screen name="UserList" component={UserList} />
      <UserListStack.Screen name="UserInfo" component={UserInfo} />
      {/* If you have a dedicated screen for creating posts, include it here as a stack screen */}
    </UserListStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const NavigationWrapper = () => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="UserListStack" component={UserListStackScreen} />
        <Tab.Screen name="UserForm" component={UserForm} options={{ headerShown: true }} />
        {/* Conditionally render the UserInfo and UserPost tabs only when a user is logged in */}
        {loggedInAs && (
          <>
            <Tab.Screen name="UserInfo" component={UserInfo} options={{ title: `${loggedInAs.firstName} ${loggedInAs.lastName}` }} />
            {/* Add the UserPost screen to the Tab navigator */}
            <Tab.Screen name="UserPost" component={UserPost} options={{ title: 'Posts' }} />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <NavigationWrapper />
      </Provider>
    </ToastProvider>
  );
}
