import React, { useState, useCallback, useRef } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import medicozinConfig from '../medicozin.config';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LikeButton from './LikeButton';
import { Video } from 'expo-av';

const screenWidth = Dimensions.get('window').width;

const PostsScreen = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [viewableItems, setViewableItems] = useState([]);
  const navigation = useNavigation();
  const [user, setUser] = useState({ userid: '', avatar: '' });

  const handleLikeUpdate = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.postId === updatedPost.postId ? updatedPost : post))
    );
  };

  const fetchPosts = async () => {
    try {
      const jwt = await AsyncStorage.getItem('token');
      if (!jwt) {
        throw new Error('No token found');
      }

      const response = await fetch(`${medicozinConfig.API_HOST}/getAll`, {
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
      setError(error.message);
      console.error('Error fetching posts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPosts();
  }, []);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    setViewableItems(viewableItems);
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // Corrected handleVideoRef function
  const handleVideoRef = (postId) => (ref) => {
    if (ref) {
      const isVisible = viewableItems.some(item => item.item.postId === postId);
      if (isVisible) {
        ref.playAsync(); // Play video if the post is visible
      } else {
        ref.pauseAsync(); // Pause video if the post is not visible
      }
    }
  };

  const renderItem = ({ item, index }) => {
    const { postId, imageUrl, content, studentEntity, type } = item;

    return (
      <TouchableOpacity onPress={() => navigation.navigate('PostDetailScreen', {
        post: item,
        posts,
        currentIndex: index,
        onLikeUpdate: handleLikeUpdate,
      })}>
        <View style={styles.postContainer}>
          <View style={styles.imageContainer}>
            {type === 'video' ? (
              <Video
                source={{ uri: imageUrl }}
                style={styles.postImage}
                useNativeControls
                resizeMode="cover"
                ref={handleVideoRef(postId)} // Attach ref to manage playback
              />
            ) : (
              <Image
                source={{ uri: imageUrl }}
                style={styles.postImage}
              />
            )}
            <View style={styles.headerContainer}>
              <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('ProfileScreen')}>
                <Image style={styles.avatar} source={user.avatar ? { uri: user.avatar } : require('../assets/avatar.png')} />
              </TouchableOpacity>
              <Text style={styles.userName}>{studentEntity.firstname}</Text>
            </View>
            <View style={styles.actionContainer}>
              <View style={styles.leftIcons}>
                <TouchableOpacity style={styles.iconContainerWithText} onPress={() => navigation.navigate('CreateCommentScreen', { postId })}>
                  <Image style={styles.icon} source={require('../assets/comment.png')} />
                  <Text style={styles.iconText}>1</Text>
                </TouchableOpacity>
                <LikeButton postId={postId} />
              </View>
              <View style={styles.rightIcons}>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('')}>
                  <Image style={styles.icon} source={require('../assets/bookmark.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('')}>
                  <Image style={styles.icon} source={require('../assets/share.png')} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <Text style={styles.postContent} numberOfLines={2}>{content}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.postId.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    margin: -16,
  },
  imageContainer: {
    position: 'relative',
  },
  headerContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.91,
    shadowRadius: 8,
    elevation: 2,
  },
  postImage: {
    width: screenWidth - 54, // Adjust width based on margin
    height: 300,
    borderRadius: 8,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  errorText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'red',
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
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftIcons: {
    flexDirection: 'row',
    marginLeft: -29,
  },
  rightIcons: {
    flexDirection: 'row',
    marginRight: -29,
  },
  iconContainer: {
    padding: 4,
    backgroundColor: '#b7e637',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  iconContainerWithText: {
    padding: 4,
    paddingHorizontal: 8,
    backgroundColor: '#b7e637',
    borderRadius: 15,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  iconText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  postContent: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default PostsScreen;
