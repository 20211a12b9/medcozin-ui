import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import LikeButton from './LikeButton';

const screenWidth = Dimensions.get('window').width;

const PostDetailScreen = ({ route }) => {
  const { post, onLikeUpdate } = route.params; // Get the post object from navigation params
  const navigation = useNavigation();
  const videoRef = useRef(null); // Create a ref for the Video component

  const handleLikeChange = (updatedIsLiked) => {
    const updatedPost = { ...post, liked: updatedIsLiked };
    onLikeUpdate(updatedPost);
  };

  // Automatically play video when the screen is first loaded
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playAsync(); // Play video automatically when component mounts
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.imageContainer}>
        {post.type === 'video' ? (
          <Video
            source={{ uri: post.imageUrl }}
            style={styles.postImage}
            useNativeControls
            resizeMode="cover"
            ref={videoRef} // Attach ref to manage playback
          />
        ) : (
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.postImage}
          />
        )}
        <View style={styles.actionContainer}>
          <View style={styles.leftIcons}>
            <TouchableOpacity style={styles.iconContainerWithText} onPress={() => navigation.navigate('CreateCommentScreen', { postId: post.postId })}>
              <Image style={styles.icon} source={require('../assets/comment.png')} />
              <Text style={styles.iconText}>1</Text>
            </TouchableOpacity>
            <LikeButton postId={post.postId} onLikeChange={handleLikeChange} />
          </View>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconContainer}>
              <Image style={styles.icon} source={require('../assets/bookmark.png')} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconContainer}>
              <Image style={styles.icon} source={require('../assets/share.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView 
        style={styles.contentBackdrop} 
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.postContent}>{post.content}</Text>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 16,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 19,
    paddingTop: 70,
  },
  postImage: {
    width: screenWidth - 32,
    height: 300,
    borderRadius: 8,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  actionContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  leftIcons: {
    flexDirection: 'row',
  },
  rightIcons: {
    flexDirection: 'row',
  },
  iconContainer: {
    padding: 8,
    backgroundColor: '#c4d870',
    borderRadius: 15,
    marginHorizontal: 5,
  },
  iconContainerWithText: {
    padding: 8,
    paddingHorizontal: 10,
    backgroundColor: '#c4d870',
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
  contentBackdrop: {
    backgroundColor: 'rgba(65, 105, 225, 0.8)', // Royal blue color with some transparency
    borderRadius: 8,
    padding: 16,
    marginTop: -15.7,
    marginBottom: -15,
  },
  postContent: {
    fontSize: 16,
    color: '#fff', // White text color for contrast
    lineHeight: 20,
    paddingBottom: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#353839',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 1,
  },
  backButton: {
    marginTop: 40,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PostDetailScreen;
