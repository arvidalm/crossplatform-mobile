import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { useCreatePostMutation } from '../../store/api/postsApi';

const CreatePost = () => {
  const [postContent, setPostContent] = useState('');
  const [createPost, { isLoading }] = useCreatePostMutation();

  const handlePostCreation = async () => {
    if (postContent.trim() === '') {
      Alert.alert('Error', 'Post content cannot be empty.');
      return;
    }
    try {
      await createPost({ content: postContent }).unwrap();
      setPostContent('');
      Alert.alert('Success', 'Post created successfully!');
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('Error', 'There was an error creating the post.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <TextInput
          multiline
          placeholder="What's on your mind?"
          style={styles.input}
          value={postContent}
          onChangeText={setPostContent}
          returnKeyType="done"
          onSubmitEditing={Keyboard.dismiss}
        />
        <View style={styles.buttonContainer}>
          <Button
            title={isLoading ? 'Posting...' : 'Post'}
            onPress={handlePostCreation}
            disabled={isLoading}
            color="#1a73e8" // Example button color, adjust as needed
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5', // Light grey background
  },
  input: {
    minHeight: 100, // Adjusted for better space
    borderColor: 'gray',
    borderWidth: 1,
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    textAlignVertical: 'top',
    fontSize: 16, // Larger font size for better readability
  },
  buttonContainer: {
    marginTop: 10,
    elevation: 3, // Adds a slight shadow to the button on Android
    borderRadius: 5, // Slight rounding of corners for the button
  },
});

export default CreatePost;
