import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import HeaderScreen from './HeaderScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserPermissions from './utilities/UserPermissions';
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from "../AppContext";
import FooterScreen from './FooterScreen';
import ProfileHeader from './ProfileHeader';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [customerDetails, setCustomerDetails] = useState(null);
  const [error, setError] = useState("");
  const { setIsLoggedIn } = useContext(AppContext);
  const [user, setUser] = useState({ userid: '', avatar: '' });
  const [useriid, setusriid] = useState('');

  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('id');
              setIsLoggedIn(false);
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Logout failed', 'An error occurred while logging out. Please try again.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('id');
      console.log(storedUser);
      setusriid(storedUser);
      console.log(useriid);
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        retrieveStoredAvatar(userData.userid);
      } else {
        console.error("No stored user data found");
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const retrieveStoredAvatar = async (useriid) => {
    try {
      const storedUser = await AsyncStorage.getItem('id');
      console.log(storedUser);
      const storedAvatar = await AsyncStorage.getItem(`avatar_${storedUser}`);
      if (storedAvatar) {
        setUser(prevUser => ({ ...prevUser, avatar: storedAvatar }));
      } else {
        // console.log("No avatar found for user");
      }
    } catch (error) {
      console.error('Error retrieving stored avatar:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePicker = async () => {
    await UserPermissions.getCameraPermissions();
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.cancelled && result.uri) {
        setUser(prevUser => ({ ...prevUser, avatar: result.uri }));
        await AsyncStorage.setItem(`avatar_${user.userid}`, result.uri);
      } else {
        console.log('Image selection canceled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarNavigator}>
            <TouchableOpacity onPress={handlePicker}>
              <Image style={styles.avatar} source={{ uri: user.avatar }} />
              <View style={styles.plusIconContainer}>
                <Text style={styles.plusIcon}>+</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton}>
              <Text style={styles.profileButtonText}>Posts</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.belowProfile}>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('FollowersScreen')}>
              <Text style={styles.profileButtonText}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('FollowingScreen')}>
              <Text style={styles.profileButtonText}>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('ConnectionsScreen')}>
              <Text style={styles.profileButtonText}>Connections</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
      <FooterScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
  },
  avatarNavigator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingRight:130
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: 20,
  },
  plusIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    backgroundColor: '#8EBA17',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    color: 'white',
    fontSize: 20,
  },
  profileButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  profileButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  belowProfile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ProfileScreen;
