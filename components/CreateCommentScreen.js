import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, FlatList, TouchableOpacity, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import icon library (you can use any icon library)
import AsyncStorage from '@react-native-async-storage/async-storage';
import medicozinConfig from '../medicozin.config';

const CreateCommentScreen = ({ route, navigation }) => {
  const { postId } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]); 

  const handleSubmit = async () => {
    try {
      const studentId = await AsyncStorage.getItem('id');
      const token = await AsyncStorage.getItem('token');

      if (!studentId || !token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${medicozinConfig.API_HOST}/createComment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: postId,
          studentId: studentId,
          content: comment,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      Alert.alert('Comment Added', 'Your comment has been successfully added.');
      setComment('');
      fetchComments();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const fetchComments = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(`${medicozinConfig.API_HOST}/getComments/${postId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
    
      setComments(data);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Comments</Text>
      </View>

      {/* Comment List */}
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentContainer}>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('ProfileScreen')}>
              <Image style={styles.avatar} source={require('../assets/avatar.png')} />
            </TouchableOpacity>
            <View>
              <Text style={styles.commentAuthor}>{item.firstName} {item.lastName}</Text>
              <Text style={styles.commentContent}>{item.content}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingTop: 50 }} // To adjust padding for header
      />

      {/* Comment Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
         <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('ProfileScreen')}>
              <Image style={styles.avatar} source={require('../assets/avatar.png')} />
            </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Write your comment here..."
          placeholderTextColor={'#f2f3f4'}
          value={comment}
          onChangeText={setComment}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
          <Image style={styles.sendIcon} source={require('../assets/send-message.png')} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#555555',
    paddingTop:30
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: '#353839',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 1,
  },
  backButton: {
    marginTop:40,
    marginLeft:15
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    marginTop:40,
    marginLeft:15
  },
  commentContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
  commentAuthor: {
    fontWeight: 'bold',
    color: 'white'
  },
  commentContent: {
    marginTop: 5,
    color: 'white'
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E1E2E6',
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#a1c217',
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#353839',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
 
   
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#353839',
    textAlignVertical: 'top',
  },
//   sendButton: {
//     marginLeft: 10,
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 25,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  sendIcon: {
    width: 35,
    height: 35,
  },
});

export default CreateCommentScreen;
