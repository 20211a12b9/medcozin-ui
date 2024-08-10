import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import medicozinConfig from '../medicozin.config';

const LikeButton = ({ postId, style = {}, onLikeChange }) => {
    const [isLiked, setIsLiked] = useState(false);
  
    useEffect(() => {
      const checkIfLiked = async () => {
        try {
          const studentId = await AsyncStorage.getItem('id');
          const token = await AsyncStorage.getItem('token');
  
          if (!studentId || !token) {
            throw new Error('User not authenticated');
          }
  
          const response = await fetch(`${medicozinConfig.API_HOST}/Likestatus`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              postId: Number(postId),
              studentId: Number(studentId),
            }),
          });
  
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
  
          const data = await response.json();
          setIsLiked(data); // Data should be a boolean indicating if the post is liked
        } catch (error) {
          Alert.alert('Error', error.message);
        }
      };
  
      checkIfLiked();
    }, [postId]);
  
    const handleLike = async () => {
      try {
        const studentId = await AsyncStorage.getItem('id');
        const token = await AsyncStorage.getItem('token');
  
        if (!studentId || !token) {
          throw new Error('User not authenticated');
        }
  
        let response;
        if (isLiked) {
          // If already liked, send a DELETE request to unlike
          response = await fetch(`${medicozinConfig.API_HOST}/deleteLike`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              postId: Number(postId),
              studentId: Number(studentId),
            }),
          });
  
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
        } else {
          // If not liked, send a POST request to like
          response = await fetch(`${medicozinConfig.API_HOST}/createLike`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              postId: Number(postId),
              studentId: Number(studentId),
            }),
          });
  
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
        }
  
        // Fetch the updated like status
        const updatedIsLiked = !isLiked;
        setIsLiked(updatedIsLiked);
  
        // Notify the parent component of the like status change
        if (onLikeChange) {
          onLikeChange(updatedIsLiked);
        }
        
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };
  
    return (
      <TouchableOpacity
        style={[styles.iconContainer, style.container]}
        onPress={handleLike}
      >
        <Image
          style={[styles.icon, style.icon]}
          source={isLiked ? require('../assets/heart-rate.png') : require('../assets/heart.png')}
        />
      </TouchableOpacity>
    );
  };
  

const styles = StyleSheet.create({
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#c4d870',
    borderRadius: 15,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default LikeButton;
