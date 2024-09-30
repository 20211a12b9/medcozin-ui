import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, ActivityIndicator,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileHeader from './ProfileHeader'; // Assuming this is a component you have
import medicozinConfig from '../medicozin.config';
import { useNavigation } from '@react-navigation/native';

const FollowersScreen = () => {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({ userid: '', avatar: '' });
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('id');
        if (storedUser) {
          const response = await fetch(`${medicozinConfig.API_HOST}/getFollowers/${storedUser}`);
          if (response.ok) {
            const data = await response.json();
            console.log("fdata-----", data);
            setFollowers(data);
          } else {
            throw new Error('Failed to fetch followers');
          }
        } else {
          throw new Error('User ID not found');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, []);
// console.log("followers",followers[0].follower.specialization)
  const renderFollower = ({ item }) => (
    
       <TouchableOpacity 
        style={styles.followerContainer}
        onPress={() => navigation.navigate('ProfileScreenOfFollowersOrFollowing', {followerId: item[0] })}
      >
     <Image
        style={styles.avatar}
        source={{ uri: `${medicozinConfig.API_HOST}${item[7]}` }}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item[3]} {item[4]}</Text>
        <Text style={styles.specialization}>{item[6]}</Text>
      </View>
      </TouchableOpacity>
   
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <FlatList
        data={followers}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
        renderItem={renderFollower}
      />
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
    alignItems: 'center',
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
  },
});

export default FollowersScreen;
