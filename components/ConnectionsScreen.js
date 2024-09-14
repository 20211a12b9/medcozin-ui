import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileHeader from './ProfileHeader';
import medicozinConfig from '../medicozin.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConnectionsScreen = ({followerId}) => {


  const createFollower = async () => {
    try {
        const storedUser = await AsyncStorage.getItem('id');
      const response = await fetch(`${medicozinConfig.API_HOST}/createConnection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: followerId,
          follower: { studentId: storedUser },
        }),
      });

      if (response.ok) {
        setStatus('Follower created successfully');
      } else {
        setStatus('Error creating follower');
      }
    } catch (error) {
      setStatus('Error creating follower');
    }
  };
  return (
    <View style={styles.container}>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ConnectionsScreen;
