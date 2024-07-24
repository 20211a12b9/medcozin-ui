import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, FlatList, Text, Image,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileHeader from './ProfileHeader';
import medicozinConfig from '../medicozin.config';

const FollowersScreen = () => {
  const [followers, setFollowers] = useState([]);
  const [sd,setSd1]=useState('')

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('id');
        const jwt = await AsyncStorage.getItem('token');
        console.log("jwt", jwt, "id", storedUser);

        const response = await fetch(`${medicozinConfig.API_HOST}/getFollowers`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + jwt,
          },
        });

        if (response.status === 200) {
          const data = await response.json(); // Assuming the response is in JSON format
          console.log("data", data);
          setFollowers(data); // Set the fetched data to state
          console.log("data00", followers[0].followeruserid);
          setSd1(followers[0].followeruserid)
        } else if (response.status === 403) {
          await AsyncStorage.removeItem('token');
          throw new Error('Unauthorized');
        } else {
          throw new Error('Failed to fetch followers');
        }
      } catch (error) {
        console.error('Error fetching followers:', error);
        Alert.alert('Error', 'Failed to fetch followers');
      }
    };

    fetchFollowers();
  }, []); // Empty dependency array means this effect runs once after the initial render

  
 
  return (
    <View style={styles.container}>
      <ProfileHeader />
    
   
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  followerContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialization: {
    fontSize: 14,
    color: '#666',
  },
});

export default FollowersScreen;
