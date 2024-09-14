import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import HeaderScreen from './HeaderScreen';
import FooterScreen from './FooterScreen';
import PostsScreen from './PostsScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import medicozinConfig from '../medicozin.config';

const { width, height } = Dimensions.get('window');

const StudentHome = () => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const jwt = await AsyncStorage.getItem('token');
      if (!jwt) {
        throw new Error('No token found');
      }
      const storedUser = await AsyncStorage.getItem('id');
      const response = await fetch(`${medicozinConfig.API_HOST}/getAll/${storedUser}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLikeUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.postId === updatedPost.postId ? updatedPost : post))
    );
  };

  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      fetchPosts();
    }, [])
  );

  return (
    <View style={styles.container}>
      <HeaderScreen />
      <View style={styles.contentContainer}>
        <PostsScreen
          posts={posts}
          refreshing={refreshing}
          onRefresh={fetchPosts}
          onLikeUpdate={handleLikeUpdate}
        />
      </View>
      <FooterScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9ebee',
  },
  contentContainer: {
    flex: 1,
    width: width,
    height: height,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default StudentHome;
