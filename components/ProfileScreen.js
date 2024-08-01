import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserPermissions from './utilities/UserPermissions';
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from "../AppContext";
import FooterScreen from './FooterScreen';
import ProfileHeader from './ProfileHeader';
import { useNavigation } from '@react-navigation/native';

const screenwidth = Dimensions.get('window').width;

const ProfileScreen = () => {
  const [user, setUser] = useState({ userid: '', avatar: '' });
  const { setIsLoggedIn } = useContext(AppContext);
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
      if (storedUser) {
        const userId = JSON.parse(storedUser);
        setUser(prevUser => ({ ...prevUser, userid: userId }));
        await retrieveStoredAvatar(userId);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const retrieveStoredAvatar = async (userId) => {
    try {
      const storedAvatar = await AsyncStorage.getItem(`avatar_${userId}`);
      if (storedAvatar) {
        setUser(prevUser => ({ ...prevUser, avatar: storedAvatar }));
      } else {
        console.log("No avatar found for user");
      }
    } catch (error) {
      console.error('Error retrieving stored avatar:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePicker = async () => {
    await UserPermissions.getMediaLibraryPermissions();

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setUser(prevUser => ({ ...prevUser, avatar: selectedImage.uri }));
        await AsyncStorage.setItem(`avatar_${user.userid}`, selectedImage.uri);
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
              <Image 
                style={styles.avatar} 
                source={ { uri: user.avatar } } 
              />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo2}>
            <View style={styles.belowProfile}>
              <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('FollowersScreen')}>
                <Text style={styles.profileButtonText}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('FollowingScreen')}>
                <Text style={styles.profileButtonText}>Articles</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('ConnectionsScreen')}>
                <Text style={styles.profileButtonText}>Rewards</Text>
              </TouchableOpacity>
            </View>
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
    marginTop:-30
    
  },
  profileInfo2: {
    alignItems: 'center',
    width: screenwidth - 22,
    maxWidth: 600,
    borderRadius: 30,
    justifyContent: 'center',
    backgroundColor: '#353839',
    paddingVertical: 10,
    marginTop: 20,
  },
  avatarNavigator: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 10,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: screenwidth - 12, // Adjust width based on margin
    height: 300,
    borderRadius: 20,
    resizeMode: 'cover',
    backgroundColor: '#ffcba4',
  },
  profileButton: {
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 10,
   
  },
  profileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '200',
  },
  belowProfile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  logoutButton: {
    marginTop: 20,
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
