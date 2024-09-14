import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import medicozinConfig from '../medicozin.config';

const Requests = () => {
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('id');
        if (storedUser) {
          const response = await fetch(`${medicozinConfig.API_HOST}/getFollowingg/${storedUser}`);
          if (response.ok) {
            const data = await response.json();
            setFollowing(data);
            console.log("--...--", data);
          } else {
            throw new Error('Failed to fetch following');
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

    fetchFollowing();
  }, []);

  const renderFollowing = ({ item }) => (
    <TouchableOpacity
      style={styles.followerContainer}
      onPress={() => navigation.navigate('ProfileScreenOfFollowersOrFollowing', { followerId: item[0] })}
    >
      <Image
        style={styles.avatar}
        source={{ uri: `${medicozinConfig.API_HOST}${item[7]}` }}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item[3]} {item[4]}</Text>
        <Text style={styles.specialization}>{item[6]}</Text>
      </View>
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('NetworkScreen')}>
        <Image style={styles.appIcon} source={require('../assets/check-mark.png')} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconContainer2} onPress={() => navigation.navigate('PostForm')}>
        <Image style={styles.appIcon} source={require('../assets/delete.png')} />
      </TouchableOpacity>
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
      <FlatList
        data={following}
        keyExtractor={(item) => item.folloersId ? item.folloersId.toString() : Math.random().toString()}
        renderItem={renderFollowing}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 40,
  },
  followerContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    paddingRight: 120,
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
    fontSize: 16,
  },
  iconContainer: {
    marginLeft: 40,
  },
  iconContainer2 : {
    marginLeft: 20,
  },
  appIcon: {
    width: 24,
    height: 24,
  },
});

export default Requests;
